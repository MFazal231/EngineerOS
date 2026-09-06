import { Rocket } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { HeaderNav } from "./HeaderNav";

export async function Header() {
  const user = await getSessionUser();

  return (
    <header className="header">
      <div className="logo">
        <span className="logo-icon">
          <Rocket size={18} strokeWidth={2.25} />
        </span>
        <h1>
          Engineer<span className="accent">OS</span>
        </h1>
      </div>

      <HeaderNav userName={user?.name ?? null} />
    </header>
  );
}
