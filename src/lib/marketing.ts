export const BUSINESS_TYPES = [
  {
    slug: "shopify-freelancers",
    title: "Shopify freelancers",
    blurb: "Theme builds, launches, and retainers — portals clients actually use.",
    hero: "Everything beyond the theme build",
    proof: "Built for store freelancers who juggle inquiry → launch → retainer.",
    stats: [
      { value: "1 portal", label: "Per project — files, tasks, invoices" },
      { value: "Inquiry → booked", label: "Pipeline built for theme work" },
      { value: "Deposit first", label: "Proposal + contract + pay in one send" },
    ],
    journey: [
      {
        title: "Capture the store inquiry",
        body: "Lead forms collect store URL, platform, budget, and timeline — then open a pipeline card.",
      },
      {
        title: "Send a scoped offer",
        body: "Proposal, contract, and deposit invoice go out together so kickoff starts funded.",
      },
      {
        title: "Deliver in the portal",
        body: "Assets, feedback tasks, and milestones live where merchants already check status.",
      },
      {
        title: "Convert to retainer",
        body: "Hand off into monthly store care with recurring invoices and a clear next stage.",
      },
    ],
    faqs: [
      {
        q: "Is PortalKit only for Shopify freelancers?",
        a: "Shopify freelancers are our focus, but web designers, agencies, coaches, and consultants use the same client flows.",
      },
      {
        q: "Can I customize pipeline stages for theme work?",
        a: "Yes. Start from Inquiry → Booked defaults or rename stages to match rebuilds, launches, and retainers.",
      },
      {
        q: "Do clients need another login?",
        a: "Clients get a secure portal link per project. You control what they see — files, tasks, invoices, and status.",
      },
    ],
    pillars: {
      capture: {
        title: "Capture leads",
        body: "Branded forms that ask for store URL, platform, budget, and referral source — then drop straight into your pipeline.",
        chips: ["Lead forms", "Scheduler", "Automations", "Questionnaires"],
      },
      paid: {
        title: "Get paid",
        body: "Proposal, contract, and deposit in one send so theme work starts funded — not after three follow-ups.",
        chips: ["Proposals", "Contracts", "Invoices", "Payments"],
      },
      manage: {
        title: "Manage",
        body: "Pipeline stages, client portals, and tasks keep every rebuild and launch on track from kickoff to handoff.",
        chips: ["Pipeline", "CRM", "Client portal", "Tasks"],
      },
    },
  },
  {
    slug: "web-designers",
    title: "Web designers",
    blurb: "Proposals, deposits, and delivery files in one client HQ.",
    hero: "Design work without the admin drag",
    proof: "Scope, sign, and deliver sites without bouncing between five tools.",
    stats: [
      { value: "1 HQ", label: "Proposals, assets, and invoices together" },
      { value: "Milestones", label: "Bill design → build → launch" },
      { value: "Fewer tabs", label: "Replace Drive + email chase" },
    ],
    journey: [
      {
        title: "Qualify the brief",
        body: "Inquiry forms and questionnaires filter fit before you book discovery.",
      },
      {
        title: "Package the work",
        body: "Send tiered proposals with timelines, add-ons, and deposit terms.",
      },
      {
        title: "Collect sign-off",
        body: "E-sign contracts and kickoff deposits before you open the file.",
      },
      {
        title: "Share delivery",
        body: "Portals hold feedback, assets, and final invoices through launch.",
      },
    ],
    faqs: [
      {
        q: "Can I offer design packages and add-ons?",
        a: "Yes. Build tiered proposals with optional add-ons so clients choose the right scope without another email thread.",
      },
      {
        q: "Where do clients leave feedback?",
        a: "In the project portal — with tasks and due dates so revisions do not live in your DMs.",
      },
      {
        q: "Does PortalKit replace my design tools?",
        a: "No. Keep Figma and your stack — PortalKit handles the client ops around the creative work.",
      },
    ],
    pillars: {
      capture: {
        title: "Capture leads",
        body: "Inquiry forms and discovery questionnaires that qualify projects before you book a call.",
        chips: ["Lead forms", "Questionnaires", "Scheduler", "Services guides"],
      },
      paid: {
        title: "Get paid",
        body: "Package proposals with milestones, e-sign contracts, and collect deposits before you open Figma.",
        chips: ["Proposals", "Contracts", "Invoices", "Payments"],
      },
      manage: {
        title: "Manage",
        body: "Shared portals for feedback, assets, and invoices so clients always know what comes next.",
        chips: ["Client portal", "Tasks", "Pipeline", "CRM"],
      },
    },
  },
  {
    slug: "marketing-agencies",
    title: "Marketing agencies",
    blurb: "Multi-client pipelines, retainers, and branded portals.",
    hero: "Run every retainer from one workspace",
    proof: "Pipelines, roles, and portals built for multi-client teams.",
    stats: [
      { value: "Multi-client", label: "Pipelines that stay readable" },
      { value: "Retainers", label: "Recurring invoices on autopilot" },
      { value: "One portal", label: "Per account — creative + billing" },
    ],
    journey: [
      {
        title: "Route the brief",
        body: "Inbound forms land in the right stage and trigger follow-ups for your team.",
      },
      {
        title: "Close the retainer",
        body: "Agreements, scopes, and first invoices ship from one offer pack.",
      },
      {
        title: "Run the month",
        body: "Shared portals and tasks keep account and creative work aligned.",
      },
      {
        title: "Renew without chase",
        body: "Reminders and recurring billing keep retainers from going quiet.",
      },
    ],
    faqs: [
      {
        q: "Can multiple teammates work in PortalKit?",
        a: "Pro and Founder support growing teams with shared pipelines, tasks, and client records.",
      },
      {
        q: "How do retainers get billed?",
        a: "Use recurring invoices with reminders so monthly retainers renew without spreadsheet gymnastics.",
      },
      {
        q: "Can each client have their own portal?",
        a: "Yes. Every project or account gets a branded portal for files, approvals, and invoices.",
      },
    ],
    pillars: {
      capture: {
        title: "Capture leads",
        body: "Route inbound briefs into the right pipeline stage and auto-assign follow-ups to your team.",
        chips: ["Lead forms", "Automations", "Pipeline", "CRM"],
      },
      paid: {
        title: "Get paid",
        body: "Retainer agreements, recurring invoices, and payment reminders without spreadsheet gymnastics.",
        chips: ["Contracts", "Invoices", "Payments", "Proposals"],
      },
      manage: {
        title: "Manage",
        body: "Client portals, shared tasks, and project hubs keep creative and account work aligned.",
        chips: ["Client portal", "Tasks", "CRM", "Automations"],
      },
    },
  },
  {
    slug: "consultants",
    title: "Consultants",
    blurb: "Scope, sign, and get paid before the kickoff call.",
    hero: "Advice that books itself",
    proof: "From discovery call to signed SOW without the inbox chase.",
    stats: [
      { value: "SOW ready", label: "Scope + sign + deposit" },
      { value: "Calendar", label: "Discovery calls without the dance" },
      { value: "1 record", label: "Notes, files, and invoices together" },
    ],
    journey: [
      {
        title: "Qualify interest",
        body: "Forms and scheduling links fill your calendar with the right conversations.",
      },
      {
        title: "Send the SOW",
        body: "Scoped proposals and contracts make the engagement clear before kickoff.",
      },
      {
        title: "Collect the deposit",
        body: "Clients pay inside the same flow — strategy work starts funded.",
      },
      {
        title: "Deliver milestones",
        body: "Portals and tasks keep recommendations, decks, and invoices organized.",
      },
    ],
    faqs: [
      {
        q: "Can I reuse SOW language?",
        a: "Save contracts and proposals as templates, then personalize per client in a few clicks.",
      },
      {
        q: "Does scheduling connect to my calendar?",
        a: "Share booking links for discovery and reviews so availability stays accurate.",
      },
      {
        q: "Where do engagement notes live?",
        a: "On the client and project record — alongside files, milestones, and invoices.",
      },
    ],
    pillars: {
      capture: {
        title: "Capture leads",
        body: "Qualification forms and scheduling links that fill your calendar with the right conversations.",
        chips: ["Lead forms", "Scheduler", "Questionnaires", "CRM"],
      },
      paid: {
        title: "Get paid",
        body: "Scoped proposals and deposits so strategy work starts with a clear yes — and money in the bank.",
        chips: ["Proposals", "Contracts", "Invoices", "Payments"],
      },
      manage: {
        title: "Manage",
        body: "One client record for notes, files, milestones, and invoices across every engagement.",
        chips: ["CRM", "Tasks", "Client portal", "Pipeline"],
      },
    },
  },
  {
    slug: "coaches",
    title: "Coaches",
    blurb: "Packages, contracts, and recurring invoices without the busywork.",
    hero: "Coach more. Chase less.",
    proof: "Packages, onboarding, and payments that feel as polished as your programs.",
    stats: [
      { value: "Packages", label: "Programs clients can choose" },
      { value: "Autopay", label: "Retainers that renew cleanly" },
      { value: "Portal HQ", label: "Homework, notes, invoices" },
    ],
    journey: [
      {
        title: "Attract applicants",
        body: "Application forms and discovery calls filter for clients ready to invest.",
      },
      {
        title: "Offer the program",
        body: "Package proposals and agreements set expectations before day one.",
      },
      {
        title: "Onboard smoothly",
        body: "Automations send kickoff files and questionnaires after they sign.",
      },
      {
        title: "Run the container",
        body: "Portals hold session notes, homework, and recurring invoices.",
      },
    ],
    faqs: [
      {
        q: "Can I sell group programs and 1:1 retainers?",
        a: "Yes. Use package proposals and recurring invoices for both intensives and ongoing coaching.",
      },
      {
        q: "How do clients submit homework?",
        a: "Assign client tasks in the portal with due dates and context — no more lost DMs.",
      },
      {
        q: "Can applications trigger automations?",
        a: "New form submissions can confirm receipt, create tasks, and place leads in your pipeline.",
      },
    ],
    pillars: {
      capture: {
        title: "Capture leads",
        body: "Application forms and discovery calls that filter for clients ready to invest.",
        chips: ["Lead forms", "Scheduler", "Questionnaires", "Automations"],
      },
      paid: {
        title: "Get paid",
        body: "Program packages with contracts and autopay so retainers renew without awkward reminders.",
        chips: ["Proposals", "Contracts", "Invoices", "Payments"],
      },
      manage: {
        title: "Manage",
        body: "Portals for session notes, homework, and invoices — your clients always know where to look.",
        chips: ["Client portal", "Tasks", "CRM", "Automations"],
      },
    },
  },
  {
    slug: "photographers",
    title: "Photographers",
    blurb: "Bookings, contracts, and client portals — adapted for PortalKit.",
    hero: "Everything beyond the photos",
    proof: "CRM, scheduling, contracts, and payments in one login.",
    stats: [
      { value: "Book faster", label: "Inquiry → signed retainer" },
      { value: "One login", label: "CRM, contracts, and payments" },
      { value: "Client portal", label: "From shoot brief to delivery" },
    ],
    journey: [
      {
        title: "Capture the inquiry",
        body: "Lead forms, questionnaires, and booking links turn interest into a pipeline card.",
      },
      {
        title: "Lock the date",
        body: "Proposals, contracts, and retainers collect payment before you pack the kit.",
      },
      {
        title: "Run the shoot",
        body: "Tasks and portals keep shot lists, location notes, and timelines in one place.",
      },
      {
        title: "Deliver & upsell",
        body: "Final galleries, invoices, and print packages live where clients expect them.",
      },
    ],
    faqs: [
      {
        q: "Is PortalKit built for photographers?",
        a: "Yes — the same capture → book → deliver flow photographers need, tuned alongside Shopify freelancers and other service pros.",
      },
      {
        q: "Can I collect retainers before the shoot?",
        a: "Combine contract + invoice so clients sign and pay the retainer in one session.",
      },
      {
        q: "Where do clients find delivery files?",
        a: "In their branded portal, alongside invoices and any remaining balance.",
      },
    ],
    pillars: {
      capture: {
        title: "Capture leads",
        body: "Lead forms, mini-session booking, and questionnaires that turn inquiries into booked shoots.",
        chips: ["Lead forms", "Scheduler", "Automations", "Questionnaires"],
      },
      paid: {
        title: "Get paid",
        body: "Proposals, contracts, and invoices that collect retainers before you pack the kit bag.",
        chips: ["Payments", "Invoices", "Contracts", "Proposals"],
      },
      manage: {
        title: "Manage",
        body: "Pipeline stages, client portals, and task lists keep every shoot from inquiry to gallery delivery.",
        chips: ["Pipeline", "CRM", "Client portal", "Tasks"],
      },
    },
  },
] as const;

