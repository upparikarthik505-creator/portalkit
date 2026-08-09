"use client";

import { nanoid } from "nanoid";
import type { Project } from "./types";

export type CalendarEventType =
  | "call"
  | "deadline"
  | "milestone"
  | "launch"
  | "reminder";

export type CalendarEvent = {
  id: string;
  title: string;
  type: CalendarEventType;
  date: string; // YYYY-MM-DD
  time?: string; // e.g. "14:00" or "10:30 AM"
  durationMinutes?: number;
  projectId?: string | null;
  projectName?: string;
  clientName?: string;
  clientEmail?: string;
  meetUrl?: string;
  notes?: string;
  completed?: boolean;
  isSystemGenerated?: boolean;
};

export type BookingSettings = {
  studioName: string;
  bookingSlug: string;
  availableDays: string[];
  startHour: string;
  endHour: string;
  callDurationMinutes: number;
  bufferMinutes: number;
  meetLink: string;
  bookingIntro: string;
};

export const DEFAULT_BOOKING_SETTINGS: BookingSettings = {
  studioName: "My Shopify Studio",
  bookingSlug: "discovery-call",
  availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  startHour: "10:00",
  endHour: "17:00",
  callDurationMinutes: 30,
  bufferMinutes: 15,
  meetLink: "https://meet.google.com/new",
  bookingIntro:
    "Book a 30-minute discovery call to discuss your Shopify store architecture, theme rebuild, or optimization roadmap.",
};

const STORAGE_KEY_EVENTS = "portalkit.calendar.events.v2";
const STORAGE_KEY_SETTINGS = "portalkit.calendar.settings.v2";

function canUseStorage() {
  return typeof window !== "undefined" && !!window.localStorage;
}

// Generate sensible relative dates for initial demo
function relativeDate(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

export const INITIAL_DEMO_EVENTS: CalendarEvent[] = [
  {
    id: "evt_1",
    title: "Discovery Call: Kith Apparel",
    type: "call",
    date: relativeDate(1),
    time: "10:30 AM",
    durationMinutes: 30,
    clientName: "Sarah Miller",
    clientEmail: "sarah@kithapparel.com",
    meetUrl: "https://meet.google.com/abc-defg-hij",
    notes: "Reviewing theme architecture requirements & Figma file handover.",
  },
  {
    id: "evt_2",
    title: "Theme Rebuild Milestone 1: Homepage QA",
    type: "milestone",
    date: relativeDate(3),
    time: "03:00 PM",
    durationMinutes: 45,
    projectName: "Aura Skincare 2.0 Theme Rebuild",
    clientName: "Elena Rostova",
    notes: "Review custom liquid section performance and mobile drawer cart.",
  },
  {
    id: "evt_3",
    title: "Launch Day: Nomad Coffee Roasters",
    type: "launch",
    date: relativeDate(7),
    time: "09:00 AM",
    durationMinutes: 60,
    projectName: "Nomad Roasters Replatform",
    clientName: "Marcus Vance",
    notes: "DNS cutover, payment gateway test transaction, 301 redirects verification.",
  },
  {
    id: "evt_4",
    title: "Retainer Check-in: Velvet Home",
    type: "call",
    date: relativeDate(10),
    time: "02:00 PM",
    durationMinutes: 30,
    clientName: "Liam Chen",
    meetUrl: "https://meet.google.com/xyz-uvw-rst",
    notes: "Monthly CRO analytics review and cart abandonment optimization.",
  },
];

export function loadCustomEvents(): CalendarEvent[] {
  if (!canUseStorage()) return INITIAL_DEMO_EVENTS;
  const raw = localStorage.getItem(STORAGE_KEY_EVENTS);
  if (!raw) {
    saveCustomEvents(INITIAL_DEMO_EVENTS);
    return INITIAL_DEMO_EVENTS;
  }
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch {
    /* fallback */
  }
  return INITIAL_DEMO_EVENTS;
}

export function saveCustomEvents(events: CalendarEvent[]) {
  if (!canUseStorage()) return;
  localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(events));
}

export function createCalendarEvent(
  event: Omit<CalendarEvent, "id">,
): CalendarEvent {
  const newEvt: CalendarEvent = {
    ...event,
    id: `evt_${nanoid(8)}`,
  };
  const list = [newEvt, ...loadCustomEvents()];
  saveCustomEvents(list);
  return newEvt;
}

export function updateCalendarEvent(
  id: string,
  updates: Partial<CalendarEvent>,
): CalendarEvent | null {
  let updated: CalendarEvent | null = null;
  const list = loadCustomEvents().map((e) => {
    if (e.id === id) {
      updated = { ...e, ...updates };
      return updated;
    }
    return e;
  });
  saveCustomEvents(list);
  return updated;
}

export function deleteCalendarEvent(id: string): CalendarEvent[] {
  const list = loadCustomEvents().filter((e) => e.id !== id);
  saveCustomEvents(list);
  return list;
}

export function loadBookingSettings(): BookingSettings {
  if (!canUseStorage()) return DEFAULT_BOOKING_SETTINGS;
  const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
  if (!raw) return DEFAULT_BOOKING_SETTINGS;
  try {
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_BOOKING_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_BOOKING_SETTINGS;
  }
}

export function saveBookingSettings(settings: BookingSettings) {
  if (!canUseStorage()) return;
  localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
}

/**
 * Aggregates custom scheduled events with live Project due dates and invoice due dates
 */
export function getUnifiedCalendarEvents(projects: Project[] = []): CalendarEvent[] {
  const custom = loadCustomEvents();

  // Map project due dates
  const projectDeadlines: CalendarEvent[] = projects
    .filter((p) => p.dueDate && p.status !== "done" && p.status !== "lost")
    .map((p) => ({
      id: `prj_due_${p.id}`,
      title: `Due: ${p.name}`,
      type: "deadline" as CalendarEventType,
      date: p.dueDate,
      projectId: p.id,
      projectName: p.name,
      clientName: p.clientName,
      clientEmail: p.clientEmail,
      notes: `Target delivery date for ${p.clientName}. Status: ${p.status}`,
      isSystemGenerated: true,
    }));

  return [...custom, ...projectDeadlines].sort((a, b) => {
    return (a.date + (a.time || "")).localeCompare(b.date + (b.time || ""));
  });
}

/**
 * Generates an RFC 5545 iCalendar (.ics) formatted string
 */
export function generateIcsFeed(events: CalendarEvent[]): string {
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//PortalKit//Shopify Freelancer Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:PortalKit Studio Schedule",
    "X-WR-TIMEZONE:UTC",
  ];

  const nowStamp = new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";

  for (const evt of events) {
    const cleanDate = evt.date.replace(/-/g, "");
    lines.push("BEGIN:VEVENT");
    lines.push(`UID:${evt.id}@portalkit.io`);
    lines.push(`DTSTAMP:${nowStamp}`);
    lines.push(`DTSTART;VALUE=DATE:${cleanDate}`);
    lines.push(`SUMMARY:${evt.title.replace(/[,;]/g, " ")}`);
    if (evt.notes) {
      lines.push(`DESCRIPTION:${evt.notes.replace(/[\r\n]+/g, " ")}`);
    }
    if (evt.meetUrl) {
      lines.push(`LOCATION:${evt.meetUrl}`);
    }
    lines.push("STATUS:CONFIRMED");
    lines.push("END:VEVENT");
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}
