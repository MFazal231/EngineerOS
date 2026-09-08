import Link from "next/link";
import { Rocket } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { HeaderNav } from "./HeaderNav";
import { TimezoneReporter } from "./TimezoneReporter";

export async function Header() {
  const user = await getSessionUser();
  const account = user
    ? await prisma.user.findUnique({ where: { id: user.id }, select: { timezone: true } })
    : null;

  return (
    <header className="header">
      {user && <TimezoneReporter stored={account?.timezone ?? null} />}
      <Link href="/" className="logo">
        <span className="logo-icon">
          <Rocket size={18} strokeWidth={2.25} />
        </span>
        <h1>
          Engineer<span className="accent">OS</span>
        </h1>
      </Link>

      <HeaderNav userName={user?.name ?? null} />
    </header>
  );
}