export type BusinessType = (typeof BUSINESS_TYPES)[number];

export const PRODUCT_LINKS = [
  {
    slug: "crm",
    title: "CRM",
    blurb: "Contacts, conversations, and project history in one record.",
    headline: "Impress every client at every step",
    subhead:
      "A CRM for Shopify freelancers and small service businesses — one client record for contacts, files, payments, and projects.",
    stats: [
      { value: "1 record", label: "Per client — contacts to invoices" },
      { value: "20 hrs", label: "Admin saved weekly (typical)" },
      { value: "All-in-one", label: "Pipeline, portal, and payments" },
    ],
    journey: [
      {
        title: "Attract leads",
        body: "Branded forms, service guides, and intro packets that feel on-brand.",
      },
      {
        title: "Manage clients",
        body: "Single client record: contacts, files, messages, and payments.",
      },
      {
        title: "Track projects",
        body: "Workflow stages and tasks so theme work never stalls.",
      },
      {
        title: "Automate tasks",
        body: "Messages, follow-ups, and files — no tech setup required.",
      },
      {
        title: "Stay organized",
        body: "Shared client portal as the project HQ for every engagement.",
      },
    ],
    faqs: [
      {
        q: "Is PortalKit CRM built for freelancers?",
        a: "Yes. It is tuned for Shopify freelancers and service businesses who need client history, projects, and payments in one place — not enterprise sales CRM.",
      },
      {
        q: "Can clients see their own information?",
        a: "Clients get a branded portal with files, tasks, invoices, and status — while you keep internal notes private.",
      },
      {
        q: "Does CRM connect to proposals and invoices?",
        a: "Every proposal, contract, invoice, and payment stays attached to the same client and project record.",
      },
    ],
  },
  {
    slug: "pipeline",
    title: "Pipeline",
    blurb: "Inquiry → booked with stages and automations.",
    headline: "Never lose a lead in your inbox again",
    subhead:
      "Visual stages from inquiry to booked — with automations that nudge the next step.",
    stats: [
      { value: "Inquiry → booked", label: "Clear stages for every deal" },
      { value: "Auto moves", label: "When clients sign or pay" },
      { value: "Open value", label: "See revenue sitting in each stage" },
    ],
    journey: [
      {
        title: "Capture",
        body: "New leads land in Inquiry with store URL, budget, and source.",
      },
      {
        title: "Qualify",
        body: "Move prospects through discovery and proposal stages.",
      },
      {
        title: "Close",
        body: "Signed contracts and deposits flip deals to Booked automatically.",
      },
      {
        title: "Deliver",
        body: "Keep active projects visible until handoff and retainer start.",
      },
    ],
    faqs: [
      {
        q: "Can I customize pipeline stages?",
        a: "Yes. Start with PortalKit defaults or rename stages to match how you sell Shopify work.",
      },
      {
        q: "Do automations move cards for me?",
        a: "You can advance stages when a proposal is viewed, a contract is signed, or a deposit is paid.",
      },
      {
        q: "Can I see open revenue by stage?",
        a: "Yes. Each stage shows deal value so you know what is sitting in proposal vs. booked.",
      },
    ],
  },
  {
    slug: "proposals",
    title: "Proposals",
    blurb: "Scoped offers clients can accept in one click.",
    headline: "Take the easy way from hey to pay",
    subhead:
      "Interactive proposals that combine scope, packages, and acceptance — so clients book without email ping-pong.",
    stats: [
      { value: "1 click", label: "Accept, sign, and pay" },
      { value: "Track views", label: "Know when clients open your offer" },
      { value: "Packages", label: "Add-ons and options in one file" },
    ],
    journey: [
      {
        title: "Create",
        body: "Build from a Shopify-ready template with scope, timeline, and pricing.",
      },
      {
        title: "Send",
        body: "Share a link — no PDF attachments or DocuSign detours.",
      },
      {
        title: "Book",
        body: "Clients accept packages, sign, and pay deposits in one flow.",
      },
      {
        title: "Track",
        body: "See views, signatures, and payments without chasing status.",
      },
    ],
    faqs: [
      {
        q: "Can proposals include contracts and invoices?",
        a: "Yes. Combine scope, e-sign agreement, and deposit so clients complete everything in one session.",
      },
      {
        q: "Can I offer packages and add-ons?",
        a: "Offer tiered packages and optional add-ons so clients choose what fits their store launch.",
      },
      {
        q: "Will I know when a client opens my proposal?",
        a: "Yes. Track views, signatures, and payments without chasing status over email.",
      },
    ],
  },
  {
    slug: "contracts",
    title: "Contracts",
    blurb: "E-sign ready agreements before you start work.",
    headline: "Get it in writing before you start",
    subhead:
      "E-sign contracts with deposit terms, IP language, and revision limits — ready for freelance Shopify work.",
    stats: [
      { value: "E-sign", label: "Legally binding signatures" },
      { value: "Templates", label: "Retainer and project agreements" },
      { value: "Linked pay", label: "Collect deposit on sign" },
    ],
    journey: [
      {
        title: "Draft",
        body: "Start from a freelance services or retainer template.",
      },
      {
        title: "Customize",
        body: "Add scope, payment schedule, and client details.",
      },
      {
        title: "Sign",
        body: "Clients e-sign from any device — no printing required.",
      },
      {
        title: "Lock in",
        body: "Signed contracts attach to the project and unlock invoices.",
      },
    ],
    faqs: [
      {
        q: "Are PortalKit contracts legally binding?",
        a: "E-signatures are widely recognized for service agreements. Always review terms for your jurisdiction and use case.",
      },
      {
        q: "Can I reuse contracts?",
        a: "Save your terms as templates and reuse them across clients with one-click personalization.",
      },
    ],
  },
  {
    slug: "invoices",
    title: "Invoices",
    blurb: "Deposits, milestones, and payment reminders.",
    headline: "Invoices clients actually pay",
    subhead:
      "Deposits, milestones, and retainers with reminders — so cash flow matches your delivery schedule.",
    stats: [
      { value: "Milestones", label: "Theme build → launch → handoff" },
      { value: "Reminders", label: "Nudge overdue invoices automatically" },
      { value: "Stripe", label: "Pay links clients trust" },
    ],
    journey: [
      {
        title: "Deposit",
        body: "Collect kickoff payment before you schedule kickoff.",
      },
      {
        title: "Milestone",
        body: "Invoice theme build, launch, and handoff as you deliver.",
      },
      {
        title: "Retain",
        body: "Recurring invoices for store care and monthly hours.",
      },
      {
        title: "Remind",
        body: "Automatic nudges when payments stall.",
      },
    ],
    faqs: [
      {
        q: "Can invoices connect to proposals?",
        a: "Yes. Generate invoices from accepted proposals so line items stay consistent.",
      },
      {
        q: "Do you support partial payments?",
        a: "Split work into deposits and milestones so clients pay as you deliver.",
      },
    ],
  },
  {
    slug: "payments",
    title: "Payments",
    blurb: "Collect money inside the same client flow.",
    headline: "Where payment simplicity meets security",
    subhead:
      "Accept cards and bank transfers inside proposals and invoices — no Venmo chase, no check waiting.",
    stats: [
      { value: "In-flow", label: "Pay inside proposal or invoice" },
      { value: "Reminders", label: "Autopay-ready retainers" },
      { value: "Tracked", label: "Real-time payment status" },
    ],
    journey: [
      {
        title: "Embed",
        body: "Add payment to proposal, contract, or invoice flows.",
      },
      {
        title: "Collect",
        body: "Clients pay by card without leaving the portal.",
      },
      {
        title: "Track",
        body: "See paid, pending, and overdue in one place.",
      },
      {
        title: "Remind",
        body: "Automatic follow-ups for late retainers and milestones.",
      },
    ],
    faqs: [
      {
        q: "What payment methods are supported?",
        a: "PortalKit subscription checkout (Pro / Founder) uses Razorpay with international cards when enabled. Client deposits into your own merchant account are not wired yet — send clients a Razorpay link from your account until Connect ships.",
      },
      {
        q: "Where do funds go?",
        a: "PortalKit Pro and Founder fees are charged to PortalKit through Razorpay. Collecting client deposits into your own Razorpay account isn’t available in-app yet — for client money, send a payment link from your Razorpay dashboard.",
      },
    ],
  },
  {
    slug: "client-portal",
    title: "Client portal",
    blurb: "Shared project HQ for files, tasks, and invoices.",
    headline: "One place your clients actually use",
    subhead:
      "A branded project HQ for files, tasks, invoices, and status — so clients stop asking “where is everything?”",
    stats: [
      { value: "1 login", label: "Files, tasks, invoices, status" },
      { value: "Branded", label: "Your look, not a generic folder" },
      { value: "Always current", label: "Updates as work moves" },
    ],
    journey: [
      {
        title: "Invite",
        body: "Share a portal link when the project books.",
      },
      {
        title: "Share",
        body: "Drop briefs, assets, and deliverables in one thread.",
      },
      {
        title: "Assign",
        body: "Client tasks for feedback, content, and approvals.",
      },
      {
        title: "Close",
        body: "Final invoices and handoff docs live where clients expect them.",
      },
    ],
    faqs: [
      {
        q: "Do clients need a PortalKit account?",
        a: "Clients access a secure portal link. You control what they see per project.",
      },
      {
        q: "Can I hide internal notes?",
        a: "Internal tasks and private notes stay on your side — clients only see what you share.",
      },
    ],
  },
  {
    slug: "automations",
    title: "Automations",
    blurb: "Follow-ups, files, and stage moves on autopilot.",
    headline: "Run — and automate — your business from one place",
    subhead:
      "Follow up on leads, onboard after contract, and nudge late steps without living in your inbox.",
    stats: [
      { value: "Triggers", label: "Views, signatures, payments, dates" },
      { value: "Actions", label: "Messages, files, stage moves" },
      { value: "No code", label: "Describe the process, run the flow" },
    ],
    journey: [
      {
        title: "Follow up on leads",
        body: "Auto-nudge when a proposal sits unopened.",
      },
      {
        title: "Onboard after contract",
        body: "Send kickoff files and questionnaires the moment they sign.",
      },
      {
        title: "Nudge late steps",
        body: "Remind clients when feedback or payment is overdue.",
      },
      {
        title: "Prep for key dates",
        body: "Launch reminders and retainer renewals on a schedule.",
      },
    ],
    faqs: [
      {
        q: "Which plans include automations?",
        a: "Automations are included on Pro and Founder. Starter focuses on core client flows.",
      },
      {
        q: "How do automations work?",
        a: "A trigger (like contract signed) starts actions, waits, and conditions — so you can build “if this, then that” without code.",
      },
    ],
  },
  {
    slug: "scheduler",
    title: "Scheduler",
    blurb: "Share availability and let clients book time.",
    headline: "Let clients book without the calendar dance",
    subhead:
      "Share availability for discovery calls, kickoffs, and reviews — synced to how you actually work.",
    stats: [
      { value: "Share link", label: "Clients pick a time that works" },
      { value: "Buffers", label: "Protect focus time between calls" },
      { value: "Reminders", label: "Fewer no-shows" },
    ],
    journey: [
      {
        title: "Set hours",
        body: "Define when you take discovery and project calls.",
      },
      {
        title: "Share",
        body: "Drop a booking link in lead forms and emails.",
      },
      {
        title: "Confirm",
        body: "Automatic confirmations and reminders for both sides.",
      },
      {
        title: "Connect",
        body: "Booked calls attach to the right client and project.",
      },
    ],
    faqs: [
      {
        q: "Can scheduling live inside lead forms?",
        a: "Yes. Offer bookable times after someone submits an inquiry so hot leads convert while interest is high.",
      },
      {
        q: "Does it sync with my calendar?",
        a: "Connect your calendar so booked times block double-booking. Availability stays accurate.",
      },
    ],
  },
  {
    slug: "lead-forms",
    title: "Lead forms",
    blurb: "Capture store URL, budget, and referral source.",
    headline: "Capture every inquiry before it disappears",
    subhead:
      "Branded forms that ask for store URL, budget, and referral source — then land in your pipeline automatically.",
    stats: [
      { value: "Shopify fields", label: "Store URL, platform, budget" },
      { value: "Pipeline drop", label: "Leads become cards instantly" },
      { value: "Branded", label: "Looks like your site, not a form tool" },
    ],
    journey: [
      {
        title: "Build",
        body: "Start from a Shopify project inquiry template.",
      },
      {
        title: "Embed",
        body: "Add the form to your site or share a link.",
      },
      {
        title: "Qualify",
        body: "Required fields filter tire-kickers before the call.",
      },
      {
        title: "Route",
        body: "New submissions open as pipeline cards with context.",
      },
    ],
    faqs: [
      {
        q: "What fields should I ask for?",
        a: "Store URL, budget range, timeline, and how they found you are a strong default for Shopify freelancers.",
      },
      {
        q: "Can forms trigger automations?",
        a: "Yes. New leads can trigger confirmation emails, tasks, and pipeline stage placement.",
      },
    ],
  },
  {
    slug: "tasks",
    title: "Tasks",
    blurb: "Internal and client-assigned to-dos per project.",
    headline: "Nothing falls through after kickoff",
    subhead:
      "Internal to-dos and client-assigned tasks live on the project — so feedback and deliverables stay visible.",
    stats: [
      { value: "Internal", label: "Your team checklist" },
      { value: "Client tasks", label: "Content, assets, approvals" },
      { value: "Per project", label: "Never lose a to-do in chat" },
    ],
    journey: [
      {
        title: "Plan",
        body: "Break launches into kickoff, build, QA, and handoff tasks.",
      },
      {
        title: "Assign",
        body: "Give clients clear asks with due dates in the portal.",
      },
      {
        title: "Track",
        body: "See what is blocked waiting on feedback or payment.",
      },
      {
        title: "Finish",
        body: "Close tasks as deliverables ship — history stays on the project.",
      },
    ],
    faqs: [
      {
        q: "Can clients complete tasks in the portal?",
        a: "Yes. Client-facing tasks appear in their portal with context and due dates.",
      },
      {
        q: "Are tasks tied to automations?",
        a: "Automations can create tasks when a contract is signed or a stage changes.",
      },
    ],
  },
  {
    slug: "ai",
    title: "PortalKit AI",
    blurb: "Drafts, recaps, and next steps tailored to your work.",
    headline: "AI that means business",
    subhead:
      "Draft emails, summarize projects, and surface next steps — tuned for Shopify freelance workflows.",
    stats: [
      { value: "Drafts", label: "Replies in your voice" },
      { value: "Recaps", label: "Meeting-ready project summaries" },
      { value: "Trends", label: "See what packages convert" },
    ],
    journey: [
      {
        title: "Email drafts",
        body: "Write fast, reply faster — grounded in project context.",
      },
      {
        title: "Project summaries",
        body: "Make prep the easy step before every client call.",
      },
      {
        title: "Lead insights",
        body: "Turn form answers into clear next actions.",
      },
      {
        title: "Business trends",
        body: "Spot which offers close and where deals stall.",
      },
    ],
    faqs: [
      {
        q: "Can I turn AI off?",
        a: "Yes. Use AI when it helps and leave it off when you want a fully manual workflow.",
      },
      {
        q: "Does AI send messages without me?",
        a: "Drafts and suggestions wait for your approval. You stay in control of what clients see.",
      },
    ],
  },
] as const;

