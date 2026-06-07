export type PortalInvoiceStatus = "draft" | "approval" | "due" | "paid";

export type PortalInvoice = {
  id: string;
  number: string;
  title: string;
  status: PortalInvoiceStatus;
  issuedOn: string;
  dueOn: string;
  amountDueCents: number;
  paidOn?: string;
};

export type PortalHourEntry = {
  id: string;
  date: string;
  category: string;
  description: string;
  insight: string;
  hours: number;
  billable: boolean;
  link?: {
    label: string;
    href: string;
  };
};

export type PortalAgreement = {
  totalHours: number;
  hourlyRateCents: number;
  cadence: string;
  approvalWindow: string;
  autoPay: "off" | "after_approval";
};

export type PortalPayPeriod = {
  id: string;
  startsOn: string;
  endsOn: string;
  status: "open" | "ready_for_approval" | "approved" | "paid";
  invoiceId: string;
};

export type PortalAdminTask = {
  label: string;
  status: "done" | "ready" | "next";
};

export type PortalClientProject = {
  id: string;
  clientId: string;
  clientName: string;
  name: string;
  summary: string;
  totalHours: number;
  deliveryDate: string;
  invoiceId: string;
  updatedOn: string;
  hourEntries: PortalHourEntry[];
};

export const portalProject = {
  id: "horizon-industries",
  projectName: "Logo design and website build",
  phase: "Project kickoff",
  deliveryDate: "2026-06-28",
  client: {
    id: "horizon",
    name: "Horizon Industries",
    contact: "Horizon Industries",
    email: "horizon@example.com",
    logoSrc: "/horizon-industries-mark.svg",
    stripeCustomerId: "",
  },
  agreement: {
    totalHours: 10,
    hourlyRateCents: 10000,
    cadence: "project",
    approvalWindow: "2 business days",
    autoPay: "after_approval",
  } satisfies PortalAgreement,
  activePayPeriod: {
    id: "pp-horizon-2026-06",
    startsOn: "2026-06-03",
    endsOn: "2026-06-28",
    status: "ready_for_approval",
    invoiceId: "inv-horizon-june",
  } satisfies PortalPayPeriod,
  nextMilestone: "Logo direction and website structure",
  invoices: [
    {
      id: "inv-horizon-june",
      number: "AH-2026-004",
      title: "Horizon Industries project invoice",
      status: "approval",
      issuedOn: "2026-06-03",
      dueOn: "2026-06-10",
      amountDueCents: 100000,
    },
  ] satisfies PortalInvoice[],
  hourEntries: [
    {
      id: "time-horizon-1",
      date: "2026-06-03",
      category: "Project start",
      description: "Logo direction and website build kickoff",
      insight: "Established the first design direction and mapped the initial website structure.",
      hours: 4,
      billable: true,
    },
  ] satisfies PortalHourEntry[],
  projects: [
    {
      id: "horizon-logo-website-build",
      clientId: "horizon",
      clientName: "Horizon Industries",
      name: "Logo design and website build",
      summary:
        "Create a focused Horizon Industries identity and launch-ready website foundation, starting with logo direction, core visual language, and the initial site structure.",
      totalHours: 10,
      deliveryDate: "2026-06-28",
      invoiceId: "inv-horizon-june",
      updatedOn: "2026-06-03",
      hourEntries: [
        {
          id: "time-horizon-1",
          date: "2026-06-03",
          category: "Project start",
          description: "Logo direction and website build kickoff",
          insight: "Established the first design direction and mapped the initial website structure.",
          hours: 4,
          billable: true,
        },
      ],
    },
  ] satisfies PortalClientProject[],
  nextActions: [
    "Confirm first logo direction",
    "Draft website structure",
    "Prepare next progress update",
  ],
};

export function getInvoiceById(invoiceId: string): PortalInvoice | undefined {
  return portalProject.invoices.find((invoice) => invoice.id === invoiceId) as PortalInvoice | undefined;
}

export function getActiveInvoice() {
  return getInvoiceById(portalProject.activePayPeriod.invoiceId);
}

export function getBillableHours(entries: PortalHourEntry[] = portalProject.hourEntries as PortalHourEntry[]) {
  return entries.filter((entry) => entry.billable).reduce((sum, entry) => sum + entry.hours, 0);
}

export function getInvoiceAmountCents(entries: PortalHourEntry[] = portalProject.hourEntries as PortalHourEntry[]) {
  return Math.round(getBillableHours(entries) * portalProject.agreement.hourlyRateCents);
}

export function formatCurrency(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}
