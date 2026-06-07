"use client";

import { type ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  formatCurrency,
  formatDate,
  getActiveInvoice,
  getBillableHours,
  getInvoiceById,
  portalProject,
  type PortalClientProject,
  type PortalHourEntry,
  type PortalInvoice,
} from "../lib/portal-data";

type PortalSide = "client" | "admin";
type ProjectEntriesById = Record<string, PortalHourEntry[]>;
type ClientAvatarImages = Record<string, string>;
type ActiveTimeEntry = {
  id: string;
  projectId: string;
  date: string;
  startedAt: number;
  accumulatedMs: number;
  isRunning: boolean;
};
type EntryEditDraft = {
  description: string;
  hours: string;
};
type EntryEditDrafts = Record<string, EntryEditDraft>;
type CompletionEmailResponse = {
  emailSent?: boolean;
  message?: string;
  preview?: {
    to: string;
    subject: string;
  };
};

function projectDateValue(project: PortalClientProject) {
  return new Date(`${project.deliveryDate}T12:00:00`).getTime();
}

function isPastProject(project: PortalClientProject) {
  return getInvoiceById(project.invoiceId)?.status === "paid";
}

function formatElapsedTime(milliseconds: number) {
  const totalSeconds = Math.max(Math.floor(milliseconds / 1000), 0);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const paddedMinutes = String(minutes).padStart(hours > 0 ? 2 : 1, "0");
  const paddedSeconds = String(seconds).padStart(2, "0");

  return hours > 0 ? `${hours}:${paddedMinutes}:${paddedSeconds}` : `${paddedMinutes}:${paddedSeconds}`;
}

function toLocalDateValue(timestamp: number) {
  const date = new Date(timestamp);
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
}

function getLiveLoggedHours(milliseconds: number) {
  if (milliseconds <= 0) return 0;
  return Math.max(Number((milliseconds / 3600000).toFixed(2)), 0.01);
}

function getStoppedLoggedHours(milliseconds: number) {
  const elapsedMinutes = Math.max(Math.round(milliseconds / 60000), 1);
  return Number((elapsedMinutes / 60).toFixed(2));
}

function PlayIcon() {
  return (
    <svg aria-hidden="true" className="v2-portal-play-icon" fill="none" height="15" viewBox="0 0 24 24" width="15">
      <path d="M8 5v14l11-7Z" fill="currentColor" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="15" viewBox="0 0 24 24" width="15">
      <path d="M9 6.5v11M15 6.5v11" stroke="currentColor" strokeLinecap="round" strokeWidth="2.4" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="15" viewBox="0 0 24 24" width="15">
      <rect fill="currentColor" height="8.8" rx="1.2" width="8.8" x="7.6" y="7.6" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="14" viewBox="0 0 24 24" width="14">
      <path d="m5.2 18.8 3.45-.72 9.7-9.7a1.62 1.62 0 0 0 0-2.3l-.43-.43a1.62 1.62 0 0 0-2.3 0l-9.7 9.7-.72 3.45Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
      <path d="m14.5 6.75 2.75 2.75" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="14" viewBox="0 0 24 24" width="14">
      <path d="M7 7h10M10 7V5h4v2M8.4 7l.5 11h6.2l.5-11" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function SummaryIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="15" viewBox="0 0 24 24" width="15">
      <circle cx="12" cy="12" r="8.25" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 10.75V16" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
      <path d="M12 8H12.01" stroke="currentColor" strokeLinecap="round" strokeWidth="2.2" />
    </svg>
  );
}

