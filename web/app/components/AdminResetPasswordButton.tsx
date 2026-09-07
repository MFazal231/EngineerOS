"use client";

import { KeyRound } from "lucide-react";
import { useState } from "react";

export function AdminResetPasswordButton({ userId, userName }: { userId: number; userName: string }) {
  const [pending, setPending] = useState(false);
  const [temp, setTemp] = useState<string | null>(null);

  async function handleReset() {
    if (!confirm(`Reset ${userName}'s password? Their current one stops working immediately.`)) {
      return;
    }

    setPending(true);
    const res = await fetch(`/api/admin/users/${userId}/reset-password`, { method: "POST" });
    const data = await res.json().catch(() => null);
    setPending(false);

    if (res.ok && data?.tempPassword) {
      setTemp(data.tempPassword);
    } else {
      alert(data?.message || "Failed to reset password");
    }
  }

  if (temp) {
    return (
      <span className="admin-temp-password" title="Send this to them, then it's gone from here">
        <code>{temp}</code>
        <button onClick={() => setTemp(null)} aria-label="Dismiss temporary password">
          done
        </button>
      </span>
    );
  }

  return (
    <button
      className="admin-reset-btn"
      onClick={handleReset}
      disabled={pending}
      aria-label={`Reset password for ${userName}`}
      title="Generate a temporary password"
    >
      <KeyRound size={14} />
    </button>
  );
}
