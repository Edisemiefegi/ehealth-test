import { stripHtml } from "../utils";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const GROQ_MODEL = "openai/gpt-oss-20b";

interface GroqMessage {
  role: "system" | "user";
  content: string;
}

async function askGroq(messages: GroqMessage[]): Promise<string> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY as string | undefined;
  // if (!apiKey) {
  //   throw new Error(
  //     "Missing VITE_GROQ_API_KEY. Add it to your .env file and restart the dev server.",
  //   );
  // }

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      temperature: 0.7,
      messages,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Groq request failed (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content ?? "";
  return text.trim();
}

function requireContent(content: string): string {
  const plain = stripHtml(content);
  if (!plain) throw new Error("Write some content first.");
  return plain;
}

export async function generateTitleSuggestion(
  content: string,
): Promise<string> {
  const plain = requireContent(content);
  return askGroq([
    {
      role: "system",
      content:
        "You write short, engaging blog post titles. Reply with only the title itself - no quotes, no explanation.",
    },
    {
      role: "user",
      content: `Suggest one title for this blog post:\n\n${plain}`,
    },
  ]);
}

export async function generateSummarySuggestion(
  content: string,
): Promise<string> {
  const plain = requireContent(content);
  return askGroq([
    {
      role: "system",
      content:
        "You write concise 1-2 sentence summaries of blog posts. Reply with only the summary - no preamble.",
    },
    { role: "user", content: `Summarize this blog post:\n\n${plain}` },
  ]);
}

export async function generateKeywordSuggestions(
  content: string,
): Promise<string[]> {
  const plain = requireContent(content);
  const raw = await askGroq([
    {
      role: "system",
      content:
        "You extract 5 relevant keywords or short phrases from blog post content. Reply with ONLY a comma-separated list - no numbering, no extra text.",
    },
    {
      role: "user",
      content: `Extract keywords from this blog post:\n\n${plain}`,
    },
  ]);

  return raw
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);
}

