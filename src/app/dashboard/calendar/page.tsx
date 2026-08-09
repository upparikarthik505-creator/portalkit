"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  Download,
  ExternalLink,
  Plus,
  Rocket,
  Settings,
  Sparkles,
  Trash2,
  Video,
} from "lucide-react";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { SplitHeadline } from "@/components/motion/SplitHeadline";
import {
  createCalendarEvent,
  deleteCalendarEvent,
  generateIcsFeed,
  getUnifiedCalendarEvents,
  loadBookingSettings,
  saveBookingSettings,
  type BookingSettings,
  type CalendarEvent,
  type CalendarEventType,
} from "@/lib/calendar-store";
import { hydrateProjects } from "@/lib/store";
import type { Project } from "@/lib/types";

const EVENT_TYPE_STYLES: Record<
  CalendarEventType,
  { bg: string; text: string; label: string }
> = {
  call: {
    bg: "bg-[#e8eefc]",
    text: "text-[#2f4f9b]",
    label: "Call",
  },
  deadline: {
    bg: "bg-accent-soft",
    text: "text-accent-deep",
    label: "Due Date",
  },
  milestone: {
    bg: "bg-mint",
    text: "text-mint-ink",
    label: "Milestone",
  },
  launch: {
    bg: "bg-amber-100",
    text: "text-amber-900",
    label: "Launch",
  },
  reminder: {
    bg: "bg-paper",
    text: "text-ink-2",
    label: "Reminder",
  },
};

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarPage() {
  const [view, setView] = useState<"month" | "agenda" | "scheduler">("month");
  const [projects, setProjects] = useState<Project[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState<string>(() =>
    new Date().toISOString().slice(0, 10),
  );
  const [settings, setSettings] = useState<BookingSettings>(loadBookingSettings);

  const [modalOpen, setModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [bookingPreviewOpen, setBookingPreviewOpen] = useState(false);

  // New Event Form
  const [formTitle, setFormTitle] = useState("");
  const [formType, setFormType] = useState<CalendarEventType>("call");
  const [formDate, setFormDate] = useState(() =>
    new Date().toISOString().slice(0, 10),
  );
  const [formTime, setFormTime] = useState("10:30 AM");
  const [formProjectId, setFormProjectId] = useState("");
  const [formClientName, setFormClientName] = useState("");
  const [formMeetUrl, setFormMeetUrl] = useState("https://meet.google.com/new");
  const [formNotes, setFormNotes] = useState("");

  useEffect(() => {
    hydrateProjects().then((projs) => {
      setProjects(projs);
      setEvents(getUnifiedCalendarEvents(projs));
    });
    setSettings(loadBookingSettings());
  }, []);

  function refreshEvents() {
    setEvents(getUnifiedCalendarEvents(projects));
  }

  // Month navigation
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days: { dateStr: string; dayNum: number; isCurrentMonth: boolean }[] =
      [];

    // Prev month padding
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      const m = month === 0 ? 12 : month;
      const y = month === 0 ? year - 1 : year;
      const dateStr = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      days.push({ dateStr, dayNum: d, isCurrentMonth: false });
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      days.push({ dateStr, dayNum: i, isCurrentMonth: true });
    }

    // Next month padding to fill 35 or 42 grid slots
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      const m = month === 11 ? 1 : month + 2;
      const y = month === 11 ? year + 1 : year;
      const dateStr = `${y}-${String(m).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      days.push({ dateStr, dayNum: i, isCurrentMonth: false });
    }

    return days;
  }, [year, month]);

  function prevMonth() {
    setCurrentDate(new Date(year, month - 1, 1));
  }

  function nextMonth() {
    setCurrentDate(new Date(year, month + 1, 1));
  }

  function goToday() {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDate(now.toISOString().slice(0, 10));
  }

  function handleAddEventSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const prj = projects.find((p) => p.id === formProjectId);

    createCalendarEvent({
      title: formTitle.trim(),
      type: formType,
      date: formDate,
      time: formTime,
      projectId: formProjectId || null,
      projectName: prj?.name,
      clientName: formClientName.trim() || prj?.clientName,
      meetUrl: formMeetUrl.trim() || undefined,
      notes: formNotes.trim() || undefined,
    });

    refreshEvents();
    setModalOpen(false);
    setFormTitle("");
    setFormNotes("");
  }

  function handleDelete(id: string) {
    if (confirm("Delete this scheduled event?")) {
      deleteCalendarEvent(id);
      refreshEvents();
    }
  }

  function handleExportIcs() {
    const icsData = generateIcsFeed(events);
    const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "portalkit-schedule.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const selectedDateEvents = useMemo(() => {
    return events.filter((e) => e.date === selectedDate);
  }, [events, selectedDate]);

  const upcomingEvents = useMemo(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    return events.filter((e) => e.date >= todayStr);
  }, [events]);

  const shareableBookingLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/meet/${settings.bookingSlug}`
      : `https://portalkit.io/meet/${settings.bookingSlug}`;

  async function copyBookingLink() {
    await navigator.clipboard.writeText(shareableBookingLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="dash-rise flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mkt-eyebrow">Timeline & Booking</p>
          <SplitHeadline
            as="h1"
            text="Protect deep-work hours"
            className="mkt-h2 mt-1"
          />
          <p className="mkt-lede mt-2 max-w-2xl">
            Live schedule for discovery calls, project milestones, Shopify
            launches, and shareable booking links.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExportIcs}
            className="btn btn-secondary btn-compact"
            title="Download .ics file for Google Calendar, Apple Calendar, Outlook"
          >
            <Download className="h-4 w-4" />
            Sync .ics
          </button>
          <MagneticButton
            type="button"
            className="btn btn-primary btn-compact"
            onClick={() => {
              setFormDate(selectedDate);
              setModalOpen(true);
            }}
          >
            <Plus className="h-4 w-4" aria-hidden />
            Add event
          </MagneticButton>
        </div>
      </div>

      {/* Navigation & View Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-xl border border-line bg-paper-2 p-1 shadow-sm">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1.5 text-muted hover:text-ink"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={goToday}
              className="px-2.5 py-1 text-[12px] font-bold text-ink-2 hover:text-ink"
            >
              Today
            </button>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1.5 text-muted hover:text-ink"
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <h2 className="text-lg font-extrabold text-ink">{monthName}</h2>
        </div>

        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setView("month")}
            className={`rounded-xl px-3 py-1.5 text-[12px] font-bold transition-colors ${
              view === "month"
                ? "bg-ink text-white"
                : "bg-paper text-muted hover:text-ink"
            }`}
          >
            Month View
          </button>
          <button
            type="button"
            onClick={() => setView("agenda")}
            className={`rounded-xl px-3 py-1.5 text-[12px] font-bold transition-colors ${
              view === "agenda"
                ? "bg-ink text-white"
                : "bg-paper text-muted hover:text-ink"
            }`}
          >
            Agenda ({upcomingEvents.length})
          </button>
          <button
            type="button"
            onClick={() => setView("scheduler")}
            className={`rounded-xl px-3 py-1.5 text-[12px] font-bold transition-colors ${
              view === "scheduler"
                ? "bg-ink text-white"
                : "bg-paper text-muted hover:text-ink"
            }`}
          >
            <Settings className="inline-block mr-1 h-3.5 w-3.5" />
            Booking Link
          </button>
        </div>
      </div>

      {/* Main View: Month Calendar */}
      {view === "month" && (
        <div className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
          {/* Calendar Grid */}
          <div className="overflow-hidden rounded-[var(--radius)] border border-line bg-paper-2 shadow-[var(--shadow)]">
            {/* Days Header */}
            <div className="grid grid-cols-7 border-b border-line bg-paper text-center text-[11px] font-bold uppercase tracking-[0.08em] text-muted">
              {DAYS_OF_WEEK.map((d) => (
                <div key={d} className="py-2.5">
                  {d}
                </div>
              ))}
            </div>

            {/* Date Cells */}
            <div className="grid grid-cols-7 divide-x divide-y divide-line/70">
              {calendarDays.map((day, idx) => {
                const isSelected = day.dateStr === selectedDate;
                const isToday =
                  day.dateStr === new Date().toISOString().slice(0, 10);
                const dayEvents = events.filter((e) => e.date === day.dateStr);

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedDate(day.dateStr)}
                    className={`min-h-[85px] p-2 text-left transition-colors ${
                      isSelected
                        ? "bg-accent-soft/30 ring-2 ring-inset ring-accent"
                        : "hover:bg-paper/60"
                    } ${!day.isCurrentMonth ? "opacity-35 bg-paper/20" : ""}`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-grid h-6 w-6 place-items-center rounded-full text-[12px] font-bold ${
                          isToday
                            ? "bg-accent text-white"
                            : isSelected
                              ? "bg-ink text-white"
                              : "text-ink-2"
                        }`}
                      >
                        {day.dayNum}
                      </span>
                      {dayEvents.length > 0 ? (
                        <span className="text-[10px] font-bold text-muted">
                          {dayEvents.length}
                        </span>
                      ) : null}
                    </div>

                    {/* Mini event tags */}
                    <div className="mt-1.5 space-y-1">
                      {dayEvents.slice(0, 2).map((evt) => {
                        const style = EVENT_TYPE_STYLES[evt.type];
                        return (
                          <div
                            key={evt.id}
                            className={`truncate rounded px-1.5 py-0.5 text-[10px] font-semibold ${style.bg} ${style.text}`}
                            title={evt.title}
                          >
                            {evt.title}
                          </div>
                        );
                      })}
                      {dayEvents.length > 2 ? (
                        <p className="text-[9px] font-bold text-muted pl-1">
                          +{dayEvents.length - 2} more
                        </p>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Day Agenda Sidebar */}
          <div className="space-y-4">
            <div className="rounded-[var(--radius)] border border-line bg-paper-2 p-5 shadow-[var(--shadow)]">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <div>
                  <p className="mkt-label text-muted">Selected Date</p>
                  <h3 className="mkt-h3 mt-0.5">
                    {new Date(selectedDate + "T12:00:00").toLocaleDateString(
                      "en-US",
                      {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                      },
                    )}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFormDate(selectedDate);
                    setModalOpen(true);
                  }}
                  className="btn btn-secondary !py-1.5 !px-2.5 !text-[12px]"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {selectedDateEvents.length === 0 ? (
                  <div className="py-8 text-center text-muted">
                    <Clock className="mx-auto h-6 w-6 text-muted-2 opacity-50" />
                    <p className="mkt-row mt-2 text-ink-2">No events scheduled</p>
                    <p className="text-xs text-muted mt-1">
                      Deep work window open. Add calls or milestones above.
                    </p>
                  </div>
                ) : (
                  selectedDateEvents.map((evt) => {
                    const style = EVENT_TYPE_STYLES[evt.type];
                    return (
                      <div
                        key={evt.id}
                        className="rounded-xl border border-line bg-paper p-3.5 space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span
                              className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${style.bg} ${style.text}`}
                            >
                              {style.label}
                            </span>
                            <p className="font-bold text-ink mt-1">
                              {evt.title}
                            </p>
                          </div>
                          {!evt.isSystemGenerated ? (
                            <button
                              type="button"
                              onClick={() => handleDelete(evt.id)}
                              className="text-muted hover:text-accent-deep"
                              title="Delete event"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          ) : null}
                        </div>

                        {evt.time ? (
                          <div className="flex items-center gap-1.5 text-xs text-muted">
                            <Clock className="h-3.5 w-3.5" />
                            <span>
                              {evt.time}{" "}
                              {evt.durationMinutes
                                ? `(${evt.durationMinutes}m)`
                                : ""}
                            </span>
                          </div>
                        ) : null}

                        {evt.clientName ? (
                          <p className="text-xs text-muted">
                            Client:{" "}
                            <span className="font-semibold text-ink-2">
                              {evt.clientName}
                            </span>
                          </p>
                        ) : null}

                        {evt.notes ? (
                          <p className="text-xs text-muted leading-relaxed">
                            {evt.notes}
                          </p>
                        ) : null}

                        {evt.meetUrl ? (
                          <a
                            href={evt.meetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-secondary !py-1.5 !text-[12px] w-full flex items-center justify-center gap-1.5"
                          >
                            <Video className="h-3.5 w-3.5 text-accent" />
                            Join Video Call
                          </a>
                        ) : null}

                        {evt.projectId ? (
                          <Link
                            href={`/dashboard/projects/${evt.projectId}`}
                            className="text-[11px] font-bold text-accent flex items-center gap-1 hover:underline"
                          >
                            Open Project Portal{" "}
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        ) : null}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Discovery Link Quick Card */}
            <div className="rounded-[var(--radius)] border border-line bg-paper p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ink">
                  Discovery Call Link
                </span>
                <button
                  type="button"
                  onClick={copyBookingLink}
                  className="text-xs font-bold text-accent hover:underline flex items-center gap-1"
                >
                  <Copy className="h-3 w-3" />
                  {copiedLink ? "Copied!" : "Copy"}
                </button>
              </div>
              <p className="text-[12px] text-muted mt-1 break-all font-mono">
                {shareableBookingLink}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* View 2: Agenda View */}
      {view === "agenda" && (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-[var(--radius)] border border-line bg-paper-2 shadow-[var(--shadow)]">
            <div className="border-b border-line px-5 py-4">
              <h2 className="mkt-h3">Upcoming Schedule & Milestones</h2>
              <p className="mkt-meta mt-1 text-muted">
                Combined stream of discovery calls, deliverables, and store
                launches.
              </p>
            </div>

            {upcomingEvents.length === 0 ? (
              <div className="px-5 py-12 text-center text-muted">
                <p className="mkt-row">No upcoming events scheduled</p>
              </div>
            ) : (
              <div className="divide-y divide-line">
                {upcomingEvents.map((evt) => {
                  const style = EVENT_TYPE_STYLES[evt.type];
                  return (
                    <div
                      key={evt.id}
                      className="flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-paper md:flex-row md:items-center md:justify-between"
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`mt-0.5 shrink-0 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${style.bg} ${style.text}`}
                        >
                          {style.label}
                        </span>
                        <div>
                          <p className="font-semibold text-ink">{evt.title}</p>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-muted mt-1">
                            <span className="font-medium text-ink-2">
                              📅 {evt.date}
                            </span>
                            {evt.time ? <span>⏰ {evt.time}</span> : null}
                            {evt.clientName ? (
                              <span>👤 {evt.clientName}</span>
                            ) : null}
                          </div>
                          {evt.notes ? (
                            <p className="text-xs text-muted mt-1">
                              {evt.notes}
                            </p>
                          ) : null}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {evt.meetUrl ? (
                          <a
                            href={evt.meetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-secondary !py-1.5 !px-3 !text-[12px] flex items-center gap-1"
                          >
                            <Video className="h-3.5 w-3.5 text-accent" />
                            Join Call
                          </a>
                        ) : null}
                        {evt.projectId ? (
                          <Link
                            href={`/dashboard/projects/${evt.projectId}`}
                            className="btn btn-secondary !py-1.5 !px-3 !text-[12px]"
                          >
                            Project
                          </Link>
                        ) : null}
                        {!evt.isSystemGenerated ? (
                          <button
                            type="button"
                            onClick={() => handleDelete(evt.id)}
                            className="p-1.5 text-muted hover:text-accent-deep"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* View 3: Scheduler Settings */}
      {view === "scheduler" && (
        <div className="space-y-6">
          <div className="surface max-w-2xl space-y-4 p-6">
            <h2 className="text-xl font-extrabold">Discovery Call Scheduler</h2>
            <p className="text-sm text-muted">
              Share a dedicated booking link with Shopify prospects to let them
              schedule kickoff and scope reviews directly into your calendar.
            </p>

            <div className="rounded-xl border border-line bg-paper p-4 space-y-2">
              <span className="text-xs font-bold text-muted uppercase tracking-wider">
                Your Public Booking Link
              </span>
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value={shareableBookingLink}
                  className="w-full rounded-lg border border-line bg-white px-3 py-2 text-xs font-mono"
                />
                <button
                  type="button"
                  onClick={copyBookingLink}
                  className="btn btn-primary !py-2 !px-3 !text-xs whitespace-nowrap"
                >
                  <Copy className="h-3.5 w-3.5" />
                  {copiedLink ? "Copied" : "Copy"}
                </button>
                <button
                  type="button"
                  onClick={() => setBookingPreviewOpen(true)}
                  className="btn btn-secondary !py-2 !px-3 !text-xs whitespace-nowrap"
                >
                  Preview
                </button>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="block">
                <span className="mb-1 block text-sm font-medium">
                  Studio Name
                </span>
                <input
                  value={settings.studioName}
                  onChange={(e) =>
                    setSettings((s) => ({ ...s, studioName: e.target.value }))
                  }
                  className="w-full rounded-xl border border-line px-3 py-2 text-sm"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium">
                  Booking Slug
                </span>
                <input
                  value={settings.bookingSlug}
                  onChange={(e) =>
                    setSettings((s) => ({ ...s, bookingSlug: e.target.value }))
                  }
                  className="w-full rounded-xl border border-line px-3 py-2 text-sm"
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-1 block text-sm font-medium">
                    Call Duration
                  </span>
                  <select
                    value={settings.callDurationMinutes}
                    onChange={(e) =>
                      setSettings((s) => ({
                        ...s,
                        callDurationMinutes: Number(e.target.value),
                      }))
                    }
                    className="w-full rounded-xl border border-line px-3 py-2 text-sm"
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>60 minutes</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1 block text-sm font-medium">
                    Buffer Time
                  </span>
                  <select
                    value={settings.bufferMinutes}
                    onChange={(e) =>
                      setSettings((s) => ({
                        ...s,
                        bufferMinutes: Number(e.target.value),
                      }))
                    }
                    className="w-full rounded-xl border border-line px-3 py-2 text-sm"
                  >
                    <option value={0}>No buffer</option>
                    <option value={10}>10 minutes</option>
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="mb-1 block text-sm font-medium">
                  Default Google Meet / Zoom Room
                </span>
                <input
                  value={settings.meetLink}
                  onChange={(e) =>
                    setSettings((s) => ({ ...s, meetLink: e.target.value }))
                  }
                  placeholder="https://meet.google.com/..."
                  className="w-full rounded-xl border border-line px-3 py-2 text-sm"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium">
                  Intro Note for Merchants
                </span>
                <textarea
                  rows={3}
                  value={settings.bookingIntro}
                  onChange={(e) =>
                    setSettings((s) => ({ ...s, bookingIntro: e.target.value }))
                  }
                  className="w-full rounded-xl border border-line px-3 py-2 text-sm"
                />
              </label>
            </div>

            <button
              type="button"
              onClick={() => {
                saveBookingSettings(settings);
                alert("Booking settings saved.");
              }}
              className="btn btn-primary"
            >
              Save scheduler settings
            </button>
          </div>
        </div>
      )}

      {/* Modal: New Event Form */}
      {modalOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/55 p-4 backdrop-blur-sm">
          <form
            onSubmit={handleAddEventSubmit}
            className="surface max-h-[90vh] w-full max-w-lg space-y-4 overflow-y-auto p-6"
          >
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h2 className="text-xl font-extrabold">Schedule New Event</h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-muted hover:text-ink text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <label className="block">
                <span className="mb-1 block text-sm font-medium">
                  Event Title
                </span>
                <input
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Discovery Call with Merchant"
                  className="w-full rounded-xl border border-line px-3 py-2 text-sm"
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-1 block text-sm font-medium">
                    Event Type
                  </span>
                  <select
                    value={formType}
                    onChange={(e) =>
                      setFormType(e.target.value as CalendarEventType)
                    }
                    className="w-full rounded-xl border border-line px-3 py-2 text-sm"
                  >
                    <option value="call">Discovery Call / Meeting</option>
                    <option value="milestone">Milestone Review</option>
                    <option value="launch">Store Launch Day</option>
                    <option value="deadline">Project Target Due Date</option>
                    <option value="reminder">Reminder</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1 block text-sm font-medium">Date</span>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full rounded-xl border border-line px-3 py-2 text-sm"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-1 block text-sm font-medium">Time</span>
                  <input
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    placeholder="10:30 AM"
                    className="w-full rounded-xl border border-line px-3 py-2 text-sm"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-sm font-medium">
                    Attach Project (Optional)
                  </span>
                  <select
                    value={formProjectId}
                    onChange={(e) => setFormProjectId(e.target.value)}
                    className="w-full rounded-xl border border-line px-3 py-2 text-sm"
                  >
                    <option value="">None (Independent)</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.clientName})
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="mb-1 block text-sm font-medium">
                  Client / Merchant Name
                </span>
                <input
                  value={formClientName}
                  onChange={(e) => setFormClientName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full rounded-xl border border-line px-3 py-2 text-sm"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium">
                  Video Call Link (Google Meet / Zoom)
                </span>
                <input
                  value={formMeetUrl}
                  onChange={(e) => setFormMeetUrl(e.target.value)}
                  placeholder="https://meet.google.com/..."
                  className="w-full rounded-xl border border-line px-3 py-2 text-sm"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium">
                  Notes / Agenda
                </span>
                <textarea
                  rows={3}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Discussion points or checklist items"
                  className="w-full rounded-xl border border-line px-3 py-2 text-sm"
                />
              </label>
            </div>

            <div className="flex gap-2 border-t border-line pt-4">
              <button type="submit" className="btn btn-primary flex-1">
                Save to Schedule
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {/* Modal: Client Booking Page Preview */}
      {bookingPreviewOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/65 p-4 backdrop-blur-sm">
          <div className="surface w-full max-w-md space-y-4 p-6">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted">
                  Client Booking Preview
                </p>
                <h3 className="text-xl font-extrabold">{settings.studioName}</h3>
              </div>
              <button
                type="button"
                onClick={() => setBookingPreviewOpen(false)}
                className="text-muted hover:text-ink font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-muted leading-relaxed">
              {settings.bookingIntro}
            </p>

            <div className="rounded-xl border border-line bg-paper p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                <Clock className="h-4 w-4 text-accent" />
                <span>{settings.callDurationMinutes} Minute Discovery Call</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted">
                <Video className="h-4 w-4 text-accent" />
                <span>Google Meet video conference</span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-muted">
                Select an available slot
              </p>
              <div className="grid grid-cols-2 gap-2">
                {["Tomorrow 10:00 AM", "Tomorrow 2:30 PM", "Thursday 11:00 AM", "Thursday 4:00 PM"].map(
                  (slot, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        alert(`Demo booking slot confirmed for ${slot}!`);
                        setBookingPreviewOpen(false);
                      }}
                      className="rounded-xl border border-line bg-white px-3 py-2 text-xs font-bold text-ink-2 hover:border-accent hover:text-accent transition-colors"
                    >
                      {slot}
                    </button>
                  ),
                )}
              </div>
            </div>

            <button
              type="button"
              className="btn btn-secondary w-full"
              onClick={() => setBookingPreviewOpen(false)}
            >
              Close preview
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
