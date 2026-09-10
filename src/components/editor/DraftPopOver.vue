```vue
<template>
  <Popover ref="popover">
    <div class="p-2" style="width: 300px">
      <!-- Header -->
      <div class="px-2 py-2 mb-2">
        <span class="fw-semibold"> My Drafts </span>

        <p class="text-xxs text-muted mb-0 mt-1">
          Continue working on your drafts.
        </p>
      </div>

      <!-- Drafts -->
      <div class="d-flex flex-column gap-1">
        <button
          v-for="(draft, index) in drafts"
          :key="draft.title"
          type="button"
          class="draft-item btn w-100 text-start border-0 rounded-3 p-2"
          :class="{ 'bg-secondary-subtle': index === 0 }"
        >
          <div class="d-flex align-items-center gap-2">
            <!-- Icon -->
            <span
              class="bg-light text-secondary rounded-2 d-flex align-items-center justify-content-center flex-shrink-0 draft-icon"
            >
              <File />
            </span>

            <!-- Draft details -->
            <div class="min-w-0">
              <p class="fw-semibold text-xs mb-1 text-truncate">
                {{ draft.title }}
              </p>

              <p class="text-xxs fw-light text-muted mb-0">
                Last edited {{ draft.updated_at }}
              </p>
            </div>
          </div>
        </button>
      </div>

      <!-- Empty state -->
      <div v-if="!drafts.length" class="px-2 py-3">
        <span class="text-xs text-muted"> No drafts yet. </span>
      </div>
    </div>
  </Popover>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Popover from "primevue/popover";
import { File } from "@primeicons/vue";

const popover = ref();

const toggle = (event: MouseEvent) => {
  popover.value.toggle(event);
};

defineExpose({
  toggle,
});

const drafts = [
  {
    title: "The attention",
    updated_at: "Sep 10",
  },
  {
    title: "The attention is over",
    updated_at: "Jan 10",
  },
];
</script>

<style scoped lang="scss">
.draft-item:hover {
  background-color: #fbf9f9;
}

.draft-icon {
  width: 32px;
  height: 32px;
}
</style>
