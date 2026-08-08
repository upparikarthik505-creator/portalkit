import type { Project } from "./types";

export type Lead = {
  id: string;
  name: string;
  company: string;
  email: string;
  storeUrl: string;
  valueCents: number;
  stage: "inquiry" | "qualified" | "proposal" | "booked";
  source: string;
  lastTouch: string;
};

export type Proposal = {
  id: string;
  title: string;
  clientName: string;
  amountCents: number;
  status: "draft" | "sent" | "viewed" | "accepted";
  sentAt: string;
  projectId?: string;
};

export type Invoice = {
  id: string;
  number: string;
  clientName: string;
  amountCents: number;
  status: "draft" | "sent" | "paid" | "overdue";
  dueDate: string;
  projectName: string;
};

export type Client = {
  id: string;
  name: string;
  email: string;
  company: string;
  storeUrl: string;
  lifetimeCents: number;
  activeProjects: number;
  status: "active" | "lead" | "past";
};

export const DEMO_LEADS: Lead[] = [
  {
    id: "lead_1",
    name: "Sofia Alvarez",
    company: "Lumen Home",
    email: "sofia@lumenhome.co",
    storeUrl: "lumenhome.myshopify.com",
    valueCents: 450000,
    stage: "inquiry",
    source: "Referral",
    lastTouch: "2h ago",
  },
  {
    id: "lead_2",
    name: "Chris Park",
    company: "Volt Athletics",
    email: "chris@voltathletics.com",
    storeUrl: "voltathletics.myshopify.com",
    valueCents: 320000,
    stage: "qualified",
    source: "Instagram",
    lastTouch: "Yesterday",
  },
  {
    id: "lead_3",
    name: "Amelia Brooks",
    company: "Cedar & Co",
    email: "amelia@cedar.co",
    storeUrl: "cedarandco.myshopify.com",
    valueCents: 280000,
    stage: "proposal",
    source: "Website form",
    lastTouch: "3d ago",
  },
  {
    id: "lead_4",
    name: "Noah Kim",
    company: "Basecamp Goods",
    email: "noah@basecampgoods.com",
    storeUrl: "basecampgoods.myshopify.com",
    valueCents: 510000,
    stage: "booked",
    source: "LinkedIn",
    lastTouch: "1w ago",
  },
  {
    id: "lead_5",
    name: "Riley Quinn",
    company: "Nestware",
    email: "riley@nestware.com",
    storeUrl: "nestware.myshopify.com",
    valueCents: 190000,
    stage: "inquiry",
    source: "Cold email",
    lastTouch: "5h ago",
  },
  {
    id: "lead_6",
    name: "Elena Soto",
    company: "Marigold Beauty",
    email: "elena@marigold.beauty",
    storeUrl: "marigoldbeauty.myshopify.com",
    valueCents: 360000,
    stage: "qualified",
    source: "Referral",
    lastTouch: "Today",
  },
];

export const DEMO_PROPOSALS: Proposal[] = [
  {
    id: "prop_1",
    title: "Aurora Skincare — Theme rebuild + CRO",
    clientName: "Maya Chen",
    amountCents: 480000,
    status: "accepted",
    sentAt: "Aug 1",
    projectId: "prj_aurora",
  },
  {
    id: "prop_2",
    title: "Cedar & Co — Launch package",
    clientName: "Amelia Brooks",
    amountCents: 280000,
    status: "viewed",
    sentAt: "Aug 6",
  },
  {
    id: "prop_3",
    title: "Volt Athletics — PDP system",
    clientName: "Chris Park",
    amountCents: 320000,
    status: "sent",
    sentAt: "Aug 7",
  },
  {
    id: "prop_4",
    title: "Nestware — Homepage sprint",
    clientName: "Riley Quinn",
    amountCents: 190000,
    status: "draft",
    sentAt: "—",
  },
];

export const DEMO_INVOICES: Invoice[] = [
  {
    id: "inv_1",
    number: "INV-1042",
    clientName: "Maya Chen",
    amountCents: 120000,
    status: "paid",
    dueDate: "Aug 5",
    projectName: "Aurora Skincare rebuild",
  },
  {
    id: "inv_2",
    number: "INV-1043",
    clientName: "Maya Chen",
    amountCents: 180000,
    status: "sent",
    dueDate: "Aug 15",
    projectName: "Aurora Skincare rebuild",
  },
  {
    id: "inv_3",
    number: "INV-1044",
    clientName: "Jordan Hale",
    amountCents: 95000,
    status: "sent",
    dueDate: "Aug 12",
    projectName: "Northwind Outfitters QA",
  },
  {
    id: "inv_4",
    number: "INV-1045",
    clientName: "Priya Shah",
    amountCents: 50000,
    status: "draft",
    dueDate: "Aug 20",
    projectName: "Bloom Botanicals landing",
  },
  {
    id: "inv_5",
    number: "INV-1039",
    clientName: "Noah Kim",
    amountCents: 75000,
    status: "overdue",
    dueDate: "Aug 2",
    projectName: "Basecamp Goods retainer",
  },
];

