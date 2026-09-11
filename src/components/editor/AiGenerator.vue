<template>
  <div>
    <div class="d-flex align-items-center justify-content-between">
      <p class="text-xs text-muted mb-0">{{ label }}</p>

      <Button @click="onGenerateClick" variant="outline" size="sm">
        <Sparkles />
        {{ status === "loading" ? "Generating..." : "Generate" }}
      </Button>
    </div>

    <SuggestionModal
      ref="popover"
      :suggestions="suggestion"
      :status="status"
      @retry="emit('generate')"
      @apply="emit('apply', ($event))"
    />
  </div>
</template>

<script setup lang="ts" generic="T extends string | string[]">
import { ref } from "vue";
import { Sparkles } from "@primeicons/vue";
import Button from "../base/Button.vue";
import SuggestionModal from "./SuggestionModal.vue";

type AsyncStatus = "idle" | "loading" | "error" | "success";
defineProps<{
  label: string;
  status: AsyncStatus;
 suggestion?: T;}>();

const emit = defineEmits<{
  apply: [value: T];
  generate: [];
}>();

const popover = ref();

function onGenerateClick(event: MouseEvent) {
  popover.value?.toggle(event);
  emit("generate");
}
</script>
