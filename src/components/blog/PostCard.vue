<template>
  <div
    class="d-flex justify-content-between border-bottom border-secondary-subtle pb-4"
  >
    <div class="d-flex gap-3">
      <div
        class="bg-secondary-subtle p-sm-5 p-4 rounded-3 d-flex align-items-center justify-content-center"
      >
        <File />
      </div>
      <div>
        <p class="text-uppercase mb-1 text-muted text-xs fw-light">
          {{ post.status }}
        </p>
        <p class="fw-medium mb-0 text-truncate fs-5">
          {{ post.title || "Untitled" }}
        </p>

        <p class="text-muted text-xs mb-2 line-clamp-2">
          {{ post.excerpt || "No summary yet." }}
        </p>

        <p class="text-xxs text-muted mb-0 mt-auto">
          Updated {{ formatRelativeDate(post.updated_at) }}
        </p>
      </div>
    </div>

    <Button @click.stop.prevent="emit('preview', post)" variant="ghost">
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