export const DEMO_CLIENTS: Client[] = [
  {
    id: "cli_1",
    name: "Maya Chen",
    email: "maya@auroraskin.co",
    company: "Aurora Skincare",
    storeUrl: "auroraskin.myshopify.com",
    lifetimeCents: 840000,
    activeProjects: 1,
    status: "active",
  },
  {
    id: "cli_2",
    name: "Jordan Hale",
    email: "jordan@northwind.co",
    company: "Northwind Outfitters",
    storeUrl: "northwind.myshopify.com",
    lifetimeCents: 210000,
    activeProjects: 1,
    status: "active",
  },
  {
    id: "cli_3",
    name: "Priya Shah",
    email: "priya@bloombotanicals.com",
    company: "Bloom Botanicals",
    storeUrl: "bloombotanicals.myshopify.com",
    lifetimeCents: 50000,
    activeProjects: 1,
    status: "lead",
  },
  {
    id: "cli_4",
    name: "Noah Kim",
    email: "noah@basecampgoods.com",
    company: "Basecamp Goods",
    storeUrl: "basecampgoods.myshopify.com",
    lifetimeCents: 620000,
    activeProjects: 0,
    status: "past",
  },
  {
    id: "cli_5",
    name: "Amelia Brooks",
    email: "amelia@cedar.co",
    company: "Cedar & Co",
    storeUrl: "cedarandco.myshopify.com",
    lifetimeCents: 0,
    activeProjects: 0,
    status: "lead",
  },
];

export const DEMO_PROJECTS: Project[] = [
  {
    id: "prj_aurora",
    name: "Aurora Skincare — Theme rebuild",
    clientName: "Maya Chen",
    clientEmail: "maya@auroraskin.co",
    storeUrl: "auroraskin.myshopify.com",
    status: "in_progress",
    dueDate: "2026-08-18",
    notes:
      "Homepage redesign, PDP polish, and checkout upsell block. Waiting on brand photography.",
    shareToken: "aurora-maya-7k2",
    files: [
      {
        id: "f1",
        name: "homepage-wireframes.pdf",
        sizeLabel: "1.2 MB",
        uploadedAt: "2026-08-06",
      },
      {
        id: "f2",
        name: "brand-assets.zip",
        sizeLabel: "18 MB",
        uploadedAt: "2026-08-07",
      },
      {
        id: "f5",
        name: "staging-preview-notes.docx",
        sizeLabel: "240 KB",
        uploadedAt: "2026-08-08",
      },
    ],
    payments: [
      {
        id: "pay1",
        label: "Project deposit (40%)",
        amountCents: 120000,
        status: "paid",
        createdAt: "2026-08-01",
      },
      {
        id: "pay2",
        label: "Milestone 2 — Theme build",
        amountCents: 180000,
        status: "sent",
        createdAt: "2026-08-07",
      },
    ],
    updatedAt: "2026-08-08T10:00:00.000Z",
    createdAt: "2026-08-01T10:00:00.000Z",
  },
  {
    id: "prj_northwind",
    name: "Northwind Outfitters — Launch QA",
    clientName: "Jordan Hale",
    clientEmail: "jordan@northwind.co",
    storeUrl: "northwind.myshopify.com",
    status: "in_review",
    dueDate: "2026-08-12",
    notes: "Mobile cart bugs + collection filters. Client reviewing staging.",
    shareToken: "northwind-jh-9p1",
    files: [
      {
        id: "f3",
        name: "qa-checklist.xlsx",
        sizeLabel: "84 KB",
        uploadedAt: "2026-08-05",
      },
    ],
    payments: [
      {
        id: "pay3",
        label: "Fixed project fee",
        amountCents: 95000,
        status: "sent",
        createdAt: "2026-08-03",
      },
    ],
    updatedAt: "2026-08-07T16:20:00.000Z",
    createdAt: "2026-08-03T09:00:00.000Z",
  },
  {
    id: "prj_bloom",
    name: "Bloom Botanicals — Landing page",
    clientName: "Priya Shah",
    clientEmail: "priya@bloombotanicals.com",
    storeUrl: "bloombotanicals.myshopify.com",
    status: "todo",
    dueDate: "2026-08-25",
    notes: "Kickoff next week. Need product feed + offer copy.",
    shareToken: "bloom-priya-3m8",
    files: [],
    payments: [
      {
        id: "pay4",
        label: "Kickoff deposit",
        amountCents: 50000,
        status: "draft",
        createdAt: "2026-08-08",
      },
    ],
    updatedAt: "2026-08-08T08:00:00.000Z",
    createdAt: "2026-08-08T08:00:00.000Z",
  },
];
