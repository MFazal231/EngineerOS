"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

type Mode = "login" | "register";

const VERIFY_ERROR_MESSAGES: Record<string, string> = {
  missing: "That verification link is missing its token.",
  expired: "That verification link is invalid or has expired — try registering again.",
};

export default function AuthPage() {
  return (
    <Suspense fallback={null}>
      <AuthPageContent />
    </Suspense>
  );
}

function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(() => {
    const verifyError = searchParams.get("verifyError");
    return verifyError ? VERIFY_ERROR_MESSAGES[verifyError] || "That verification link didn't work." : "";
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const isRegistering = mode === "register";

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");
    setIsSuccess(false);

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

      if (data.requiresVerification) {
        setMessage(data.message);
        setIsSuccess(true);
        return;
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
          <p className={`auth-message${message && !isSuccess ? " error" : ""}`} aria-live="polite">
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
