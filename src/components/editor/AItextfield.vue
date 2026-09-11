<template>
  <div>
    <div class="d-flex align-items-center justify-content-between">
      <p class="text-xs text-muted mb-0">{{ label }}</p>

      <Button @click="onGenerateClick" variant="outline" size="sm">
        <Sparkles />
        {{ status === "loading" ? "Generating..." : "Generate" }}
      </Button>
    </div>

    <Input
      :modelValue="modelValue"
      @update:modelValue="emit('update:modelValue', $event)"
      :class="inputClass"
      :placeholder="placeholder"
    />

    <SuggestionModal
      ref="popover"
      :suggestions="suggestion"
      :status="status"
      @retry="emit('generate')"
      @apply="emit('apply', String($event))"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Sparkles } from "@primeicons/vue";
import Button from "../base/Button.vue";
import Input from "../base/Input.vue";
import SuggestionModal from "./SuggestionModal.vue";

type AsyncStatus = "idle" | "loading" | "error" | "success";

defineProps<{
  label: string;
  modelValue: string;
  placeholder?: string;
  inputClass?: string;
  status: AsyncStatus;
  suggestion?: string | string[];
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
  apply: [value: string];
  generate: [];
}>();

const popover = ref();

function onGenerateClick(event: MouseEvent) {
  popover.value?.toggle(event);
  emit("generate");
}
</script>