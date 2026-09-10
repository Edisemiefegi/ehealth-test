<template>
  <button
    :type="type"
    class="btn"
    :class="[variantClass, sizeClass, { 'rounded-pill': rounded }]"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";

type ButtonSize = "sm" | "md" | "lg";

interface Props {
  variant?: ButtonVariant;
  size?: ButtonSize;
  rounded?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
  size: "md",
  rounded: false,
  disabled: false,
  type: "button",
});

const variantClass = computed(() => {
  const variants = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    ghost: "btn-ghost",
    outline: "btn-outline",
  };

  return variants[props.variant];
});

const sizeClass = computed(() => {
  if (props.size === "sm") {
    return "btn-sm text-xs";
  }
  if (props.size === "lg") {
    return "btn-lg";
  }
  return "";
});
</script>

<style scoped>
.btn-ghost {
  border: none;
  background: transparent;
}

.btn-outline {
  background: transparent;
  border: 1px solid var(--bs-border-color);
}
</style>