function ViewModeIcon({ side }: { side: PortalSide }) {
  if (side === "client") {
    return (
      <svg aria-hidden="true" fill="none" height="15" viewBox="0 0 24 24" width="15">
        <path d="M6.5 20V5.8c0-.9.6-1.55 1.48-1.55h8.04c.88 0 1.48.65 1.48 1.55V20" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
        <path d="M4.75 20h14.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
        <path d="M9.25 8h1.1M13.65 8h1.1M9.25 11.4h1.1M13.65 11.4h1.1M9.25 14.8h1.1M13.65 14.8h1.1" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" fill="none" height="15" viewBox="0 0 24 24" width="15">
      <circle cx="12" cy="8.6" r="3.1" stroke="currentColor" strokeWidth="1.7" />
      <path d="M6.7 18.5c.78-2.7 2.6-4.05 5.3-4.05s4.52 1.35 5.3 4.05" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
    </svg>
  );
}

function getInitials(name: string) {
  const words = name
    .split(/\s+/)
    .map((word) => word.replace(/[^a-zA-Z0-9]/g, ""))
    .filter(Boolean);

  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();

  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
}

function ClientAvatar({ imageUrl, initials, name }: { imageUrl?: string; initials?: string; name: string }) {
  return (
    <span className="v2-portal-avatar" aria-hidden="true">
      {imageUrl ? <img alt="" src={imageUrl} /> : <span>{initials ?? getInitials(name)}</span>}
    </span>
  );
}

export function ClientPortalPanel() {
  const avatarFileInputRef = useRef<HTMLInputElement>(null);
  const [side, setSide] = useState<PortalSide>("admin");
  const [adminClientFilter, setAdminClientFilter] = useState(portalProject.client.id);
  const [avatarUploadClientId, setAvatarUploadClientId] = useState<string | null>(null);
  const [clientAvatarImages, setClientAvatarImages] = useState<ClientAvatarImages>({});
  const [expandedProjectIds, setExpandedProjectIds] = useState<string[]>([]);
  const [expandedSummaryProjectIds, setExpandedSummaryProjectIds] = useState<string[]>([]);
  const [completedProjectIds, setCompletedProjectIds] = useState<string[]>([]);
  const [completionProjectId, setCompletionProjectId] = useState<string | null>(null);
  const [completionNotice, setCompletionNotice] = useState<string | null>(null);
  const [completionError, setCompletionError] = useState<string | null>(null);
  const [completingProjectId, setCompletingProjectId] = useState<string | null>(null);
  const [checkoutInvoiceId, setCheckoutInvoiceId] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [activeTimeEntry, setActiveTimeEntry] = useState<ActiveTimeEntry | null>(null);
  const [timerElapsedMs, setTimerElapsedMs] = useState(0);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [entryEditDrafts, setEntryEditDrafts] = useState<EntryEditDrafts>({});
  const [projectEntriesById, setProjectEntriesById] = useState<ProjectEntriesById>(() =>
    portalProject.projects.reduce<ProjectEntriesById>((entriesById, project) => {
      entriesById[project.id] = project.hourEntries;
      return entriesById;
    }, {}),
  );

  const projectsWithCurrentLogs = useMemo(() => {
    return portalProject.projects.map((project) => {
      const projectEntries = projectEntriesById[project.id] ?? project.hourEntries;

      return {
        ...project,
        hourEntries: projectEntries,
        updatedOn: projectEntries[0]?.date ?? project.updatedOn,
      };
    });
  }, [projectEntriesById]);
  const nextInvoiceProject = useMemo(() => {
    return [...projectsWithCurrentLogs]
      .filter((project) => project.clientId === portalProject.client.id && !isPastProject(project))
      .sort((a, b) => projectDateValue(a) - projectDateValue(b))[0];
  }, [projectsWithCurrentLogs]);
  const activeInvoice = nextInvoiceProject ? getInvoiceById(nextInvoiceProject.invoiceId) : getActiveInvoice();
  const nextInvoiceProjectComplete = nextInvoiceProject ? completedProjectIds.includes(nextInvoiceProject.id) : false;
  const invoiceAmountCents = nextInvoiceProject
    ? nextInvoiceProject.totalHours * portalProject.agreement.hourlyRateCents
    : activeInvoice?.amountDueCents ?? 0;
  const completionProject = completionProjectId
    ? projectsWithCurrentLogs.find((project) => project.id === completionProjectId)
    : undefined;

  const adminClients = useMemo(() => {
    return [
      {
        id: portalProject.client.id,
        name: portalProject.client.name,
        logoSrc: portalProject.client.logoSrc,
        activeProjectCount: projectsWithCurrentLogs.filter(
          (project) => project.clientId === portalProject.client.id && !isPastProject(project),
        ).length,
      },
    ];
  }, [projectsWithCurrentLogs]);
  const selectedAdminClientName =
    adminClients.find((client) => client.id === adminClientFilter)?.name ?? portalProject.client.name;

  const visibleProjects = useMemo(() => {
    const projects =
      side === "client"
        ? projectsWithCurrentLogs.filter((project) => project.clientId === portalProject.client.id)
        : projectsWithCurrentLogs.filter((project) => project.clientId === adminClientFilter);

    return [...projects].sort((a, b) => {
      const aPast = isPastProject(a);
      const bPast = isPastProject(b);

      if (aPast !== bPast) return aPast ? 1 : -1;

      if (side === "admin") return projectDateValue(a) - projectDateValue(b);

      return projectDateValue(b) - projectDateValue(a);
    });
  }, [adminClientFilter, projectsWithCurrentLogs, side]);

  async function startCheckout(invoiceId: string) {
    setCheckoutInvoiceId(invoiceId);
    setCheckoutError(null);

    try {
      const response = await fetch("/api/portal/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId, paymentPreference: "stripe" }),
      });
      const payload = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !payload.url) {
        throw new Error(payload.error ?? "Could not start checkout.");
      }

      window.location.assign(payload.url);
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : "Could not start checkout.");
      setCheckoutInvoiceId(null);
    }
  }

  useEffect(() => {
    if (!activeTimeEntry) {
      setTimerElapsedMs(0);
      return;
    }

    if (!activeTimeEntry.isRunning) {
      setTimerElapsedMs(activeTimeEntry.accumulatedMs);
      return;
    }

    const updateElapsed = () =>
      setTimerElapsedMs(activeTimeEntry.accumulatedMs + Date.now() - activeTimeEntry.startedAt);
    updateElapsed();
    const intervalId = window.setInterval(updateElapsed, 1000);

    return () => window.clearInterval(intervalId);
  }, [activeTimeEntry]);

  function startProjectTimer(projectId: string) {
    const startedAt = Date.now();

    setActiveTimeEntry({
      id: `draft-${startedAt}`,
      projectId,
      date: toLocalDateValue(startedAt),
      startedAt,
      accumulatedMs: 0,
      isRunning: true,
    });
    setExpandedProjectIds((projectIds) => (projectIds.includes(projectId) ? projectIds : [...projectIds, projectId]));
  }

  function resumeProjectTimer() {
    setActiveTimeEntry((entry) => (entry ? { ...entry, startedAt: Date.now(), isRunning: true } : entry));
  }

  function pauseProjectTimer() {
    setActiveTimeEntry((entry) =>
      entry && entry.isRunning
        ? { ...entry, accumulatedMs: entry.accumulatedMs + Date.now() - entry.startedAt, isRunning: false }
        : entry,
    );
  }

  function stopProjectTimer() {
    if (!activeTimeEntry) return;

    const stoppedAt = Date.now();
    const elapsedMs = activeTimeEntry.isRunning
      ? activeTimeEntry.accumulatedMs + stoppedAt - activeTimeEntry.startedAt
      : activeTimeEntry.accumulatedMs;
    const hours = getStoppedLoggedHours(elapsedMs);

    const entry: PortalHourEntry = {
      id: `time-${stoppedAt}`,
      date: activeTimeEntry.date,
      category: "Timed work",
      description: "",
      insight: "",
      hours,
      billable: true,
    };

    setProjectEntriesById((entriesById) => ({
      ...entriesById,
      [activeTimeEntry.projectId]: [entry, ...(entriesById[activeTimeEntry.projectId] ?? [])],
    }));
    setExpandedProjectIds((projectIds) =>
      projectIds.includes(activeTimeEntry.projectId) ? projectIds : [...projectIds, activeTimeEntry.projectId],
    );
    setEntryEditDrafts((drafts) => ({ ...drafts, [entry.id]: { description: "", hours: entry.hours.toFixed(2) } }));
    setEditingEntryId(entry.id);
    setActiveTimeEntry(null);
  }

  function startEntryEdit(entry: PortalHourEntry) {
    setEditingEntryId(entry.id);
    setEntryEditDrafts((drafts) => ({
      ...drafts,
      [entry.id]: {
        description: entry.description,
        hours: entry.hours.toFixed(2),
      },
    }));
  }

  function updateEntryEditDraft(entryId: string, field: keyof EntryEditDraft, value: string) {
    setEntryEditDrafts((drafts) => ({
      ...drafts,
      [entryId]: {
        description: drafts[entryId]?.description ?? "",
        hours: drafts[entryId]?.hours ?? "",
        [field]: value,
      },
    }));
  }

  function saveEntryEdit(entryId: string) {
    const draft = entryEditDrafts[entryId];
    const description = (draft?.description ?? "").trim() || "Timed work session";
    const parsedHours = Number.parseFloat(draft?.hours ?? "");
    const hours = Number.isFinite(parsedHours) && parsedHours > 0 ? Number(parsedHours.toFixed(2)) : 0.01;

    setProjectEntriesById((entriesById) =>
      Object.fromEntries(
        Object.entries(entriesById).map(([projectId, entries]) => [
          projectId,
          entries.map((entry) => (entry.id === entryId ? { ...entry, description, hours } : entry)),
        ]),
      ),
    );
    setEditingEntryId(null);
    setEntryEditDrafts((drafts) => {
      const nextDrafts = { ...drafts };
      delete nextDrafts[entryId];
      return nextDrafts;
    });
  }

  function deleteEntry(entryId: string) {
    setProjectEntriesById((entriesById) =>
      Object.fromEntries(
        Object.entries(entriesById).map(([projectId, entries]) => [
          projectId,
          entries.filter((entry) => entry.id !== entryId),
        ]),
      ),
    );
    if (editingEntryId === entryId) setEditingEntryId(null);
    setEntryEditDrafts((drafts) => {
      const nextDrafts = { ...drafts };
      delete nextDrafts[entryId];
      return nextDrafts;
    });
  }

  function requestClientAvatarImage(clientId: string) {
    setAvatarUploadClientId(clientId);
    avatarFileInputRef.current?.click();
  }

  function handleClientAvatarImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    const clientId = avatarUploadClientId;
    event.target.value = "";

    if (!file || !clientId) {
      setAvatarUploadClientId(null);
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      if (typeof reader.result === "string") {
        setClientAvatarImages((images) => ({ ...images, [clientId]: reader.result as string }));
      }
      setAvatarUploadClientId(null);
    });
    reader.addEventListener("error", () => setAvatarUploadClientId(null));
    reader.readAsDataURL(file);
  }

  function toggleProject(projectId: string) {
    setExpandedProjectIds((projectIds) =>
      projectIds.includes(projectId) ? projectIds.filter((id) => id !== projectId) : [...projectIds, projectId],
    );
  }

  function toggleProjectSummary(projectId: string) {
    setExpandedSummaryProjectIds((projectIds) =>
      projectIds.includes(projectId) ? projectIds.filter((id) => id !== projectId) : [...projectIds, projectId],
    );
  }

  function requestProjectCompletion(projectId: string) {
    setCompletionProjectId(projectId);
    setCompletionError(null);
    setCompletionNotice(null);
  }

  async function confirmProjectCompletion() {
    if (!completionProject) return;

    setCompletingProjectId(completionProject.id);
    setCompletionError(null);
    setCompletionNotice(null);

    try {
      const response = await fetch("/api/portal/project-complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: completionProject.id }),
      });
      const payload = (await response.json().catch(() => null)) as CompletionEmailResponse | null;

      if (!response.ok) {
        throw new Error(payload?.message ?? "Could not send completion email.");
      }

      setCompletedProjectIds((projectIds) =>
        projectIds.includes(completionProject.id) ? projectIds : [...projectIds, completionProject.id],
      );
      setCompletionProjectId(null);
      setCompletionNotice(
        payload?.emailSent
          ? "Project marked complete. The client has been emailed."
          : payload?.message ?? "Project marked complete. Email delivery is not configured yet.",
      );
    } catch (error) {
      setCompletionError(error instanceof Error ? error.message : "Could not send completion email.");
    } finally {
      setCompletingProjectId(null);
    }
  }

  return (
    <section className="v2-panel v2-panel-portal">
      <div className="v2-portal-head">
        <h1 className="v2-portal-title">Client Portal</h1>
        <button
          aria-label={side === "admin" ? "Alden view. Switch to client view" : "Client view. Switch to Alden view"}
          aria-pressed={side === "client"}
          className="v2-portal-view-toggle"
          title={side === "admin" ? "Alden view" : "Client view"}
          type="button"
          onClick={() => setSide((currentSide) => (currentSide === "admin" ? "client" : "admin"))}
        >
          <ViewModeIcon side={side} />
        </button>
      </div>

      <div className="v2-portal-surface">
        {side === "client" && (
          <div className="v2-portal-surface-bar">
            <div className="v2-portal-surface-client">
              <span className="v2-portal-surface-logo" aria-hidden="true">
                <img alt="" src={portalProject.client.logoSrc} />
              </span>
              <div>
                <strong>{portalProject.client.name}</strong>
              </div>
            </div>
          </div>
        )}

        <div className="v2-portal-surface-body">
          {completionNotice && <p className="v2-portal-notice">{completionNotice}</p>}
          {side === "client" && (
            <>
              <MasterInvoice
                checkoutInvoiceId={checkoutInvoiceId}
                invoice={activeInvoice}
                invoiceAmountCents={invoiceAmountCents}
                isProjectComplete={nextInvoiceProjectComplete}
                onPay={startCheckout}
                project={nextInvoiceProject}
              />
              {checkoutError && <p className="v2-portal-error">{checkoutError}</p>}
            </>
          )}

          {side === "admin" && (
            <div className="v2-portal-client-filter" aria-label="Client filter">
              <div className="v2-portal-client-filter-head">
                <span>Client</span>
                <span>{selectedAdminClientName}</span>
              </div>
              <div className="v2-portal-avatar-list">
                {adminClients.map((client) => (
                  <button
                    aria-label={`Show ${client.name}, ${client.activeProjectCount} active ${
                      client.activeProjectCount === 1 ? "project" : "projects"
                    }`}
                    aria-pressed={adminClientFilter === client.id}
                    className={`v2-portal-avatar-button${
                      adminClientFilter === client.id ? " v2-portal-avatar-button-active" : ""
                    }`}
                    key={client.id}
                    type="button"
                    onClick={() => setAdminClientFilter(client.id)}
                    onContextMenu={(event) => {
                      event.preventDefault();
                      requestClientAvatarImage(client.id);
                    }}
                  >
                    <ClientAvatar imageUrl={clientAvatarImages[client.id] ?? client.logoSrc} name={client.name} />
                    <span className="v2-portal-avatar-badge" aria-hidden="true">
                      {client.activeProjectCount}
                    </span>
                  </button>
                ))}
              </div>
              <input
                aria-label="Upload client avatar"
                className="v2-portal-avatar-input"
                ref={avatarFileInputRef}
                type="file"
                accept="image/*"
                onChange={handleClientAvatarImageChange}
              />
            </div>
          )}

          <ProjectStack
            activeTimeEntry={activeTimeEntry}
            expandedProjectIds={expandedProjectIds}
            expandedSummaryProjectIds={expandedSummaryProjectIds}
            completedProjectIds={completedProjectIds}
            editingEntryId={editingEntryId}
            entryEditDrafts={entryEditDrafts}
            onDeleteEntry={deleteEntry}
            onEntryEditChange={updateEntryEditDraft}
            onEditEntry={startEntryEdit}
            onMarkProjectComplete={requestProjectCompletion}
            onPauseTimer={pauseProjectTimer}
            onResumeTimer={resumeProjectTimer}
            onSaveEntryEdit={saveEntryEdit}
            onStartTimer={startProjectTimer}
            onStopTimer={stopProjectTimer}
            onToggleProjectSummary={toggleProjectSummary}
            onToggleProject={toggleProject}
            projects={visibleProjects}
            showClientName={false}
            showTimerControls={side === "admin"}
            timerElapsedMs={timerElapsedMs}
          />
        </div>

        {completionProject && (
          <div className="v2-portal-modal-backdrop" role="presentation">
            <div
              aria-labelledby="v2-portal-completion-title"
              aria-modal="true"
              className="v2-portal-modal"
              role="dialog"
            >
              <span className="v2-portal-label">Confirm completion</span>
              <h2 id="v2-portal-completion-title">Mark project complete?</h2>
              <p>
                This will mark <strong>{completionProject.name}</strong> complete, unlock the invoice for payment, and
                email {portalProject.client.email}.
              </p>
              {completionError && <p className="v2-portal-modal-error">{completionError}</p>}
              <div className="v2-portal-modal-actions">
                <button
                  className="v2-portal-modal-secondary"
                  disabled={completingProjectId === completionProject.id}
                  type="button"
                  onClick={() => setCompletionProjectId(null)}
                >
                  Cancel
                </button>
                <button
                  className="v2-portal-modal-primary"
                  disabled={completingProjectId === completionProject.id}
                  type="button"
                  onClick={confirmProjectCompletion}
                >
                  {completingProjectId === completionProject.id ? "Sending" : "Confirm and email"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function MasterInvoice({
  checkoutInvoiceId,
  invoice,
  invoiceAmountCents,
  isProjectComplete,
  onPay,
  project,
}: {
  checkoutInvoiceId: string | null;
  invoice?: PortalInvoice;
  invoiceAmountCents: number;
  isProjectComplete: boolean;
  onPay: (invoiceId: string) => void;
  project?: PortalClientProject;
}) {
  if (!invoice) return null;

  const isPayable = isProjectComplete && (invoice.status === "approval" || invoice.status === "due");

  return (
    <div className={`v2-portal-master-invoice${isPayable ? "" : " v2-portal-master-invoice-locked"}`}>
      <div>
        <span className="v2-portal-label">Next invoice</span>
        <strong>{project?.name ?? invoice.title}</strong>
        <p>
          {project ? `Delivery ${formatDate(project.deliveryDate)} / ` : ""}
          {isPayable ? "Ready to pay" : "Available after project completion"} / {formatCurrency(invoiceAmountCents)}
        </p>
      </div>
      <button
        className="v2-portal-pay-button"
        type="button"
        onClick={() => {
          if (isPayable) onPay(invoice.id);
        }}
        disabled={!isPayable || checkoutInvoiceId === invoice.id}
      >
        {isPayable ? (checkoutInvoiceId === invoice.id ? "Opening payment" : "Pay invoice") : "Not ready yet"}
      </button>
    </div>
  );
}

function ProjectStack({
  activeTimeEntry,
  completedProjectIds,
  editingEntryId,
  entryEditDrafts,
  expandedProjectIds,
  expandedSummaryProjectIds,
  onDeleteEntry,
  onEditEntry,
  onEntryEditChange,
  onMarkProjectComplete,
  onPauseTimer,
  onResumeTimer,
  onSaveEntryEdit,
  onStartTimer,
  onStopTimer,
  onToggleProjectSummary,
  onToggleProject,
  projects,
  showClientName = false,
  showTimerControls = false,
  timerElapsedMs,
}: {
  activeTimeEntry: ActiveTimeEntry | null;
  completedProjectIds: string[];
  editingEntryId: string | null;
  entryEditDrafts: EntryEditDrafts;
  expandedProjectIds: string[];
  expandedSummaryProjectIds: string[];
  onDeleteEntry: (entryId: string) => void;
  onEditEntry: (entry: PortalHourEntry) => void;
  onEntryEditChange: (entryId: string, field: keyof EntryEditDraft, value: string) => void;
  onMarkProjectComplete: (projectId: string) => void;
  onPauseTimer: () => void;
  onResumeTimer: () => void;
  onSaveEntryEdit: (entryId: string) => void;
  onStartTimer: (projectId: string) => void;
  onStopTimer: () => void;
  onToggleProjectSummary: (projectId: string) => void;
  onToggleProject: (projectId: string) => void;
  projects: PortalClientProject[];
  showClientName?: boolean;
  showTimerControls?: boolean;
  timerElapsedMs: number;
}) {
  const activeProjects = projects.filter((project) => !isPastProject(project));
  const pastProjects = projects.filter(isPastProject);

  return (
    <>
      <ProjectGroup
        activeTimeEntry={activeTimeEntry}
        completedProjectIds={completedProjectIds}
        editingEntryId={editingEntryId}
        entryEditDrafts={entryEditDrafts}
        expandedProjectIds={expandedProjectIds}
        expandedSummaryProjectIds={expandedSummaryProjectIds}
        onDeleteEntry={onDeleteEntry}
        onEditEntry={onEditEntry}
        onEntryEditChange={onEntryEditChange}
        onMarkProjectComplete={onMarkProjectComplete}
        onPauseTimer={onPauseTimer}
        onResumeTimer={onResumeTimer}
        onSaveEntryEdit={onSaveEntryEdit}
        onStartTimer={onStartTimer}
        onStopTimer={onStopTimer}
        onToggleProjectSummary={onToggleProjectSummary}
        onToggleProject={onToggleProject}
        projects={activeProjects}
        showClientName={showClientName}
        showTimerControls={showTimerControls}
        timerElapsedMs={timerElapsedMs}
        title="Active Projects"
      />
      <ProjectGroup
        activeTimeEntry={activeTimeEntry}
        completedProjectIds={completedProjectIds}
        editingEntryId={editingEntryId}
        entryEditDrafts={entryEditDrafts}
        expandedProjectIds={expandedProjectIds}
        expandedSummaryProjectIds={expandedSummaryProjectIds}
        onDeleteEntry={onDeleteEntry}
        onEditEntry={onEditEntry}
        onEntryEditChange={onEntryEditChange}
        onMarkProjectComplete={onMarkProjectComplete}
        onPauseTimer={onPauseTimer}
        onResumeTimer={onResumeTimer}
        onSaveEntryEdit={onSaveEntryEdit}
        onStartTimer={onStartTimer}
        onStopTimer={onStopTimer}
        onToggleProjectSummary={onToggleProjectSummary}
        onToggleProject={onToggleProject}
        projects={pastProjects}
        showClientName={showClientName}
        showTimerControls={showTimerControls}
        timerElapsedMs={timerElapsedMs}
        title="Past Projects"
      />
    </>
  );
}

function ProjectGroup({
  activeTimeEntry,
  completedProjectIds,
  editingEntryId,
  entryEditDrafts,
  expandedProjectIds,
  expandedSummaryProjectIds,
  onDeleteEntry,
  onEditEntry,
  onEntryEditChange,
  onMarkProjectComplete,
  onPauseTimer,
  onResumeTimer,
  onSaveEntryEdit,
  onStartTimer,
  onStopTimer,
  onToggleProjectSummary,
  onToggleProject,
  projects,
  showClientName,
  showTimerControls,
  timerElapsedMs,
  title,
}: {
  activeTimeEntry: ActiveTimeEntry | null;
  completedProjectIds: string[];
  editingEntryId: string | null;
  entryEditDrafts: EntryEditDrafts;
  expandedProjectIds: string[];
  expandedSummaryProjectIds: string[];
  onDeleteEntry: (entryId: string) => void;
  onEditEntry: (entry: PortalHourEntry) => void;
  onEntryEditChange: (entryId: string, field: keyof EntryEditDraft, value: string) => void;
  onMarkProjectComplete: (projectId: string) => void;
  onPauseTimer: () => void;
  onResumeTimer: () => void;
  onSaveEntryEdit: (entryId: string) => void;
  onStartTimer: (projectId: string) => void;
  onStopTimer: () => void;
  onToggleProjectSummary: (projectId: string) => void;
  onToggleProject: (projectId: string) => void;
  projects: PortalClientProject[];
  showClientName: boolean;
  showTimerControls: boolean;
  timerElapsedMs: number;
  title: string;
}) {
  const isActiveGroup = title === "Active Projects";
  const emptyText = isActiveGroup ? "No active projects." : "No past projects yet.";

  return (
    <div className={`v2-portal-section v2-portal-project-group${isActiveGroup ? " v2-portal-project-group-active" : ""}`}>
      <div className="v2-portal-section-head">
        <h2 className="v2-section-title">{title}</h2>
      </div>
      <div className="v2-portal-project-list">
        {projects.length === 0 ? (
          <p className="v2-portal-project-empty">{emptyText}</p>
        ) : (
          projects.map((project) => {
          const invoice = getInvoiceById(project.invoiceId);
          const activeEntryForProject = activeTimeEntry?.projectId === project.id ? activeTimeEntry : null;
          const activeElapsedMs = activeEntryForProject ? timerElapsedMs : 0;
          const activeLoggedHours =
            showTimerControls && activeEntryForProject ? getLiveLoggedHours(activeElapsedMs) : 0;
          const loggedHours = getBillableHours(project.hourEntries) + activeLoggedHours;
          const expanded = expandedProjectIds.includes(project.id);
          const summaryExpanded = expandedSummaryProjectIds.includes(project.id);
          const isPaid = invoice?.status === "paid";
          const isComplete = completedProjectIds.includes(project.id);
          const remainingHours = Math.max(project.totalHours - loggedHours, 0);
          const overageHours = Math.max(loggedHours - project.totalHours, 0);
          const loggedPercent = Math.min(Math.max((loggedHours / project.totalHours) * 100, 0), 100);
          const progressSegments = Math.max(Math.ceil(project.totalHours), 1);
          const isTimingProject = Boolean(activeEntryForProject);
          const timerRunningElsewhere = Boolean(activeTimeEntry && !isTimingProject);

          return (
            <article
              className={`v2-portal-project${isPaid ? " v2-portal-project-paid" : " v2-portal-project-active"}`}
              key={project.id}
            >
              <div className="v2-portal-project-title-row">
                <div className="v2-portal-project-title-cluster">
                  <strong>{project.name}</strong>
                  {project.summary && (
                    <button
                      aria-expanded={summaryExpanded}
                      aria-label={`${summaryExpanded ? "Hide" : "Show"} summary for ${project.name}`}
                      className="v2-portal-project-summary-icon"
                      type="button"
                      onClick={() => onToggleProjectSummary(project.id)}
                    >
                      <SummaryIcon />
                    </button>
                  )}
                </div>
                <button
                  className="v2-portal-project-toggle"
                  type="button"
                  aria-expanded={expanded}
                  aria-label={`${expanded ? "Hide" : "Show"} log for ${project.name}`}
                  onClick={() => onToggleProject(project.id)}
                >
                  <span className="v2-portal-project-toggle-mark" aria-hidden="true">
                    {expanded ? "−" : "+"}
                  </span>
                </button>
              </div>

              {project.summary && summaryExpanded && (
                <div className="v2-portal-project-summary">
                  <p>{project.summary}</p>
                </div>
              )}

              <div className="v2-portal-project-facts">
                {showClientName && (
                  <span>
                    <small>Client</small>
                    <strong>{project.clientName}</strong>
                  </span>
                )}
                <span>
                  <small>Total</small>
                  <strong>{project.totalHours} hrs</strong>
                </span>
                <span>
                  <small>Logged</small>
                  <strong>{loggedHours.toFixed(2)} hrs</strong>
                </span>
                <span>
                  <small>{overageHours > 0 ? "Over" : "Remaining"}</small>
                  <strong>{overageHours > 0 ? overageHours.toFixed(2) : remainingHours.toFixed(2)} hrs</strong>
                </span>
                <span>
                  <small>Delivery</small>
                  <strong>{formatDate(project.deliveryDate)}</strong>
                </span>
                {invoice?.paidOn && (
                  <span>
                    <small>Paid</small>
                    <strong>{formatDate(invoice.paidOn)}</strong>
                  </span>
                )}
              </div>

              {showTimerControls && !isPaid && (
                <div className="v2-portal-project-timer">
                  {!isTimingProject ? (
                    <button
                      aria-label={
                        timerRunningElsewhere ? "Another project timer is running" : `Start timer for ${project.name}`
                      }
                      className="v2-portal-timer-button"
                      disabled={timerRunningElsewhere}
                      type="button"
                      onClick={() => onStartTimer(project.id)}
                    >
                      <PlayIcon />
                    </button>
                  ) : (
                    <>
                      <span>{formatElapsedTime(activeElapsedMs)}</span>
                      {activeEntryForProject?.isRunning ? (
                        <button
                          aria-label={`Pause timer for ${project.name}`}
                          className="v2-portal-timer-button v2-portal-timer-button-active"
                          type="button"
                          onClick={onPauseTimer}
                        >
                          <PauseIcon />
                        </button>
                      ) : (
                        <button
                          aria-label={`Resume timer for ${project.name}`}
                          className="v2-portal-timer-button"
                          type="button"
                          onClick={onResumeTimer}
                        >
                          <PlayIcon />
                        </button>
                      )}
                      <button
                        aria-label={`Stop timer and log time for ${project.name}`}
                        className="v2-portal-timer-button v2-portal-stop-button"
                        type="button"
                        onClick={onStopTimer}
                      >
                        <StopIcon />
                      </button>
                    </>
                  )}
                  <button
                    className="v2-portal-complete-button"
                    disabled={isComplete}
                    type="button"
                    onClick={() => onMarkProjectComplete(project.id)}
                  >
                    {isComplete ? "Complete" : "Mark complete"}
                  </button>
                </div>
              )}

              {!isPaid && (
                <div
                  className="v2-portal-project-progress"
                  aria-label={`${Math.round(loggedPercent)}% of project time logged`}
                  aria-valuemax={100}
                  aria-valuemin={0}
                  aria-valuenow={Math.round(loggedPercent)}
                  role="progressbar"
                >
                  <span className="v2-portal-project-progress-fill" style={{ width: `${loggedPercent}%` }} />
                  <span
                    aria-hidden="true"
                    className="v2-portal-project-progress-segments"
                    style={{ gridTemplateColumns: `repeat(${progressSegments}, minmax(0, 1fr))` }}
                  >
                    {Array.from({ length: progressSegments }, (_, segmentIndex) => (
                      <i key={segmentIndex} />
                    ))}
                  </span>
                </div>
              )}

              {expanded && (
                <div className="v2-portal-log-list">
                  {showTimerControls && activeEntryForProject && (
                    <article className="v2-portal-log-row v2-portal-log-row-active">
                      <div className="v2-portal-log-meta">
                        <span>{formatDate(activeEntryForProject.date)}</span>
                        <span>{formatElapsedTime(activeElapsedMs)}</span>
                      </div>
                      <p>{activeEntryForProject.isRunning ? "Active work session" : "Paused work session"}</p>
                    </article>
                  )}
                  {project.hourEntries.length > 0
                    ? project.hourEntries.map((entry) => {
                        const isEditingEntry = showTimerControls && editingEntryId === entry.id;

                        return (
                          <article
                            className={`v2-portal-log-row${isEditingEntry ? " v2-portal-log-row-editing" : ""}`}
                            key={entry.id}
                          >
                            <div className="v2-portal-log-meta">
                              <span>{formatDate(entry.date)}</span>
                              <span>{entry.hours.toFixed(2)} hrs</span>
                            </div>
                            {isEditingEntry ? (
                              <form
                                className="v2-portal-log-edit"
                                onSubmit={(event) => {
                                  event.preventDefault();
                                  onSaveEntryEdit(entry.id);
                                }}
                              >
                                <input
                                  aria-label="Hours"
                                  className="v2-portal-log-hours-input"
                                  min="0.01"
                                  step="0.01"
                                  type="number"
                                  value={entryEditDrafts[entry.id]?.hours ?? entry.hours.toFixed(2)}
                                  onChange={(event) => onEntryEditChange(entry.id, "hours", event.target.value)}
                                />
                                <input
                                  aria-label="Work description"
                                  autoFocus
                                  placeholder="Describe work done"
                                  type="text"
                                  value={entryEditDrafts[entry.id]?.description ?? entry.description}
                                  onChange={(event) => onEntryEditChange(entry.id, "description", event.target.value)}
                                />
                                <button type="submit">Save</button>
                              </form>
                            ) : (
                              <>
                                <p>
                                  {entry.description || "Timed work session"}
                                  {entry.link && (
                                    <>
                                      {" "}
                                      <a
                                        href={entry.link.href}
                                        rel="noreferrer"
                                        target={entry.link.href.startsWith("/") ? undefined : "_blank"}
                                      >
                                        {entry.link.label}
                                      </a>
                                    </>
                                  )}
                                </p>
                                {showTimerControls && (
                                  <div className="v2-portal-log-actions">
                                    <button
                                      aria-label={`Edit ${entry.description || "timed work session"}`}
                                      type="button"
                                      onClick={() => onEditEntry(entry)}
                                    >
                                      <EditIcon />
                                    </button>
                                    <button
                                      aria-label={`Delete ${entry.description || "timed work session"}`}
                                      type="button"
                                      onClick={() => onDeleteEntry(entry.id)}
                                    >
                                      <DeleteIcon />
                                    </button>
                                  </div>
                                )}
                              </>
                            )}
                          </article>
                        );
                      })
                    : !activeEntryForProject && (
                    <p className="v2-portal-log-empty">No log entries yet.</p>
                      )}
                </div>
              )}
            </article>
          );
          })
        )}
      </div>
    </div>
  );
}
