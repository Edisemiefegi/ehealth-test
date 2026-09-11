<template>
  <Popover
    ref="popover"
    class="border w-25 border-secondary bg-white -z-3 border-opacity-25"
  >
    <div class="d-flex gap-2 align-items-center">
      <p class="text-muted"><Sparkles /></p>
      <div class="flex-grow-1">
        <p v-if="status === 'error'" class="text-xxs text-danger">
          Something went wrong. Try again.
        </p>

        <p v-else class="text-xxs mb-0">
          {{ suggestions }}
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div
      class="d-flex align-items-center justify-content-end gap-2 p-1 border-top border-border"
    >
      <Button
        variant="ghost"
        size="sm"
        class="text-muted"
        @click="emit('retry')"
      >
        Regenerate
      </Button>

      <Button variant="secondary" size="sm" @click="onApply">
        <Check /> Apply
      </Button>
    </div>
  </Popover>
</template>

<script setup lang="ts" generic="T extends string | string[]">
import { ref } from "vue";
import { Check, Sparkles } from "@primeicons/vue";
import Button from "../base/Button.vue";
import { Popover } from "primevue";

type AsyncStatus = "idle" | "loading" | "error" | "success";

const popover = ref();

const toggle = (event: MouseEvent) => {
  popover.value.toggle(event);
};

defineExpose({
  toggle,
});

const props = defineProps<{
  suggestions?: T;
  status?: AsyncStatus;
}>();

const emit = defineEmits<{
  retry: [];
  apply: [value: T];
}>();

function onApply() {
  if (props.suggestions === undefined) return;
  emit("apply", props.suggestions);
  popover.value?.hide();
}
</script>

<style scoped lang="scss"></style>
