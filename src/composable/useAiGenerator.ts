import { ref } from "vue";

export type AsyncStatus = "idle" | "loading" | "error" | "success";


export function useAiSuggestion<T>(generator: () => Promise<T>) {
  const status = ref<AsyncStatus>("idle");
  const suggestion = ref<T>();

  async function generate() {
    status.value = "loading";
    try {
      suggestion.value = await generator();
      status.value = "success";
    } catch {
      status.value = "error";
    }
  }

  return { status, suggestion, generate };
}



