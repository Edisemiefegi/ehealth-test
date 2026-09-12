<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="Preview"
    :style="{ width: '720px', maxWidth: '95vw' }"
  >

    <article class="preview-article">
      <h1 class="fw-bold mb-2">
        {{ post.title || "Untitled" }}
      </h1>

      <p v-if="post.excerpt" class="text-muted fst-italic mb-3">
        {{ post.excerpt }}
      </p>

      <div v-if="post.keywords.length" class="d-flex flex-wrap gap-2 mb-4">
        <span
          v-for="keyword in post.keywords"
          :key="keyword"
          class="rounded-pill px-2 py-1 bg-muted text-xxs"
        >
          {{ keyword }}
        </span>
      </div>

      <div v-if="post.content" class="ql-editor p-0" v-html="post.content" />
      <p v-else class="text-muted">Nothing written yet.</p>
    </article>

    <template #footer>
      <Button variant="outline" @click="close">Close</Button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Dialog from "primevue/dialog";
import Button from "../base/Button.vue";
import type { PostPreview } from "../../types";

defineProps<{ post: PostPreview }>();

const visible = ref(false);

function open() {
  visible.value = true;
}

function close() {
  visible.value = false;
}

defineExpose({ open, close });
</script>

<style scoped lang="scss">
.preview-article :deep(img) {
  max-width: 100%;
  height: auto;
}
</style>