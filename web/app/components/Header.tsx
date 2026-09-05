import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { NavLink } from "./NavLink";
import { SignOutButton } from "./SignOutButton";

export async function Header() {
  const user = await getSessionUser();

  return (
    <header className="header">
      <div className="logo">
        <span className="logo-icon">🚀</span>
        <h1>
          Engineer<span className="accent">OS</span>
        </h1>
      </div>

      <nav className="nav" aria-label="Main Navigation">
        <NavLink href="/">Dashboard</NavLink>
        <NavLink href="/ai">🤖 AI Chat</NavLink>
        <NavLink href="/projects">Projects</NavLink>
        <NavLink href="/dsa">DSA</NavLink>
        <a href="#">Roadmap</a>
        <a href="#">Community</a>
      </nav>

      <div className="header-actions">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="Search..." />
          <span className="shortcut">Ctrl + K</span>
        </div>

        <button className="notification-btn" aria-label="Notifications">
          🔔
        </button>

        {user ? (
          <SignOutButton />
        ) : (
          <Link className="profile-btn" href="/auth" aria-label="Sign in to EngineerOS">
            <span>Sign in</span>
            <span>👤</span>
          </Link>
        )}
      </div>
    </header>
  );
}
