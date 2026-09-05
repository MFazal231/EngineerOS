# EngineerOS Roadmap — Path to v1.0 Launch

Goal: a paid product students can afford, built around the Learn → Practice → Build → Progress → Next Action loop. Every phase below is judged against that loop — if a task doesn't strengthen it, it's cut or deferred.

Tech stack target: **Next.js (React + TypeScript) full-stack**, Prisma + PostgreSQL, deployed on Vercel. Replaces the current split of vanilla HTML/CSS/JS frontend + standalone Express backend with one codebase and one deploy.

Ongoing, in parallel with every phase below: **validate willingness to pay.** Talk to real students as soon as there's anything to show, not only after the roadmap is "done." A phase can ship before it's polished if it gets you a real answer sooner.

---

## Phase 0 — Stack migration foundation
Get to a working Next.js app with feature parity for what already exists, nothing new yet.

- Scaffold Next.js (App Router) + TypeScript project
- Prisma schema mirroring current Postgres tables (`users`, `dsa_topics`, `dsa_problem_progress`) — reuse the schema, don't redesign it
- Port auth: register/login/JWT logic → NextAuth (credentials provider) or a ported version of the existing bcrypt+JWT flow, but move sessions to httpOnly cookies instead of localStorage
- Port DSA pages (topics, problems, filters, progress, continue-practicing) into React components, calling Next.js API routes instead of the old Express routes
- Port Projects module (cards, tasks, progress) into React — and move it onto Postgres via API routes instead of localStorage (this was the biggest gap found in the current build: Projects data doesn't survive a browser change today)
- Deploy pipeline: Vercel (app) + a hosted Postgres (Neon/Railway) for staging

**Done when:** everything that works today in the vanilla-JS version also works in Next.js, backed by a real database, deployed at a real URL.

## Phase 1 — Dashboard becomes real
- Replace the static dashboard numbers ("15 problems", "18h") with real aggregate queries across DSA progress + Projects
- "Today's Mission" pulls from actual incomplete tasks/problems instead of hardcoded copy

**Done when:** the dashboard reflects a signed-in user's actual data, not placeholder content.

## Phase 2 — Monetization infrastructure
- Add `plan` / `subscription_status` to the `users` table
- Stripe Checkout + webhook to flip plan status on payment
- Simple pricing page: one affordable paid tier, one free tier
- Decide the free/paid split (recommendation: DSA + basic Projects stay free to hook users; AI Engineer + unlimited projects + advanced roadmap sit behind the paid tier)

**Done when:** a real credit card can be charged and it actually gates a feature.

## Phase 3 — AI Engineer (the differentiator)
- One endpoint: reads a user's DSA progress + Projects/tasks from Postgres, sends it to the OpenAI API, returns a "what to work on next, and why" recommendation
- One dashboard widget surfacing that recommendation
- Gate behind the paid plan (or a limited number of free uses, per the freemium plan)

**Done when:** a logged-in user can ask "what should I do today?" and get an answer grounded in their real data — this is the thing nothing else on the market does for this audience.

## Phase 4 — Roadmap module
- A small fixed set of skill categories (JS, React, Node, Databases, etc.)
- Progress per category derived from DSA topics completed + tech tags on Projects — not manually entered
- Simple skill-bar UI per stated goal (e.g. "Full-Stack Developer")

**Done when:** the roadmap page (currently a dead `#` link on every page) shows real, derived progress.

## Phase 5 — Launch prep
- Landing/pricing page, signup flow
- Minimal analytics (signups, conversion, activation)
- Direct outreach to the students/early-career devs who gave willingness-to-pay signal during the parallel validation track

**Done when:** a stranger can land on the site, sign up, and pay, without you doing anything manually.

## Phase 6 — Post-launch (defer until there are paying users)
- Milestones/Activity feed for Projects
- GitHub and LeetCode integration
- Roadmap-aware AI reasoning ("am I ready for a frontend internship?")

---

### Explicitly not doing right now
Course marketplace, social features, a bigger problem database than the 3 current DSA topics, project-management-clone features, AI coding IDE. (Unchanged from the original product spec — still not the point of EngineerOS.)
