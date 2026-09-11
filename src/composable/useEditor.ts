import { reactive, ref } from "vue";
import type { Post } from "../types";
import {
  saveDraft,
  publishPost,
  listDrafts,
  type SavePostInput,
  getPost,
  getAiSuggestion,
} from "../api/mockApi";

const currentPost = reactive({
  postId: undefined as string | undefined,
  title: "",
  content: "",
  excerpt: "",
  keywords: [] as string[],
  status: "draft" as Post["status"],
  saveState: "idle" as "idle" | "saving" | "saved" | "error",
});

const drafts = ref<Post[]>([]);
const draftsLoading = ref(false);

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
  currentPost.saveState = "saving";
  try {
    const post = await publishPost(buildInput());
    currentPost.postId = post.post_id;
    currentPost.status = post.status;
    currentPost.saveState = "saved";
    await refreshDrafts();
  } catch {
    currentPost.saveState = "error";
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
  const post = await getPost(postId);
  if (!post) return;

  const suggestion = post.ai_suggestion_id
    ? await getAiSuggestion(post.ai_suggestion_id)
    : undefined;

  loadDraft(post, suggestion?.keywords ?? []);
}

export function useEditor() {
  return {
    currentPost,
    drafts,
    draftsLoading,
    loadDraft,
    saveCurrentDraft,
    publishCurrentPost,
    refreshDrafts,
    createNewPost,
    reset,
    loadPostById,
  };
}
