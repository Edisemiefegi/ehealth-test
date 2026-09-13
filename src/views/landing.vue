<template>
  <main class="bg-background vh-100 overflow-y-auto pt-5">
    <Nav :is-editor="false" />

    <div class="container py-5 d-flex flex-column gap-4">
      <section
        class="flex-sm-row flex-column justify-content-between align-items-end"
      >
        <div>
          <p class="text-muted text-xxs mb-0 fw-light">LIBRARY</p>
          <p class="fs-3 fw-semibold mb-0">All posts</p>
          <p class="text-muted text-xxs fw-light">
            Keep every idea in view, from the first rough draft to the finished
            story.
          </p>
        </div>

        <Button :disabled="isCreating" @click="createPost">
          <Plus /> {{ isCreating ? "Creating..." : "New post" }}
        </Button>
      </section>

      <section
        class="d-flex justify-content-between border-top border-secondary-subtle border-bottom p-3 align-items-center text-muted"
      >
        <p class="text-xs mb-0">
          <span class="fw-bold">{{ publishedPosts.length }}</span> stories in
          your library
        </p>
        <Search v-model="searchQuery" />
      </section>

      <section v-if="publishedLoading" class="">
        <Spinner />
      </section>

      <section
        v-else-if="!publishedPosts.length"
        class="text-center text-muted py-5"
      >
        No published posts yet. Publish a draft to see it here.
      </section>

      <section
        v-else-if="!filteredPosts.length"
        class="text-center text-muted py-5"
      >
        No posts found for "{{ searchQuery }}".
      </section>

      <section v-else class="row g-4 ">
        <div v-for="post in filteredPosts" :key="post.post_id">
          <PostCard :post="post" @preview="openPreview" />
        </div>
        <Postpreviewmodal ref="previewModal" :post="previewPost" />
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import Nav from "../components/editor/Nav.vue";
import Button from "../components/base/Button.vue";
import PostCard from "../components/blog/PostCard.vue";
import { useEditor } from "../composable/useEditor.ts";
import { Plus } from "@primeicons/vue";
import Postpreviewmodal from "../components/blog/Postpreviewmodal.vue";
import type { Post, PostPreview } from "../types/index.ts";
import { getAiSuggestion } from "../api/mockApi.ts";
import Spinner from "../components/base/Spinner.vue";
import Search from "../components/base/Search.vue";

const router = useRouter();
const { createNewPost, publishedPosts, publishedLoading, refreshPublished } =
  useEditor();

const searchQuery = ref("");
const isCreating = ref(false);
const previewModal = ref();
const previewPost = reactive<PostPreview>({
  title: "",
  excerpt: "",
  content: "",
  keywords: [],
});

onMounted(refreshPublished);

async function openPreview(post: Post) {
  previewPost.title = post.title;
  previewPost.excerpt = post.excerpt;
  previewPost.content = post.content;
  previewPost.keywords = post.ai_suggestion_id
    ? ((await getAiSuggestion(post.ai_suggestion_id))?.keywords ?? [])
    : [];

  previewModal.value?.open();
}

async function createPost() {
  if (isCreating.value) return;

  isCreating.value = true;
  try {
    const postId = await createNewPost();
    if (!postId) return;

    await router.push({ name: "EditPost", params: { id: postId } });
  } finally {
    isCreating.value = false;
  }
}

const filteredPosts = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();

  if (!query) {
    return publishedPosts.value;
  }

  return publishedPosts.value.filter((post) => {
    return (
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query) ||
      post.keywords.some((keyword) => keyword.toLowerCase().includes(query))
    );
  });
});
</script>
