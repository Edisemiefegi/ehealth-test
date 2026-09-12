import { ref } from "vue";

export type AsyncStatus = "idle" | "loading" | "error" | "success";

export function useAiSuggestion<T>(generator: () => Promise<T>) {
  const status = ref<AsyncStatus>("idle");
  const suggestion = ref<T | null>(null);
  const errorMessage = ref<string | null>(null);

  async function generate() {
    status.value = "loading";
    try {
      suggestion.value = await generator();
      status.value = "success";
    } catch (err) {
      errorMessage.value =
        err instanceof Error ? err.message : "Something went wrong.";
      console.error("AI suggestion failed:", err);
      status.value = "error";
    }
  }

  return { status, suggestion, generate, errorMessage };
}