export type ProductLink = (typeof PRODUCT_LINKS)[number];

export const TEMPLATE_CATEGORIES = [
  "All",
  "Proposals",
  "Contracts",
  "Invoices",
  "Questionnaires",
  "Lead forms",
  "Services guides",
] as const;

export const TEMPLATES = [
  {
    name: "Shopify theme rebuild proposal",
    category: "Proposals",
    blurb: "Scope, timeline, and milestone pricing for theme work.",
    featured: true,
    tone: "accent" as const,
  },
  {
    name: "Launch QA package",
    category: "Proposals",
    blurb: "Fixed-fee launch checklist clients can approve fast.",
    featured: true,
    tone: "hero" as const,
  },
  {
    name: "Retainer offer deck",
    category: "Proposals",
    blurb: "Monthly store care packages with clear hour blocks.",
    featured: false,
    tone: "mint" as const,
  },
  {
    name: "Freelance services contract",
    category: "Contracts",
    blurb: "Simple services agreement with deposit terms.",
    featured: true,
    tone: "mint" as const,
  },
  {
    name: "Retainer agreement",
    category: "Contracts",
    blurb: "Monthly store care with clear hours and response SLAs.",
    featured: true,
    tone: "accent" as const,
  },
  {
    name: "NDA + services combo",
    category: "Contracts",
    blurb: "Protect brand assets before discovery deep-dives.",
    featured: false,
    tone: "hero" as const,
  },
  {
    name: "Project deposit invoice",
    category: "Invoices",
    blurb: "40% kickoff deposit with Razorpay pay link.",
    featured: true,
    tone: "hero" as const,
  },
  {
    name: "Milestone invoice",
    category: "Invoices",
    blurb: "Theme build / launch / handoff line items.",
    featured: true,
    tone: "mint" as const,
  },
  {
    name: "Monthly retainer invoice",
    category: "Invoices",
    blurb: "Recurring store-care billing with autopay nudge.",
    featured: false,
    tone: "accent" as const,
  },
  {
    name: "Discovery questionnaire",
    category: "Questionnaires",
    blurb: "Goals, store URL, budget, and brand assets checklist.",
    featured: false,
    tone: "accent" as const,
  },
  {
    name: "Brand asset checklist",
    category: "Questionnaires",
    blurb: "Logo, fonts, product photos, and copy intake.",
    featured: false,
    tone: "hero" as const,
  },
  {
    name: "Shopify project inquiry",
    category: "Lead forms",
    blurb: "Website form that drops leads into your pipeline.",
    featured: false,
    tone: "mint" as const,
  },
  {
    name: "Quick quote form",
    category: "Lead forms",
    blurb: "Short form for budget and timeline triage.",
    featured: false,
    tone: "accent" as const,
  },
  {
    name: "Services & pricing guide",
    category: "Services guides",
    blurb: "Packages clients can browse before they book.",
    featured: false,
    tone: "hero" as const,
  },
] as const;

