import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { AIChat } from "@/app/components/AIChat";

export default async function AIPage() {
  const user = await getSessionUser();

  if (!user) {
    return (
      <main className="main">
        <section className="dsa-hero">
          <div className="container">
            <div className="dsa-header">
              <div>
                <p className="section-label">AI ENGINEER</p>
                <h2>Chat</h2>
                <p>
                  <Link href="/auth" style={{ color: "var(--primary)", fontWeight: 700 }}>
                    Sign in
                  </Link>{" "}
                  to ask the AI Engineer about your progress.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="main">
      <section className="dsa-hero">
        <div className="container">
          <div className="dsa-header">
            <div>
              <p className="section-label">AI ENGINEER</p>
              <h2>Chat</h2>
              <p>Ask about your real DSA and project progress — grounded in your actual data, not guesses.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="dsa-section">
        <div className="container">
          <AIChat />
        </div>
      </section>
    </main>
  );
}
