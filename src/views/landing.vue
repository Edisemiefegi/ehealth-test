<template>
  <div class="p-3">
    <p class="fs-1">landing page</p>
    <Button :disabled="isCreating" @click="createPost">
      {{ isCreating ? "Creating..." : "Create post" }}
    </Button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import Button from "../components/base/Button.vue";
import { useEditor } from "../composable/useEditor";

const router = useRouter();
const { createNewPost } = useEditor();

const isCreating = ref(false);

async function createPost() {
  if (isCreating.value) return;

  isCreating.value = true;

  try {
    const postId = await createNewPost();

    if (!postId) return;

    await router.push({
      name: "Editor",
      params: {
        id: postId,
      },
    });
  } finally {
    isCreating.value = false;
  }
}
</script>
