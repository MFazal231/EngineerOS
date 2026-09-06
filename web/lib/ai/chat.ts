export type ChatMessage = { role: "user" | "assistant"; content: string };

export function isAIChatConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY || process.env.GEMINI_API_KEY);
}

const SYSTEM_PROMPT = (context: string) => `You are the AI Engineer inside EngineerOS, a tool that helps developers learn, practice DSA, and build projects.

You have access to this user's REAL activity data below. Never invent progress, problems, or projects that aren't listed here — if you don't know something from this data, say so honestly instead of guessing.

${context}

If the user asks something this data can't answer (like general career advice), answer helpfully but make clear it's general guidance, not something read from their stats. Keep answers concise — 2-4 sentences unless they ask for more detail.

Respond in plain text only — no markdown, no asterisks for bold/italic, no bullet points or numbered lists. Write it the way you'd say it out loud.`;

/**
 * Sends a grounded conversation to whichever provider has a configured key.
 * Returns null if no key is set or the call fails — callers should show a
 * clear "AI isn't configured" message rather than a fake response.
 */
export async function chatWithAI(context: string, messages: ChatMessage[]): Promise<string | null> {
  const openaiKey = process.env.OPENAI_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  if (!openaiKey && !anthropicKey && !geminiKey) {
    return null;
  }

  const system = SYSTEM_PROMPT(context);

  try {
    if (openaiKey) return await callOpenAI(system, messages, openaiKey);
    if (anthropicKey) return await callAnthropic(system, messages, anthropicKey);
    return await callGemini(system, messages, geminiKey as string);
  } catch (error) {
    console.warn("chatWithAI failed:", error);
    return null;
  }
}

async function callOpenAI(system: string, messages: ChatMessage[], apiKey: string): Promise<string | null> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: system }, ...messages],
      max_tokens: 400,
      temperature: 0.6,
    }),
  });

  if (!response.ok) {
    console.warn("OpenAI chat error:", response.status, await response.text());
    return null;
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? null;
}

async function callAnthropic(system: string, messages: ChatMessage[], apiKey: string): Promise<string | null> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 400,
      system,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    }),
  });

  if (!response.ok) {
    console.warn("Anthropic chat error:", response.status, await response.text());
    return null;
  }

  const data = await response.json();
  return data.content?.[0]?.text ?? null;
}

async function callGemini(system: string, messages: ChatMessage[], apiKey: string): Promise<string | null> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: messages.map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        })),
        generationConfig: { maxOutputTokens: 1500, temperature: 0.6 },
      }),
    },
  );

  if (!response.ok) {
    console.warn("Gemini chat error:", response.status, await response.text());
    return null;
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
}