export const INDUSTRY_KITS = [
  {
    name: "Shopify freelancer kit",
    blurb: "Proposal, contract, deposit invoice, and inquiry form.",
    href: "/business-type/shopify-freelancers",
  },
  {
    name: "Web designer kit",
    blurb: "Package proposal, services guide, and milestone invoices.",
    href: "/business-type/web-designers",
  },
  {
    name: "Agency retainer kit",
    blurb: "Retainer agreement, recurring invoice, and onboarding questionnaire.",
    href: "/business-type/marketing-agencies",
  },
  {
    name: "Photographer kit",
    blurb: "Booking proposal, shoot contract, and deposit invoice.",
    href: "/business-type/photographers",
  },
  {
    name: "Coach kit",
    blurb: "Program proposal, client agreement, and application form.",
    href: "/business-type/coaches",
  },
  {
    name: "Consultant kit",
    blurb: "SOW proposal, NDA combo, and discovery questionnaire.",
    href: "/business-type/consultants",
  },
] as const;

export const RESOURCE_HUB = [
  {
    group: "Get started",
    items: [
      {
        title: "How to run a Shopify client portal",
        blurb: "Replace Drive + email chaos with one branded project HQ.",
        href: "/product/client-portal",
        tag: "Guide",
      },
      {
        title: "Proposal → deposit in one send",
        blurb: "Close freelancers who currently chase payments for weeks.",
        href: "/product/proposals",
        tag: "Guide",
      },
      {
        title: "Pipeline stages that convert",
        blurb: "Inquiry → booked using automation triggers that match real freelance sales.",
        href: "/product/pipeline",
        tag: "Guide",
      },
      {
        title: "Week-1 sales script for PortalKit",
        blurb: "DM scripts to hit early MRR with Shopify freelancers.",
        href: "/sign-up",
        tag: "Playbook",
      },
    ],
  },
  {
    group: "Product deep dives",
    items: [
      {
        title: "CRM for freelancers",
        blurb: "One client record from first inquiry to final invoice.",
        href: "/product/crm",
        tag: "Product",
      },
      {
        title: "Automations that save hours",
        blurb: "Follow-ups, onboarding, and reminders without a ops hire.",
        href: "/product/automations",
        tag: "Product",
      },
      {
        title: "Payments inside the client flow",
        blurb: "Collect deposits where clients already review your offer.",
        href: "/product/payments",
        tag: "Product",
      },
      {
        title: "PortalKit AI drafts & recaps",
        blurb: "Write faster and prep for calls with project-aware AI.",
        href: "/product/ai",
        tag: "Product",
      },
    ],
  },
  {
    group: "Templates & tools",
    items: [
      {
        title: "Browse the template gallery",
        blurb: "Proposals, contracts, invoices, and forms ready to customize.",
        href: "/templates",
        tag: "Templates",
      },
      {
        title: "Industry starter kits",
        blurb: "Bundles for Shopify freelancers, designers, coaches, and more.",
        href: "/templates",
        tag: "Templates",
      },
      {
        title: "Compare plans",
        blurb: "Free, Pro, and Founder — pick what fits this week.",
        href: "/pricing",
        tag: "Pricing",
      },
      {
        title: "Open demo workspace",
        blurb: "Walk the dashboard: pipeline, files, and portals.",
        href: "/dashboard",
        tag: "Demo",
      },
    ],
  },
  {
    group: "By business type",
    items: [
      {
        title: "Shopify freelancers",
        blurb: "Theme builds, launches, and retainers in one portal.",
        href: "/business-type/shopify-freelancers",
        tag: "Vertical",
      },
      {
        title: "Web designers",
        blurb: "Proposals, deposits, and delivery files in one HQ.",
        href: "/business-type/web-designers",
        tag: "Vertical",
      },
      {
        title: "Photographers",
        blurb: "Bookings, contracts, and client portals beyond the shoot.",
        href: "/business-type/photographers",
        tag: "Vertical",
      },
      {
        title: "Marketing agencies",
        blurb: "Multi-client pipelines and retainer billing.",
        href: "/business-type/marketing-agencies",
        tag: "Vertical",
      },
    ],
  },
] as const;

