import Link from "next/link";
import { Bell, Rocket, Search, Sparkles, User } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { NavLink } from "./NavLink";
import { SignOutButton } from "./SignOutButton";

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

      <nav className="nav" aria-label="Main Navigation">
        <NavLink href="/">Dashboard</NavLink>
        <NavLink href="/ai">
          <Sparkles size={15} /> AI Chat
        </NavLink>
        <NavLink href="/projects">Projects</NavLink>
        <NavLink href="/dsa">DSA</NavLink>
        <a href="#">Roadmap</a>
        <a href="#">Community</a>
      </nav>

      <div className="header-actions">
        <div className="search-box">
          <span className="search-icon">
            <Search size={15} />
          </span>
          <input type="text" placeholder="Search..." />
          <span className="shortcut">Ctrl + K</span>
        </div>

        <button className="notification-btn" aria-label="Notifications">
          <Bell size={16} />
        </button>

        {user ? (
          <SignOutButton />
        ) : (
          <Link className="profile-btn" href="/auth" aria-label="Sign in to EngineerOS">
            <span>Sign in</span>
            <User size={15} />
          </Link>
        )}
      </div>
    </header>
  );
}
