"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminDeleteUserButton({ userId, userName }: { userId: number; userName: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete ${userName}'s account? This removes their DSA progress and projects too. This can't be undone.`)) {
      return;
    }

    setPending(true);
    const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
    setPending(false);

    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json().catch(() => null);
      alert(data?.message || "Failed to delete user");
    }
  }

  return (
    <button className="admin-delete-btn" onClick={handleDelete} disabled={pending} aria-label={`Delete ${userName}`}>
      <Trash2 size={14} />
    </button>
  );
}
