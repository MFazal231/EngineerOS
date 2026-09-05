"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Mode = "login" | "register";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const isRegistering = mode === "register";

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");

    const payload: Record<string, string> = { email, password };
    if (isRegistering) {
      payload.name = name;
    }

    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to complete this request");
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Something went wrong");
    }
  }

  return (
    <div className="auth-page">
      <main className="auth-shell">
        <Link className="auth-brand" href="/">
          🚀 Engineer<span>OS</span>
        </Link>

        <section className="auth-card" aria-labelledby="authTitle">
          <div className="auth-tabs" role="tablist" aria-label="Account actions">
            <button
              type="button"
              className={!isRegistering ? "active" : undefined}
              onClick={() => {
                setMode("login");
                setMessage("");
              }}
            >
              Sign in
            </button>
            <button
              type="button"
              className={isRegistering ? "active" : undefined}
              onClick={() => {
                setMode("register");
                setMessage("");
              }}
            >
              Create account
            </button>
          </div>

          <h1 id="authTitle">{isRegistering ? "Create your account" : "Welcome back"}</h1>
          <p>
            {isRegistering
              ? "Start keeping your EngineerOS progress in one place."
              : "Sign in to continue building your EngineerOS."}
          </p>
          <p className={`auth-message${message ? " error" : ""}`} aria-live="polite">
            {message}
          </p>

          <form onSubmit={handleSubmit}>
            {isRegistering && (
              <label>
                Name
                <input
                  type="text"
                  maxLength={100}
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
            )}

            <label>
              Email
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <label>
              Password
              <input
                type="password"
                minLength={8}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            <button className="auth-submit" type="submit">
              {isRegistering ? "Create account" : "Sign in"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
