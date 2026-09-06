"use client";

import { User } from "lucide-react";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <button
      type="button"
      className="profile-btn"
      onClick={handleSignOut}
      aria-label="Sign out of EngineerOS"
    >
      <span>Sign out</span>
      <User size={15} />
    </button>
  );
}
