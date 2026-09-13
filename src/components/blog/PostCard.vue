<template>
  <div
    class="d-flex justify-content-between gap-3 border-bottom border-secondary-subtle pb-4 w-100 overflow-hidden"
  >
    <div class="d-flex gap-3 flex-grow-1 min-w-0 overflow-hidden">
      <div
        class="bg-secondary-subtle p-sm-5 p-4 rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
      >
        <File />
      </div>

      <div class="flex-grow-1 min-w-0 overflow-hidden">
        <p class="text-uppercase mb-1 text-muted text-xs fw-light">
          {{ post.status }}
        </p>

        <p class="fw-medium mb-1 fs-5 text-truncate" style="max-width: 100%">
          {{ post.title || "Untitled" }}
        </p>

        <p
          class="text-muted text-xs mb-2 text-truncate"
          style="max-width: 100%"
        >
          {{ post.excerpt || "No summary yet." }}
        </p>

        <p class="text-xxs text-muted mb-0 text-truncate">
          Updated {{ formatRelativeDate(post.updated_at) }}
        </p>
      </div>
    </div>

    <Button
      @click.stop.prevent="emit('preview', post)"
      variant="ghost"
      class="flex-shrink-0"
    >
      <Eye />
    </Button>
  </div>
</template>

<script setup lang="ts">
import { Eye, File } from "@primeicons/vue";
import Button from "../base/Button.vue";
import type { Post } from "../../types";
import { formatRelativeDate } from "../../utils";

defineProps<{ post: Post }>();

const emit = defineEmits<{ preview: [post: Post] }>();
</script>

<style scoped lang="scss"></style>