export const RESOURCE_LINKS = [
  { href: "/resources", title: "Resource hub", blurb: "Guides to win and deliver Shopify clients." },
  { href: "/why", title: "Why PortalKit", blurb: "How freelancers go from lead to payment in one place." },
  { href: "/reviews", title: "Reviews", blurb: "What early freelancers say about PortalKit." },
  { href: "/dashboard", title: "Open demo workspace", blurb: "Walk the live dashboard: pipeline, files, portals." },
] as const;

export const PRICING_FAQS = [
  {
    q: "How much does PortalKit cost?",
    a: "Starter is free forever for one active project. Pro (best seller) is $19/mo for unlimited projects. Founder is $99 lifetime Pro — cheaper than ~5 months of Pro billing — for the first 20 freelancers. Offers, e-sign, and client portal pay are shipping next — we don’t claim them until live.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes. Sign up free — no card required. Every new account gets a clean private workspace and a 14-day Pro trial. After the trial you can stay on Starter or upgrade to Pro / Founder.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Change or cancel your Pro subscription anytime. Founder is a one-time lifetime purchase.",
  },
  {
    q: "Do you limit clients on paid plans?",
    a: "Pro and Founder include unlimited clients and projects. Starter is capped at one active project so you can try the full client experience.",
  },
  {
    q: "Are prices different by country?",
    a: "No. Everyone starts from the same USD list price (Pro $19/mo, Founder $99). We convert to your local currency automatically, then add 18% GST on the plan fee worldwide — Razorpay does not add that for you; PortalKit includes it in the charge. Razorpay’s own platform fee still has GST on their fee separately.",
  },
  {
    q: "What payment processing fees apply?",
    a: "PortalKit plan checkout (Pro / Founder) is processed through Razorpay with international currency support. Same USD list price; local currency at checkout. Razorpay’s published rates apply.",
  },
  {
    q: "What is the Founder offer?",
    a: "The first 20 freelancers can lock lifetime Pro for $99 — less than half a year of Pro at $19/mo. After the cohort fills, Pro is billed monthly.",
  },
] as const;

