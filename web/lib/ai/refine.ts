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

  if (!openaiKey && !anthropicKey) {
    return action;
  }

  const prompt = `A developer's next best action was determined by rules, not by you. Rewrite only the "reason" in one encouraging sentence, using ONLY these facts — do not invent progress, numbers, or context that isn't given.

Headline: ${action.headline}
Facts: ${action.reason}

Reply with just the rewritten sentence, nothing else.`;

  try {
    const rewritten = openaiKey
      ? await callOpenAI(prompt, openaiKey)
      : await callAnthropic(prompt, anthropicKey as string);

    if (!rewritten) {
      return action;
    }

    return { ...action, reason: rewritten.trim(), source: "ai" };
  } catch {
    // Any failure (bad key, rate limit, network) falls back to the heuristic silently.
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
