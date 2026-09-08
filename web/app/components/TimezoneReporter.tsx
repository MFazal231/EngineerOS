"use client";

import { useEffect } from "react";

/**
 * Reports the browser's IANA timezone once per session so time-of-day
 * insights reflect when the user actually worked rather than where the
 * server happens to run. Silent by design — nothing about this needs to
 * be visible or interrupt anyone.
 */
export function TimezoneReporter({ stored }: { stored: string | null }) {
  useEffect(() => {
    let timezone: string;

    try {
      timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      return;
    }

    if (!timezone || timezone === stored) return;

    fetch("/api/me/timezone", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ timezone }),
    }).catch(() => {
      // Best effort. A missed report just means insights fall back to UTC.
    });
  }, [stored]);

  return null;
}
