"use client";

import { MessageSquarePlus, X } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

export function FeedbackWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!message.trim() || status === "sending") return;

    setStatus("sending");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, page: pathname }),
      });

      if (!res.ok) throw new Error("failed");

      setStatus("sent");
      setMessage("");
      setTimeout(() => {
        setOpen(false);
        setStatus("idle");
      }, 1600);
    } catch {
      setStatus("error");
    }
  }

  if (!open) {
    return (
      <button className="feedback-fab" onClick={() => setOpen(true)} aria-label="Send feedback">
        <MessageSquarePlus size={18} />
      </button>
    );
  }

  return (
    <div className="feedback-panel">
      <div className="feedback-panel-header">
        <strong>Send feedback</strong>
        <button onClick={() => setOpen(false)} aria-label="Close feedback">
          <X size={16} />
        </button>
      </div>

      {status === "sent" ? (
        <p className="feedback-thanks">Thanks — that really helps.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <textarea
            autoFocus
            rows={4}
            maxLength={2000}
            placeholder="What's confusing, broken, or missing?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          {status === "error" && <p className="feedback-error">Couldn&apos;t send that — try again.</p>}
          <button type="submit" className="feedback-submit" disabled={!message.trim() || status === "sending"}>
            {status === "sending" ? "Sending…" : "Send"}
          </button>
        </form>
      )}
    </div>
  );
}
