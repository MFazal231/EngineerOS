"use client";

import Link from "next/link";
import { useState } from "react";
import { Bell, Menu, Search, Sparkles, User, X } from "lucide-react";
import { NavLink } from "./NavLink";
import { SignOutButton } from "./SignOutButton";

export function HeaderNav({ userName }: { userName: string | null }) {
  const [open, setOpen] = useState(false);

  return (
    <>
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

        {userName ? (
          <SignOutButton />
        ) : (
          <Link className="profile-btn" href="/auth" aria-label="Sign in to EngineerOS">
            <span>Sign in</span>
            <User size={15} />
          </Link>
        )}
      </div>

      <button
        className="mobile-menu-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open && (
        <div className="mobile-menu">
          <div className="search-box">
            <span className="search-icon">
              <Search size={15} />
            </span>
            <input type="text" placeholder="Search..." />
          </div>

          <NavLink href="/" onClick={() => setOpen(false)}>
            Dashboard
          </NavLink>
          <NavLink href="/ai" onClick={() => setOpen(false)}>
            <Sparkles size={15} /> AI Chat
          </NavLink>
          <NavLink href="/projects" onClick={() => setOpen(false)}>
            Projects
          </NavLink>
          <NavLink href="/dsa" onClick={() => setOpen(false)}>
            DSA
          </NavLink>
          <a href="#">Roadmap</a>
          <a href="#">Community</a>

          <div className="mobile-menu-footer">
            {userName ? (
              <SignOutButton />
            ) : (
              <Link className="profile-btn" href="/auth" onClick={() => setOpen(false)}>
                <span>Sign in</span>
                <User size={15} />
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
