import { reactive, ref } from "vue";
import type { Post, PostStatus } from "../types";
import {
  saveDraft,
  publishPost,
  listDrafts,
  listPublished,
  getPost,
  getAiSuggestion,
  type SavePostInput,
  deletePost,
} from "../api/mockApi";

type SaveState = "idle" | "saving" | "saved" | "error";

function createEditor() {
  const currentPost = reactive({
    postId: undefined as string | undefined,
    title: "",
    content: "",
    excerpt: "",
    keywords: [] as string[],
    status: "draft" as PostStatus,
    saveState: "idle" as SaveState,
  });

  const drafts = ref<Post[]>([]);
  const draftsLoading = ref(false);
  const publishedPosts = ref<Post[]>([]);
  const publishedLoading = ref(false);
  const currentPostLoading = ref(false);

  function reset() {
    currentPost.postId = undefined;
    currentPost.title = "";
    currentPost.content = "";
    currentPost.excerpt = "";
    currentPost.keywords = [];
    currentPost.status = "draft";
    currentPost.saveState = "idle";
  }

  function loadDraft(post: Post, keywords: string[]) {
    currentPost.postId = post.post_id;
    currentPost.title = post.title;
    currentPost.content = post.content;
    currentPost.excerpt = post.excerpt;
    currentPost.keywords = keywords;
    currentPost.status = post.status;
    currentPost.saveState = "idle";
  }

  function buildInput(): SavePostInput {
    return {
      post_id: currentPost.postId,
      title: currentPost.title,
      content: currentPost.content,
      excerpt: currentPost.excerpt,
      keywords: currentPost.keywords,
    };
  }

  async function refreshDrafts() {
    draftsLoading.value = true;
    try {
      drafts.value = await listDrafts();
    } finally {
      draftsLoading.value = false;
    }
  }

  async function refreshPublished() {
    publishedLoading.value = true;
    try {
      publishedPosts.value = await listPublished();
    } finally {
      publishedLoading.value = false;
    }
  }

  async function saveCurrentDraft() {
    currentPost.saveState = "saving";
    try {
      const post = await saveDraft(buildInput());
      currentPost.postId = post.post_id;
      currentPost.status = post.status;
      currentPost.saveState = "saved";
      await refreshDrafts();
    } catch {
      currentPost.saveState = "error";
    }
  }

  async function publishCurrentPost() {
    if (!currentPost.title.trim() || !currentPost.content.trim()) {
      currentPost.saveState = "error";
      return false;
    }
    currentPost.saveState = "saving";
    try {
      const post = await publishPost(buildInput());
      currentPost.postId = post.post_id;
      currentPost.status = post.status;
      currentPost.saveState = "saved";
      await Promise.all([refreshDrafts(), refreshPublished()]);
    } catch {
      currentPost.saveState = "error";
      return false;
    }
  }

  async function createNewPost(): Promise<string | undefined> {
    reset();
    try {
      const post = await saveDraft(buildInput());
      currentPost.postId = post.post_id;
      currentPost.status = post.status;
      await refreshDrafts();
      return post.post_id;
    } catch {
      currentPost.saveState = "error";
      return undefined;
    }
  }

  async function loadPostById(postId: string) {
    currentPostLoading.value = true;
    try {
      const post = await getPost(postId);
      if (!post) return;

      const suggestion = post.ai_suggestion_id
        ? await getAiSuggestion(post.ai_suggestion_id)
        : undefined;

      loadDraft(post, suggestion?.keywords ?? []);
    } finally {
      currentPostLoading.value = false;
    }
  }

  async function deleteDraft(postId: string) {
    await deletePost(postId);
    await refreshDrafts();

    if (currentPost.postId === postId) {
      reset();
    }
  }

  return {
    currentPost,
    currentPostLoading,
    drafts,
    draftsLoading,
    publishedPosts,
    publishedLoading,
    loadDraft,
    loadPostById,
    createNewPost,
    reset,
    saveCurrentDraft,
    publishCurrentPost,
    refreshDrafts,
    refreshPublished,
    deleteDraft,
  };
}

let editor: ReturnType<typeof createEditor> | undefined;

export function useEditor() {
  if (!editor) editor = createEditor();
  return editor;
}