/** Product pages that are roadmap / not shippable yet — show Coming soon. */
export const COMING_SOON_PRODUCT_SLUGS = new Set([
  "contracts",
  "lead-forms",
  "automations",
  "scheduler",
  "tasks",
  "ai",
]);

export const PRICING_COMPARISON = [
  {
    feature: "Active projects",
    starter: "1",
    pro: "Unlimited",
    founder: "Unlimited",
  },
  {
    feature: "Projects + deal board",
    starter: true,
    pro: true,
    founder: true,
  },
  {
    feature: "Client portal link",
    starter: true,
    pro: true,
    founder: true,
  },
  {
    feature: "Payment asks + mark paid",
    starter: true,
    pro: true,
    founder: true,
  },
  {
    feature: "Studio branding settings",
    starter: true,
    pro: true,
    founder: true,
  },
  {
    feature: "Offers, e-sign, lead forms",
    starter: "Soon",
    pro: "Soon",
    founder: "Soon",
  },
  {
    feature: "Client pay on portal (Razorpay)",
    starter: "Soon",
    pro: "Soon",
    founder: "Soon",
  },
  {
    feature: "Scheduler / automations / AI",
    starter: false,
    pro: "Post-MVP",
    founder: "Post-MVP",
  },
  {
    feature: "Remove PortalKit badge",
    starter: false,
    pro: "Post-MVP",
    founder: "Post-MVP",
  },
  {
    feature: "Founding cohort seat",
    starter: false,
    pro: false,
    founder: true,
  },
] as const;
