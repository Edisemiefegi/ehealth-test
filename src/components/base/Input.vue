<template>
  <div class="position-relative w-100">
    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      class="form-control border-0 rounded-0 bg-transparent shadow-none px-0"
      @input="handleInput"
    />

  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string
  type?: string
  placeholder?: string
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  modelValue: "",
  type: "text",
  placeholder: "",
  disabled: false,
})

const emit = defineEmits<{
  (event: "update:modelValue", value: string): void
}>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit("update:modelValue", target.value)
}
</script>

<style scoped lang="scss">
.input-focus-line {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--bs-primary);
  transition: width 0.25s ease;
}

.form-control:focus + .input-focus-line {
  width: 100%;
}
</style>