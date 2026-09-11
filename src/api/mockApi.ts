import type { AiSuggestion, Post, PostStatus, User } from "../types";
import { simulateRequest, slugify } from "../utils";

const STORAGE_KEY = "blog_mock_db";

interface Database {
  users: User[];
  posts: Post[];
  aiSuggestions: AiSuggestion[];
}

function loadDb(): Database {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) return JSON.parse(raw);

  const now = new Date().toISOString();
  const seeded: Database = {
    users: [
      {
        id: "user_1",
        created_at: now,
        updated_at: now,
        email: "demo@example.com",
        password: "not-a-real-hash",
        fullname: "Demo Author",
      },
    ],
    posts: [],
    aiSuggestions: [],
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
  return seeded;
}

function saveDb(db: Database) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

export interface SavePostInput {
  post_id?: string;
  title: string;
  content: string;
  excerpt: string;
  keywords: string[];
}

function upsertPost(input: SavePostInput, status: PostStatus): Post {
  const db = loadDb();
  const author = db.users[0];
  const now = new Date().toISOString();

  const existingPost = db.posts.find((p) => p.post_id === input.post_id);

  const suggestionId = existingPost?.ai_suggestion_id || crypto.randomUUID();
  const suggestion: AiSuggestion = {
    suggestion_id: suggestionId,
    user_id: author.id,
    title: input.title,
    summary: input.excerpt,
    keywords: input.keywords,
  };
  const existingSuggestionIndex = db.aiSuggestions.findIndex(
    (s) => s.suggestion_id === suggestionId,
  );
  if (existingSuggestionIndex === -1) {
    db.aiSuggestions.push(suggestion);
  } else {
    db.aiSuggestions[existingSuggestionIndex] = suggestion;
  }

  const post: Post = {
    post_id: existingPost?.post_id || crypto.randomUUID(),
    title: input.title,
    title_slug: slugify(input.title),
    excerpt: input.excerpt,
    content: input.content,
    keywords: input.keywords,
    author_id: author.id,
    ai_suggestion_id: suggestionId,
    status,
    created_at: existingPost?.created_at || now,
    updated_at: now,
    published_at: status === "published" ? now : existingPost?.published_at || null,
  };

  if (existingPost) {
    db.posts = db.posts.map((p) => (p.post_id === post.post_id ? post : p));
  } else {
    db.posts.push(post);
  }

  saveDb(db);
  return post;
}


export function saveDraft(input: SavePostInput) {
  return simulateRequest(upsertPost(input, "draft"), { failRate: 0 });
}

export function publishPost(input: SavePostInput) {
  return simulateRequest(upsertPost(input, "published"), { failRate: 0 });
}

export function listDrafts() {
  const db = loadDb();
  const drafts = db.posts
    .filter((p) => p.status === "draft")
    .sort((a, b) => b.updated_at.localeCompare(a.updated_at));
  return simulateRequest(drafts, { delay: 500, failRate: 0 });
}

export function getPost(postId: string) {
  const db = loadDb();
  const post = db.posts.find((p) => p.post_id === postId);
  return simulateRequest(post, { delay: 300, failRate: 0 });
}

export function getAiSuggestion(suggestionId: string) {
  const db = loadDb();
  const suggestion = db.aiSuggestions.find((s) => s.suggestion_id === suggestionId);
  return simulateRequest(suggestion, { delay: 300, failRate: 0 });
}












// import type { AiSuggestion, BlogPost } from "../types";


// const POSTS_KEY = "ehealth_blog_posts";
// const AI_SUGGESTIONS_KEY = "ehealth_ai_suggestions";

// const delay = (ms = 500) =>
//   new Promise((resolve) => setTimeout(resolve, ms));

// function getPosts(): BlogPost[] {
//   return JSON.parse(localStorage.getItem(POSTS_KEY) || "[]");
// }

// function savePosts(posts: BlogPost[]) {
//   localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
// }

// function getSuggestions(): AiSuggestion[] {
//   return JSON.parse(
//     localStorage.getItem(AI_SUGGESTIONS_KEY) || "[]",
//   );
// }

// function saveSuggestions(suggestions: AiSuggestion[]) {
//   localStorage.setItem(
//     AI_SUGGESTIONS_KEY,
//     JSON.stringify(suggestions),
//   );
// }

// export const postsApi = {
//   async getAll(): Promise<BlogPost[]> {
//     await delay();

//     return getPosts().sort(
//       (a, b) =>
//         new Date(b.updated_at).getTime() -
//         new Date(a.updated_at).getTime(),
//     );
//   },

//   async getById(postId: string): Promise<BlogPost | undefined> {
//     await delay();

//     return getPosts().find((post) => post.post_id === postId);
//   },

//   async create(
//     post: Omit<BlogPost, "post_id" | "created_at" | "updated_at">,
//   ): Promise<BlogPost> {
//     await delay();

//     const now = new Date().toISOString();

//     const newPost: BlogPost = {
//       ...post,
//       post_id: crypto.randomUUID(),
//       created_at: now,
//       updated_at: now,
//     };

//     const posts = getPosts();

//     posts.push(newPost);
//     savePosts(posts);

//     return newPost;
//   },

//   async update(
//     postId: string,
//     updates: Partial<BlogPost>,
//   ): Promise<BlogPost> {
//     await delay();

//     const posts = getPosts();

//     const index = posts.findIndex(
//       (post) => post.post_id === postId,
//     );

//     if (index === -1) {
//       throw new Error("Post not found");
//     }

//     const updatedPost: BlogPost = {
//       ...posts[index],
//       ...updates,
//       updated_at: new Date().toISOString(),
//     };

//     posts[index] = updatedPost;

//     savePosts(posts);

//     return updatedPost;
//   },

//   async delete(postId: string): Promise<void> {
//     await delay();

//     const posts = getPosts().filter(
//       (post) => post.post_id !== postId,
//     );

//     savePosts(posts);
//   },
// };

// export const aiSuggestionsApi = {
//   async create(
//     suggestion: Omit<AiSuggestion, "suggestion_id" | "created_at">,
//   ): Promise<AiSuggestion> {
//     await delay();

//     const newSuggestion: AiSuggestion = {
//       ...suggestion,
//       suggestion_id: crypto.randomUUID(),
//       created_at: new Date().toISOString(),
//     };

//     const suggestions = getSuggestions();

//     suggestions.push(newSuggestion);

//     saveSuggestions(suggestions);

//     return newSuggestion;
//   },

//   async getByPostId(postId: string): Promise<AiSuggestion | undefined> {
//     await delay();

//     return getSuggestions().find(
//       (suggestion) => suggestion.post_id === postId,
//     );
//   },
// };