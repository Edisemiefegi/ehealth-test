<template>
  <div class="position-relative">
    <Search
      class="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
    />

    <input
      v-model="search"
      type="search"
      class="form-control ps-5 rounded-3 bg-transparent"
      :placeholder="placeholder"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { Search } from "@primeicons/vue";

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    placeholder?: string;
    delay?: number;
  }>(),
  {
    modelValue: "",
    placeholder: "Search posts...",
    delay: 400,
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const search = ref(props.modelValue);

let timeout: ReturnType<typeof setTimeout>;

watch(search, (value) => {
  clearTimeout(timeout);

  timeout = setTimeout(() => {
    emit("update:modelValue", value);
  }, props.delay);
});
</script>
