export type Resource = {
  label: string;
  url: string;
  /** Why this one, in a few words — "free", "official docs", and so on. */
  note: string;
};

export type Certification = {
  name: string;
  provider: string;
  url: string;
  note: string;
};

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
  /** Where to actually learn this stage, rather than just being told to. */
  resources: Resource[];
};

export type Roadmap = {
  slug: string;
  title: string;
  tagline: string;
  /** Extra words the search should match, beyond the title and tagline. */
  keywords: string[];
  accent: "orange" | "blue" | "purple" | "green";
  /**
   * Honest note on credentials for this path. Several of these fields are
   * deliberately empty — pretending a recognised certification exists where
   * it doesn't would be worse than saying so.
   */
  certifications: Certification[];
  certificationNote: string;
  stages: RoadmapStage[];
};

export const ROADMAPS: Roadmap[] = [
  {
    slug: "web3",
    title: "Web3 & Blockchain",
    tagline: "From how a blockchain works to shipping and auditing your own contracts.",
    keywords: ["blockchain", "solidity", "ethereum", "smart contracts", "crypto", "defi", "nft", "evm", "dapp"],
    accent: "purple",
    certificationNote:
      "There is no widely recognised web3 certification. Hiring here runs on deployed contracts, audit findings and public repos — a verified contract on a block explorer is worth more than any certificate.",
    certifications: [],
    stages: [
      {
        title: "Understand the chain",
        summary: "Know what you're building on before you build on it.",
        resources: [
          { label: "Ethereum developer docs", url: "https://ethereum.org/en/developers/docs/", note: "Official, free, start here" },
          { label: "Etherscan", url: "https://etherscan.io/", note: "Read real transactions" },
        ],
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
        resources: [
          { label: "Solidity documentation", url: "https://docs.soliditylang.org/", note: "The language reference" },
          { label: "CryptoZombies", url: "https://cryptozombies.io/", note: "Free interactive intro" },
          { label: "Remix IDE", url: "https://remix.ethereum.org/", note: "Write and deploy in the browser" },
        ],
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
        resources: [
          { label: "OpenZeppelin Contracts", url: "https://docs.openzeppelin.com/contracts", note: "Audited standard implementations" },
          { label: "Foundry Book", url: "https://book.getfoundry.sh/", note: "Modern toolchain and testing" },
        ],
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
        resources: [
          { label: "wagmi", url: "https://wagmi.sh/", note: "React hooks for Ethereum" },
          { label: "ethers.js docs", url: "https://docs.ethers.org/", note: "The underlying library" },
        ],
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
        resources: [
          { label: "Ethernaut", url: "https://ethernaut.openzeppelin.com/", note: "Free hacking wargame" },
          { label: "Smart Contract Weakness Registry", url: "https://swcregistry.io/", note: "Catalogue of known flaws" },
        ],
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
    certificationNote:
      "Frontend hiring runs almost entirely on portfolio and interview. freeCodeCamp's certifications are free and worth doing for the structure, but treat the deployed projects you build along the way as the real output.",
    certifications: [
      { name: "Responsive Web Design", provider: "freeCodeCamp", url: "https://www.freecodecamp.org/learn/", note: "Free, project-based" },
      { name: "JavaScript Algorithms and Data Structures", provider: "freeCodeCamp", url: "https://www.freecodecamp.org/learn/", note: "Free, pairs well with the DSA module" },
    ],
    stages: [
      {
        title: "The platform",
        summary: "Frameworks change; the browser doesn't.",
        resources: [
          { label: "MDN Web Docs", url: "https://developer.mozilla.org/en-US/docs/Web", note: "The reference for everything browser" },
          { label: "web.dev Learn CSS", url: "https://web.dev/learn/css/", note: "Free structured CSS course" },
        ],
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
        resources: [
          { label: "javascript.info", url: "https://javascript.info/", note: "Free, thorough, well written" },
          { label: "TypeScript Handbook", url: "https://www.typescriptlang.org/docs/handbook/intro.html", note: "Official intro" },
        ],
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
        resources: [
          { label: "react.dev Learn", url: "https://react.dev/learn", note: "Official tutorial, genuinely good" },
          { label: "You Might Not Need an Effect", url: "https://react.dev/learn/you-might-not-need-an-effect", note: "Read before writing useEffect" },
        ],
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
        resources: [
          { label: "Next.js docs", url: "https://nextjs.org/docs", note: "Official, includes deployment" },
          { label: "Lighthouse docs", url: "https://developer.chrome.com/docs/lighthouse/overview", note: "Measure what you shipped" },
        ],
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
    certificationNote:
      "No certification carries backend hiring on its own. The cloud certifications below are the exception — they're recognised because they prove you understand where your code actually runs.",
    certifications: [
      { name: "AWS Certified Developer – Associate", provider: "Amazon", url: "https://aws.amazon.com/certification/", note: "Widely recognised, paid exam" },
      { name: "Back End Development and APIs", provider: "freeCodeCamp", url: "https://www.freecodecamp.org/learn/", note: "Free, project-based" },
    ],
    stages: [
      {
        title: "Serve a request",
        summary: "Start with the fundamentals of HTTP.",
        resources: [
          { label: "MDN HTTP guide", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP", note: "Methods, status codes, headers" },
          { label: "Express docs", url: "https://expressjs.com/", note: "Still the clearest starting framework" },
        ],
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
        resources: [
          { label: "PostgreSQL Tutorial", url: "https://www.postgresqltutorial.com/", note: "Practical SQL from scratch" },
          { label: "Prisma docs", url: "https://www.prisma.io/docs", note: "Schema, migrations, queries" },
          { label: "Use The Index, Luke", url: "https://use-the-index-luke.com/", note: "Free, on why queries get slow" },
        ],
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
        resources: [
          { label: "OWASP Top 10", url: "https://owasp.org/www-project-top-ten/", note: "The canonical list of what goes wrong" },
          { label: "OWASP Cheat Sheet Series", url: "https://cheatsheetseries.owasp.org/", note: "Practical defences per topic" },
        ],
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
        resources: [
          { label: "Twelve-Factor App", url: "https://12factor.net/", note: "Short, still the standard checklist" },
          { label: "Sentry docs", url: "https://docs.sentry.io/", note: "Error tracking, free tier" },
        ],
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
    certificationNote:
      "This is the one path where certifications genuinely move hiring. Cloud and Kubernetes credentials are vendor-verified and widely asked for.",
    certifications: [
      { name: "AWS Certified Solutions Architect – Associate", provider: "Amazon", url: "https://aws.amazon.com/certification/", note: "The most recognised cloud cert" },
      { name: "Certified Kubernetes Administrator (CKA)", provider: "Linux Foundation / CNCF", url: "https://www.cncf.io/training/certification/cka/", note: "Hands-on exam, well respected" },
    ],
    stages: [
      {
        title: "Command line and Git",
        summary: "Everything else assumes these.",
        resources: [
          { label: "Pro Git book", url: "https://git-scm.com/book/en/v2", note: "Free and complete" },
          { label: "The Missing Semester (MIT)", url: "https://missing.csail.mit.edu/", note: "Free course on shell and tooling" },
        ],
        steps: [
          { id: "ops-cli-1", title: "Get comfortable in a Linux shell", detail: "Navigating, permissions, processes, and reading logs." },
          { id: "ops-cli-2", title: "Learn Git beyond commit and push", detail: "Branching, rebasing, resolving conflicts, and recovering from mistakes." },
          { id: "ops-cli-3", title: "Write a shell script", detail: "Automate something you currently do by hand more than once a week." },
        ],
      },
      {
        title: "Containers",
        summary: "Making it run the same everywhere.",
        resources: [
          { label: "Docker: Get Started", url: "https://docs.docker.com/get-started/", note: "Official walkthrough" },
          { label: "Play with Docker", url: "https://labs.play-with-docker.com/", note: "Free browser sandbox" },
        ],
        steps: [
          { id: "ops-docker-1", title: "Containerise an app", detail: "Write a Dockerfile, build it, run it, and understand what a layer is." },
          { id: "ops-docker-2", title: "Use docker compose", detail: "Run your app and its database together with one command." },
          { id: "ops-docker-3", title: "Shrink your image", detail: "Multi-stage builds. Know why a 1GB image is a problem." },
        ],
      },
      {
        title: "Automation",
        summary: "Deploys shouldn't depend on remembering steps.",
        resources: [
          { label: "GitHub Actions docs", url: "https://docs.github.com/en/actions", note: "Official, free minutes for public repos" },
        ],
        steps: [
          { id: "ops-ci-1", title: "Set up CI", detail: "GitHub Actions running your tests and linter on every push." },
          { id: "ops-ci-2", title: "Automate deployment", detail: "Merging to main should deploy, without you re-pointing anything by hand." },
          { id: "ops-ci-3", title: "Manage secrets properly", detail: "Environment variables in the platform, never committed to the repo." },
        ],
      },
      {
        title: "Running it",
        summary: "Knowing when something is wrong.",
        resources: [
          { label: "Google SRE Book", url: "https://sre.google/books/", note: "Free online, the reference on running systems" },
          { label: "Kubernetes tutorials", url: "https://kubernetes.io/docs/tutorials/", note: "Official, start with the basics" },
        ],
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
    certificationNote:
      "The field moves faster than certification bodies do, so nothing here is a recognised credential. The short courses below are free and respected as learning, not as proof — a working AI feature you can demo counts for far more.",
    certifications: [
      { name: "Short Courses", provider: "DeepLearning.AI", url: "https://www.deeplearning.ai/short-courses/", note: "Free, practical, frequently updated" },
    ],
    stages: [
      {
        title: "Foundations",
        summary: "Enough to reason about what these models do.",
        resources: [
          { label: "Python official tutorial", url: "https://docs.python.org/3/tutorial/", note: "Free and authoritative" },
          { label: "Tokenizer playground", url: "https://huggingface.co/spaces/Xenova/the-tokenizer-playground", note: "See what a token actually is" },
        ],
        steps: [
          { id: "ai-found-1", title: "Learn Python well enough to build", detail: "Data structures, packages, virtual environments, and reading someone else's code." },
          { id: "ai-found-2", title: "Understand tokens and context windows", detail: "Why cost and limits are measured in tokens, and what happens when you exceed them." },
          { id: "ai-found-3", title: "Know what a model can and cannot do", detail: "Hallucination, knowledge cutoffs, and why grounding in real data matters." },
        ],
      },
      {
        title: "Working with APIs",
        summary: "Most AI engineering is calling models well.",
        resources: [
          { label: "Anthropic API docs", url: "https://docs.anthropic.com/", note: "Messages, tools, structured output" },
          { label: "OpenAI API docs", url: "https://platform.openai.com/docs", note: "Official reference" },
        ],
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
        resources: [
          { label: "pgvector", url: "https://github.com/pgvector/pgvector", note: "Vectors in Postgres you already have" },
          { label: "LangChain docs", url: "https://python.langchain.com/docs/introduction/", note: "One way to assemble a RAG pipeline" },
        ],
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
        resources: [
          { label: "OWASP Top 10 for LLM Apps", url: "https://owasp.org/www-project-top-10-for-large-language-model-applications/", note: "Prompt injection and friends" },
        ],
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
    certificationNote:
      "No certification matters much here. A published app someone can download is the credential — even a small one with ten users beats a certificate.",
    certifications: [],
    stages: [
      {
        title: "Get running on a device",
        summary: "The loop that makes everything else possible.",
        resources: [
          { label: "Expo docs", url: "https://docs.expo.dev/", note: "Fastest path to your own phone" },
          { label: "React Native docs", url: "https://reactnative.dev/docs/getting-started", note: "Official reference" },
        ],
        steps: [
          { id: "mob-start-1", title: "Set up React Native with Expo", detail: "Get a project running on your own phone, not just a simulator." },
          { id: "mob-start-2", title: "Learn mobile layout", detail: "Flexbox again, but with safe areas, notches, and wildly different screen sizes." },
          { id: "mob-start-3", title: "Add navigation", detail: "Stacks and tabs, and handling the Android back button correctly." },
        ],
      },
      {
        title: "Real app behaviour",
        summary: "What separates a demo from an app.",
        resources: [
          { label: "React Navigation", url: "https://reactnavigation.org/docs/getting-started", note: "The standard navigation library" },
          { label: "Expo device APIs", url: "https://docs.expo.dev/versions/latest/", note: "Camera, location, notifications" },
        ],
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
        resources: [
          { label: "Expo Application Services", url: "https://docs.expo.dev/eas/", note: "Builds and store submission" },
          { label: "Apple App Review Guidelines", url: "https://developer.apple.com/app-store/review/guidelines/", note: "Read before you build, not after" },
        ],
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
    certificationNote:
      "There is no system design certification, and there probably shouldn't be. This is assessed in interviews by how you reason out loud about tradeoffs.",
    certifications: [],
    stages: [
      {
        title: "Building blocks",
        summary: "The pieces every design is assembled from.",
        resources: [
          { label: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer", note: "Free, the most used starting point" },
          { label: "Latency numbers every programmer should know", url: "https://colin-scott.github.io/personal_website/research/interactive_latency.html", note: "Interactive reference" },
        ],
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
        resources: [
          { label: "Designing Data-Intensive Applications", url: "https://dataintensive.net/", note: "The book people actually recommend" },
          { label: "Jepsen analyses", url: "https://jepsen.io/analyses", note: "What distributed systems really do under partition" },
        ],
        steps: [
          { id: "sd-data-1", title: "Learn replication and sharding", detail: "Read replicas, partitioning, and what each makes harder." },
          { id: "sd-data-2", title: "Understand CAP in practice", detail: "What you actually give up during a network partition." },
          { id: "sd-data-3", title: "Know when SQL isn't the answer", detail: "And, more often, when it still is." },
        ],
      },
      {
        title: "Design practice",
        summary: "The skill is in the tradeoffs, not the diagram.",
        resources: [
          { label: "System Design Primer: worked examples", url: "https://github.com/donnemartin/system-design-primer#system-design-interview-questions-with-solutions", note: "Solutions to the classics" },
        ],
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
    certificationNote:
      "Security is the field where certifications carry the most weight, largely because employers use them to filter. Security+ is the common entry point; OSCP is hands-on and respected.",
    certifications: [
      { name: "CompTIA Security+", provider: "CompTIA", url: "https://www.comptia.org/certifications/security", note: "Common baseline requirement" },
      { name: "OSCP", provider: "OffSec", url: "https://www.offsec.com/courses/pen-200/", note: "24-hour practical exam, highly respected" },
    ],
    stages: [
      {
        title: "Groundwork",
        summary: "You can't secure what you don't understand.",
        resources: [
          { label: "Computer Networking: a Top-Down Approach", url: "https://gaia.cs.umass.edu/kurose_ross/index.php", note: "Companion site, free material" },
          { label: "OverTheWire: Bandit", url: "https://overthewire.org/wargames/bandit/", note: "Free, teaches Linux by playing" },
        ],
        steps: [
          { id: "sec-base-1", title: "Learn networking fundamentals", detail: "TCP/IP, DNS, HTTP, and TLS — what actually happens when a request leaves your machine." },
          { id: "sec-base-2", title: "Get comfortable with Linux", detail: "Permissions, users, processes, and where the logs live." },
          { id: "sec-base-3", title: "Understand cryptography basics", detail: "Hashing versus encryption, symmetric versus public key, and why you never roll your own." },
        ],
      },
      {
        title: "Web security",
        summary: "Where most real-world attacks land.",
        resources: [
          { label: "PortSwigger Web Security Academy", url: "https://portswigger.net/web-security", note: "Free, hands-on, genuinely excellent" },
          { label: "OWASP Top 10", url: "https://owasp.org/www-project-top-ten/", note: "The canonical list" },
          { label: "OWASP Juice Shop", url: "https://owasp.org/www-project-juice-shop/", note: "Deliberately vulnerable app" },
        ],
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
        resources: [
          { label: "TryHackMe", url: "https://tryhackme.com/", note: "Guided, beginner friendly" },
          { label: "Hack The Box", url: "https://www.hackthebox.com/", note: "Harder, less hand-holding" },
        ],
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
