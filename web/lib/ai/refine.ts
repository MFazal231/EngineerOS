import type { NextAction } from "./nextAction";

/**
 * Rewrites the heuristic's "reason" in a more natural, encouraging voice —
 * grounded in the exact same facts, never inventing new ones. No-ops
 * (returns the heuristic untouched) until an API key is configured, so this
 * is safe to call everywhere without adding cost or risk of error.
 */
export async function refineWithLLM(action: NextAction): Promise<NextAction> {
  const openaiKey = process.env.OPENAI_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  if (!openaiKey && !anthropicKey && !geminiKey) {
    return action;
  }

  const prompt = `A developer's next best action was determined by rules, not by you. Rewrite only the "reason" in one encouraging sentence, using ONLY these facts — do not invent progress, numbers, or context that isn't given.

Headline: ${action.headline}
Facts: ${action.reason}

Reply with just the rewritten sentence in plain text — no markdown, no asterisks — nothing else.`;

  try {
    const rewritten = openaiKey
      ? await callOpenAI(prompt, openaiKey)
      : anthropicKey
        ? await callAnthropic(prompt, anthropicKey)
        : await callGemini(prompt, geminiKey as string);

    if (!rewritten) {
      return action;
    }

    return { ...action, reason: rewritten.trim(), source: "ai" };
  } catch (error) {
    // Any failure (bad key, rate limit, network) falls back to the heuristic silently.
    console.warn("refineWithLLM failed, falling back to heuristic:", error);
    return action;
  }
}

async function callOpenAI(prompt: string, apiKey: string): Promise<string | null> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 100,
      temperature: 0.6,
    }),
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? null;
}

async function callAnthropic(prompt: string, apiKey: string): Promise<string | null> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 100,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data.content?.[0]?.text ?? null;
}

async function callGemini(prompt: string, apiKey: string): Promise<string | null> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        // gemini-3.6-flash spends part of maxOutputTokens on internal "thinking" before
        // the visible answer — 100 wasn't enough headroom and truncated the reply mid-sentence.
        generationConfig: { maxOutputTokens: 1000, temperature: 0.6 },
      }),
    },
  );

  if (!response.ok) {
    // Expected and handled (falls back to the plain heuristic reason) — a 429 quota
    // error here is routine on the free tier, not a bug, so warn rather than error
    // to avoid tripping Next.js's dev-mode error overlay for normal degradation.
    console.warn("Gemini API error, falling back to heuristic:", response.status, await response.text());
    return null;
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
}
