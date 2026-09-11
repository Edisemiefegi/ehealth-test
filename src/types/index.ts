export type PostStatus = "draft" | "published";

export interface User {
  id: string;
  created_at: string;
  updated_at: string;
  email: string;
  password: string;
  fullname: string;
}

export interface Post {
  post_id: string;
  title: string;
  title_slug: string;
  excerpt: string;
  content: string;
  keywords: string[];
  author_id: string;
  ai_suggestion_id?: string | null;
  status: PostStatus;
  created_at: string;
  updated_at: string;
published_at: string | null;
}

export interface AiSuggestion {
  suggestion_id: string;
  user_id: string;
  post_id?: string;
  title?: string;
  summary?: string;
  keywords?: string[];
  // created_at: string;
}