export type RoadmapStep = {
  /** Stable within its roadmap — it's half the key progress is stored under. */
  id: string;
  title: string;
  detail: string;
};

export type RoadmapStage = {
  title: string;
  summary: string;
  steps: RoadmapStep[];
};

export type Roadmap = {
  slug: string;
  title: string;
  tagline: string;
  /** Extra words the search should match, beyond the title and tagline. */
  keywords: string[];
  accent: "orange" | "blue" | "purple" | "green";
  stages: RoadmapStage[];
};

export const ROADMAPS: Roadmap[] = [
  {
    slug: "web3",
    title: "Web3 & Blockchain",
    tagline: "From how a blockchain works to shipping and auditing your own contracts.",
    keywords: ["blockchain", "solidity", "ethereum", "smart contracts", "crypto", "defi", "nft", "evm", "dapp"],
    accent: "purple",
    stages: [
      {
        title: "Understand the chain",
        summary: "Know what you're building on before you build on it.",
        steps: [
          { id: "web3-basics-1", title: "Learn how a blockchain actually stores state", detail: "Blocks, hashes, and why tampering with an old block invalidates every one after it." },
          { id: "web3-basics-2", title: "Understand consensus", detail: "Proof of work versus proof of stake, and what each costs in speed, money, and energy." },
          { id: "web3-basics-3", title: "Set up a wallet and send a testnet transaction", detail: "Install MetaMask, get testnet ETH from a faucet, and send it somewhere. Watch it confirm on a block explorer." },
          { id: "web3-basics-4", title: "Read a real transaction on Etherscan", detail: "Pick any transaction and identify the sender, gas paid, and what the contract call did." },
        ],
      },
      {
        title: "Solidity fundamentals",
        summary: "The language almost every EVM chain runs.",
        steps: [
          { id: "web3-sol-1", title: "Write and deploy a Hello World contract", detail: "Use Remix. Store a string, read it back, change it. Understand why changing it costs gas and reading doesn't." },
          { id: "web3-sol-2", title: "Learn Solidity types and storage", detail: "Mappings, structs, arrays, and the difference between storage, memory, and calldata." },
          { id: "web3-sol-3", title: "Understand msg.sender and access control", detail: "Write an owner-only function and learn why forgetting this check is one of the most common exploits." },
          { id: "web3-sol-4", title: "Emit and consume events", detail: "Events are how off-chain apps learn what happened on-chain. Emit one and read it from a script." },
        ],
      },
      {
        title: "Build something real",
        summary: "Contracts nobody can call aren't worth much.",
        steps: [
          { id: "web3-build-1", title: "Deploy an ERC-20 token to a testnet", detail: "Use OpenZeppelin's implementation rather than writing your own. Mint some, send some." },
          { id: "web3-build-2", title: "Deploy an ERC-721 NFT collection", detail: "Mint a token with real metadata hosted on IPFS, and see it appear in a wallet." },
          { id: "web3-build-3", title: "Move to Hardhat or Foundry", detail: "Remix stops scaling fast. Get a local dev chain, a deploy script, and a repeatable workflow." },
          { id: "web3-build-4", title: "Write tests for your contracts", detail: "Money is at stake and deploys are irreversible — untested contracts are genuinely dangerous." },
        ],
      },
      {
        title: "Connect a frontend",
        summary: "The part users actually touch.",
        steps: [
          { id: "web3-fe-1", title: "Connect a wallet from a web app", detail: "Use wagmi or ethers.js to request accounts and show the connected address." },
          { id: "web3-fe-2", title: "Read contract state in the UI", detail: "Display a balance or stored value pulled straight from the chain." },
          { id: "web3-fe-3", title: "Send a transaction from the UI", detail: "Handle the three states people forget: pending, confirmed, and rejected by the user." },
          { id: "web3-fe-4", title: "Handle chain switching", detail: "Detect when someone is on the wrong network and prompt them to switch." },
        ],
      },
      {
        title: "Security and going live",
        summary: "Where web3 differs most from normal development.",
        steps: [
          { id: "web3-sec-1", title: "Study reentrancy", detail: "Understand the DAO hack and why checks-effects-interactions ordering exists." },
          { id: "web3-sec-2", title: "Learn common vulnerability classes", detail: "Integer issues, unchecked external calls, oracle manipulation, and access control gaps." },
          { id: "web3-sec-3", title: "Run a security tool over your code", detail: "Slither or Mythril will find things you won't." },
          { id: "web3-sec-4", title: "Deploy to mainnet, carefully", detail: "Verify the source on Etherscan and understand that a bug here costs real money permanently." },
        ],
      },
    ],
  },
  {
    slug: "frontend",
    title: "Frontend Engineering",
    tagline: "HTML through to a production React app people actually use.",
    keywords: ["react", "javascript", "css", "html", "typescript", "nextjs", "ui", "web", "browser"],
    accent: "blue",
    stages: [
      {
        title: "The platform",
        summary: "Frameworks change; the browser doesn't.",
        steps: [
          { id: "fe-plat-1", title: "Write semantic HTML", detail: "Know when to use a button versus a div, and what that choice does for keyboard and screen reader users." },
          { id: "fe-plat-2", title: "Learn CSS layout properly", detail: "Flexbox and grid, and the box model underneath both." },
          { id: "fe-plat-3", title: "Make a page responsive", detail: "Media queries and relative units. Build one layout that genuinely works on a phone." },
          { id: "fe-plat-4", title: "Understand the DOM and events", detail: "Query elements, listen for events, and know what event bubbling means before a framework hides it." },
        ],
      },
      {
        title: "JavaScript in depth",
        summary: "The parts that bite people later.",
        steps: [
          { id: "fe-js-1", title: "Learn modern syntax", detail: "Destructuring, spread, modules, and arrow functions — plus how `this` differs inside them." },
          { id: "fe-js-2", title: "Understand async JavaScript", detail: "The event loop, promises, and async/await. Know why a slow loop freezes the whole page." },
          { id: "fe-js-3", title: "Fetch and render real data", detail: "Call a public API, handle the loading state, and handle the error state — not just the happy path." },
          { id: "fe-js-4", title: "Add TypeScript", detail: "Type your functions and props. Feel the difference when you rename something." },
        ],
      },
      {
        title: "React",
        summary: "Components, state, and the rules around them.",
        steps: [
          { id: "fe-react-1", title: "Build components with props and state", detail: "useState, and why you never mutate state directly." },
          { id: "fe-react-2", title: "Learn useEffect and when not to use it", detail: "Most effects people write shouldn't be effects. Learn to spot those." },
          { id: "fe-react-3", title: "Handle forms and validation", detail: "Controlled inputs, submission, and showing errors people can act on." },
          { id: "fe-react-4", title: "Add routing and data fetching", detail: "Multiple pages, shared layout, and loading data per route." },
        ],
      },
      {
        title: "Ship it",
        summary: "Working locally is not the same as working.",
        steps: [
          { id: "fe-ship-1", title: "Build with Next.js", detail: "Learn what server components render where, and why that matters for speed." },
          { id: "fe-ship-2", title: "Deploy to a real URL", detail: "Vercel or Netlify. Get it in front of someone who isn't you." },
          { id: "fe-ship-3", title: "Check accessibility", detail: "Navigate your app with only a keyboard. Fix what you can't reach." },
          { id: "fe-ship-4", title: "Measure performance", detail: "Run Lighthouse, then actually fix the two worst things it finds." },
        ],
      },
    ],
  },
  {
    slug: "backend",
    title: "Backend Engineering",
    tagline: "APIs, databases, and the things that break at 3am.",
    keywords: ["api", "node", "server", "database", "sql", "rest", "postgres", "auth", "backend"],
    accent: "green",
    stages: [
      {
        title: "Serve a request",
        summary: "Start with the fundamentals of HTTP.",
        steps: [
          { id: "be-http-1", title: "Understand HTTP properly", detail: "Methods, status codes, headers, and what makes a request idempotent." },
          { id: "be-http-2", title: "Build a REST API", detail: "Express, Fastify, or Next route handlers. Full CRUD over one resource." },
          { id: "be-http-3", title: "Validate every input", detail: "Never trust the client. Reject bad data at the boundary with clear errors." },
          { id: "be-http-4", title: "Handle errors consistently", detail: "One error shape across the whole API, and never leak stack traces to users." },
        ],
      },
      {
        title: "Data",
        summary: "Where most real complexity lives.",
        steps: [
          { id: "be-db-1", title: "Learn SQL", detail: "Selects, joins, grouping, and why a query without an index gets slow as data grows." },
          { id: "be-db-2", title: "Design a schema", detail: "Normalisation, foreign keys, and choosing what to enforce in the database itself." },
          { id: "be-db-3", title: "Use an ORM and understand migrations", detail: "Prisma or Drizzle. Know how a schema change reaches production safely." },
          { id: "be-db-4", title: "Learn transactions", detail: "When several writes must all succeed or all fail together." },
        ],
      },
      {
        title: "Auth and security",
        summary: "The part you cannot get wrong.",
        steps: [
          { id: "be-auth-1", title: "Hash passwords correctly", detail: "bcrypt or argon2, never plain text, never a fast general-purpose hash." },
          { id: "be-auth-2", title: "Implement sessions", detail: "JWTs or server sessions, stored in httpOnly cookies. Understand the tradeoffs." },
          { id: "be-auth-3", title: "Add authorisation", detail: "Authentication is who you are; authorisation is what you may touch. Check ownership on every route." },
          { id: "be-auth-4", title: "Learn the common attacks", detail: "SQL injection, XSS, CSRF — and what actually defends against each." },
        ],
      },
      {
        title: "Production",
        summary: "Running it, not just writing it.",
        steps: [
          { id: "be-prod-1", title: "Add logging and error tracking", detail: "You need to find out something broke without a user telling you." },
          { id: "be-prod-2", title: "Rate limit your endpoints", detail: "Especially anything that costs money per call." },
          { id: "be-prod-3", title: "Write tests for your API", detail: "Cover auth failures and validation, not just the successful path." },
          { id: "be-prod-4", title: "Deploy with a real database", detail: "Managed Postgres, migrations that run on deploy, secrets kept out of git." },
        ],
      },
    ],
  },
  {
    slug: "devops",
    title: "DevOps & Deployment",
    tagline: "Getting code from your machine to production, repeatably.",
    keywords: ["docker", "ci", "cd", "kubernetes", "aws", "cloud", "linux", "deployment", "infrastructure"],
    accent: "orange",
    stages: [
      {
        title: "Command line and Git",
        summary: "Everything else assumes these.",
        steps: [
          { id: "ops-cli-1", title: "Get comfortable in a Linux shell", detail: "Navigating, permissions, processes, and reading logs." },
          { id: "ops-cli-2", title: "Learn Git beyond commit and push", detail: "Branching, rebasing, resolving conflicts, and recovering from mistakes." },
          { id: "ops-cli-3", title: "Write a shell script", detail: "Automate something you currently do by hand more than once a week." },
        ],
      },
      {
        title: "Containers",
        summary: "Making it run the same everywhere.",
        steps: [
          { id: "ops-docker-1", title: "Containerise an app", detail: "Write a Dockerfile, build it, run it, and understand what a layer is." },
          { id: "ops-docker-2", title: "Use docker compose", detail: "Run your app and its database together with one command." },
          { id: "ops-docker-3", title: "Shrink your image", detail: "Multi-stage builds. Know why a 1GB image is a problem." },
        ],
      },
      {
        title: "Automation",
        summary: "Deploys shouldn't depend on remembering steps.",
        steps: [
          { id: "ops-ci-1", title: "Set up CI", detail: "GitHub Actions running your tests and linter on every push." },
          { id: "ops-ci-2", title: "Automate deployment", detail: "Merging to main should deploy, without you re-pointing anything by hand." },
          { id: "ops-ci-3", title: "Manage secrets properly", detail: "Environment variables in the platform, never committed to the repo." },
        ],
      },
      {
        title: "Running it",
        summary: "Knowing when something is wrong.",
        steps: [
          { id: "ops-run-1", title: "Add monitoring and alerts", detail: "Uptime checks and error tracking that reach you before your users do." },
          { id: "ops-run-2", title: "Centralise your logs", detail: "Searchable logs beat SSHing into a box and grepping." },
          { id: "ops-run-3", title: "Practise a rollback", detail: "Deliberately deploy something broken and revert it. Do this before you need to." },
        ],
      },
    ],
  },
  {
    slug: "ai-engineering",
    title: "AI Engineering",
    tagline: "Building real products on top of language models.",
    keywords: ["ai", "llm", "machine learning", "ml", "python", "rag", "prompt", "openai", "embeddings", "agents"],
    accent: "purple",
    stages: [
      {
        title: "Foundations",
        summary: "Enough to reason about what these models do.",
        steps: [
          { id: "ai-found-1", title: "Learn Python well enough to build", detail: "Data structures, packages, virtual environments, and reading someone else's code." },
          { id: "ai-found-2", title: "Understand tokens and context windows", detail: "Why cost and limits are measured in tokens, and what happens when you exceed them." },
          { id: "ai-found-3", title: "Know what a model can and cannot do", detail: "Hallucination, knowledge cutoffs, and why grounding in real data matters." },
        ],
      },
      {
        title: "Working with APIs",
        summary: "Most AI engineering is calling models well.",
        steps: [
          { id: "ai-api-1", title: "Call a model API from your own code", detail: "Handle the response, the errors, and the rate limits." },
          { id: "ai-api-2", title: "Learn practical prompting", detail: "System prompts, few-shot examples, and constraining output to a format you can parse." },
          { id: "ai-api-3", title: "Get structured output", detail: "Make a model return JSON your code can rely on, and validate it before you trust it." },
          { id: "ai-api-4", title: "Handle failure gracefully", detail: "Every model call can fail or be rate limited. Decide what your product does when it does." },
        ],
      },
      {
        title: "Grounding in real data",
        summary: "Where most of the actual value is.",
        steps: [
          { id: "ai-rag-1", title: "Understand embeddings", detail: "How text becomes vectors and what similarity between them means." },
          { id: "ai-rag-2", title: "Build a RAG pipeline", detail: "Chunk documents, embed them, retrieve the relevant ones, and answer from those." },
          { id: "ai-rag-3", title: "Use a vector database", detail: "pgvector, Pinecone, or similar — and know when a plain database is enough." },
          { id: "ai-rag-4", title: "Evaluate your outputs", detail: "Build a small test set. Vibes are not a quality metric." },
        ],
      },
      {
        title: "Shipping AI features",
        summary: "Production concerns unique to this work.",
        steps: [
          { id: "ai-ship-1", title: "Control cost", detail: "Track spend per user, cache what repeats, and use smaller models where they suffice." },
          { id: "ai-ship-2", title: "Design for latency", detail: "Stream responses so people see progress rather than a spinner." },
          { id: "ai-ship-3", title: "Build tool use or agents", detail: "Let a model call your functions, and constrain what it's allowed to do." },
          { id: "ai-ship-4", title: "Think about safety and abuse", detail: "Prompt injection is real, especially anywhere untrusted text reaches the model." },
        ],
      },
    ],
  },
  {
    slug: "mobile",
    title: "Mobile Development",
    tagline: "Shipping an app to a real phone, and then to a store.",
    keywords: ["react native", "ios", "android", "expo", "flutter", "app", "mobile"],
    accent: "blue",
    stages: [
      {
        title: "Get running on a device",
        summary: "The loop that makes everything else possible.",
        steps: [
          { id: "mob-start-1", title: "Set up React Native with Expo", detail: "Get a project running on your own phone, not just a simulator." },
          { id: "mob-start-2", title: "Learn mobile layout", detail: "Flexbox again, but with safe areas, notches, and wildly different screen sizes." },
          { id: "mob-start-3", title: "Add navigation", detail: "Stacks and tabs, and handling the Android back button correctly." },
        ],
      },
      {
        title: "Real app behaviour",
        summary: "What separates a demo from an app.",
        steps: [
          { id: "mob-real-1", title: "Store data on the device", detail: "AsyncStorage or SQLite, and deciding what belongs locally versus on a server." },
          { id: "mob-real-2", title: "Talk to an API", detail: "Including what your app does with no connection at all." },
          { id: "mob-real-3", title: "Use a native capability", detail: "Camera, location, or notifications — and request permission the right way." },
          { id: "mob-real-4", title: "Handle app state changes", detail: "Backgrounding, resuming, and not losing what someone typed." },
        ],
      },
      {
        title: "Release",
        summary: "The part that surprises people.",
        steps: [
          { id: "mob-rel-1", title: "Build a production binary", detail: "EAS Build or native tooling. Signing certificates will take longer than you expect." },
          { id: "mob-rel-2", title: "Test on real devices", detail: "TestFlight or Play internal testing, with people who aren't you." },
          { id: "mob-rel-3", title: "Submit to a store", detail: "Review guidelines, screenshots, privacy disclosures, and planning for rejection." },
        ],
      },
    ],
  },
  {
    slug: "system-design",
    title: "System Design",
    tagline: "Designing things that stay up as they grow.",
    keywords: ["scalability", "architecture", "caching", "distributed", "interview", "load balancing", "queues"],
    accent: "orange",
    stages: [
      {
        title: "Building blocks",
        summary: "The pieces every design is assembled from.",
        steps: [
          { id: "sd-blocks-1", title: "Understand latency numbers", detail: "Memory versus disk versus network. Know roughly what each costs." },
          { id: "sd-blocks-2", title: "Learn caching", detail: "What to cache, where, and the hard part — how it gets invalidated." },
          { id: "sd-blocks-3", title: "Learn load balancing", detail: "Distributing traffic, health checks, and what happens to sessions." },
          { id: "sd-blocks-4", title: "Understand queues", detail: "Decoupling slow work from a request, and what happens when a job fails." },
        ],
      },
      {
        title: "Data at scale",
        summary: "Where designs usually break first.",
        steps: [
          { id: "sd-data-1", title: "Learn replication and sharding", detail: "Read replicas, partitioning, and what each makes harder." },
          { id: "sd-data-2", title: "Understand CAP in practice", detail: "What you actually give up during a network partition." },
          { id: "sd-data-3", title: "Know when SQL isn't the answer", detail: "And, more often, when it still is." },
        ],
      },
      {
        title: "Design practice",
        summary: "The skill is in the tradeoffs, not the diagram.",
        steps: [
          { id: "sd-prac-1", title: "Design a URL shortener", detail: "The classic starting point: hashing, storage, and read-heavy traffic." },
          { id: "sd-prac-2", title: "Design a news feed", detail: "Fan-out on write versus read, and why celebrities break the simple answer." },
          { id: "sd-prac-3", title: "Design a chat system", detail: "Real-time delivery, presence, and message ordering." },
          { id: "sd-prac-4", title: "Practise explaining your reasoning aloud", detail: "In an interview the tradeoffs you name matter more than the boxes you draw." },
        ],
      },
    ],
  },
  {
    slug: "cybersecurity",
    title: "Cybersecurity",
    tagline: "Finding and fixing the holes before someone else does.",
    keywords: ["security", "hacking", "pentest", "ctf", "owasp", "networking", "infosec", "vulnerability"],
    accent: "green",
    stages: [
      {
        title: "Groundwork",
        summary: "You can't secure what you don't understand.",
        steps: [
          { id: "sec-base-1", title: "Learn networking fundamentals", detail: "TCP/IP, DNS, HTTP, and TLS — what actually happens when a request leaves your machine." },
          { id: "sec-base-2", title: "Get comfortable with Linux", detail: "Permissions, users, processes, and where the logs live." },
          { id: "sec-base-3", title: "Understand cryptography basics", detail: "Hashing versus encryption, symmetric versus public key, and why you never roll your own." },
        ],
      },
      {
        title: "Web security",
        summary: "Where most real-world attacks land.",
        steps: [
          { id: "sec-web-1", title: "Work through the OWASP Top 10", detail: "Understand each class of flaw and what genuinely prevents it." },
          { id: "sec-web-2", title: "Exploit a deliberately vulnerable app", detail: "Juice Shop or DVWA. Breaking something teaches faster than reading about it." },
          { id: "sec-web-3", title: "Learn to use Burp Suite", detail: "Intercept, modify, and replay requests to see what a server really accepts." },
          { id: "sec-web-4", title: "Secure your own app", detail: "Turn the attacks back on something you built and fix what you find." },
        ],
      },
      {
        title: "Going deeper",
        summary: "Building real, demonstrable skill.",
        steps: [
          { id: "sec-deep-1", title: "Play CTFs regularly", detail: "TryHackMe or HackTheBox. Consistency matters more than difficulty." },
          { id: "sec-deep-2", title: "Learn a scripting language for tooling", detail: "Python, for automating the boring parts of recon and testing." },
          { id: "sec-deep-3", title: "Write up what you find", detail: "Clear reporting is most of the job, and it's what employers can actually assess." },
        ],
      },
    ],
  },
];

export const ROADMAP_BY_SLUG: Record<string, Roadmap> = Object.fromEntries(
  ROADMAPS.map((roadmap) => [roadmap.slug, roadmap]),
);

export function countSteps(roadmap: Roadmap): number {
  return roadmap.stages.reduce((total, stage) => total + stage.steps.length, 0);
}

/**
 * Matches on title, tagline, keywords, and stage/step titles, so searching
 * "solidity" finds the Web3 map even though that word isn't in its name.
 */
export function searchRoadmaps(query: string): Roadmap[] {
  const term = query.trim().toLowerCase();
  if (!term) return ROADMAPS;

  return ROADMAPS.filter((roadmap) => {
    const haystack = [
      roadmap.title,
      roadmap.tagline,
      ...roadmap.keywords,
      ...roadmap.stages.flatMap((stage) => [stage.title, ...stage.steps.map((step) => step.title)]),
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(term);
  });
}
