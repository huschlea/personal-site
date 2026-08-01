"use client";

/* The record and its chat, shared by the story experience and the classic
   view. Framed as what it is: the notebook kept while building the system,
   not a layer of the system itself. */

import { type FormEvent, useEffect, useRef, useState } from "react";
import ledger from "../../content/design-system-ledger.json";

type Exchange = { question: string; answer: string | null; failed?: boolean };

export function RecordSection() {
  return (
    <section className="ds-col ds-record">
      <h2 className="ds-eyebrow">The record</h2>
      <p className="ds-body">
        I kept a record while building this system: immutable decisions, dated,
        each stating what it settled. It is not part of the operating system;
        it is the notebook beside it. Ask it anything, or read it whole.
      </p>
      <RecordChat />
      <ol className="ds-ledger">
        {ledger.map((entry) => (
          <li key={entry.id} className="ds-ledger-entry">
            <span className="ds-ledger-num" aria-hidden="true">{entry.id.slice(-2)}</span>
            <p>
              <span className="ds-ledger-date">{entry.date}</span>{" "}
              <span className="ds-ledger-title">{entry.title}.</span>{" "}
              {entry.essence}
            </p>
          </li>
        ))}
      </ol>
      <p className="ds-footnote">
        Sourced from the brand-os process record. Only entries flagged for
        publishing appear here; the rest of the record stays private.
      </p>
    </section>
  );
}

function RecordChat() {
  const [available, setAvailable] = useState<boolean | null>(null);
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/design-system/chat")
      .then((r) => r.json())
      .then((d) => setAvailable(Boolean(d.available)))
      .catch(() => setAvailable(false));
  }, []);

  useEffect(() => {
    // Keep the newest line in view as answers arrive, without moving the page.
    logRef.current?.lastElementChild?.scrollIntoView({ block: "nearest" });
  }, [exchanges]);

  // While availability is unknown, render nothing to avoid a flash. Once it
  // is known to be off (no key configured), say so instead of disappearing.
  if (available === null) return null;
  if (available === false) {
    return (
      <div className="ds-chat">
        <form className="ds-chat-form" aria-disabled="true">
          <input type="text" disabled placeholder="Ask about the system, or how Alden thinks" aria-label="Ask the record a question" />
          <button type="submit" disabled>Ask</button>
        </form>
        <p className="ds-chat-note">The record answers questions once its key is configured.</p>
      </div>
    );
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const question = draft.trim();
    if (!question || busy) return;
    setDraft("");
    setBusy(true);
    setExchanges((prev) => [...prev, { question, answer: null }]);

    const history = exchanges
      .filter((e) => e.answer && !e.failed)
      .slice(-5)
      .flatMap((e) => [
        { role: "user", content: e.question },
        { role: "assistant", content: e.answer as string },
      ]);

    try {
      const res = await fetch("/api/design-system/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: [...history, { role: "user", content: question }] }),
      });
      const data = await res.json().catch(() => ({}));
      const reply: string =
        res.ok && typeof data.reply === "string"
          ? data.reply
          : (data.error ?? "The record is unavailable right now.");
      setExchanges((prev) =>
        prev.map((e, i) =>
          i === prev.length - 1 ? { ...e, answer: reply, failed: !res.ok } : e,
        ),
      );
    } catch {
      setExchanges((prev) =>
        prev.map((e, i) =>
          i === prev.length - 1
            ? { ...e, answer: "The record is unavailable right now.", failed: true }
            : e,
        ),
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="ds-chat">
      <form className="ds-chat-form" onSubmit={submit}>
        <input
          type="text"
          value={draft}
          maxLength={800}
          placeholder="Ask about the system, or how Alden thinks"
          aria-label="Ask the record a question"
          onChange={(e) => setDraft(e.target.value)}
        />
        <button type="submit" disabled={busy || draft.trim().length === 0}>
          Ask
        </button>
      </form>
      {exchanges.length > 0 && (
        <div className="ds-chat-log" ref={logRef} aria-live="polite">
          {exchanges.map((e, i) => (
            <div key={i} className="ds-exchange">
              <p className="ds-exchange-q">{e.question}</p>
              <p className={`ds-exchange-a${e.failed ? " ds-exchange-failed" : ""}`}>
                {e.answer ?? "Consulting the record…"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
