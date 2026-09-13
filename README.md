# AI-Assisted Blog Editor

A single-page Vue 3 app for drafting blog posts with AI-generated title,
summary, and keyword suggestions, built as a frontend take-home project.

## Features

- **Rich-text editor** (PrimeVue `Editor`, Quill under the hood) for writing
  post content.
- **AI-powered suggestions**, each with its own Generate / Regenerate / Apply
  flow:
  - Generate Title
  - Summarize Content
  - Suggest Keywords
- **Draft & publish workflow** — save a work-in-progress draft, resume it
  later from "My Drafts," or publish it to the public library.
- **Local persistence via a mock API** — no real backend; a small
  localStorage-backed layer (`mockApi.ts`) simulates REST-style endpoints
  (`saveDraft`, `publishPost`, `listDrafts`, `listPublished`, `getPost`,
  `getAiSuggestion`) so drafts survive a page refresh.
- **Post preview modal** — see how a post will render before publishing,
  reusable both inside the editor and from the published-posts library
  (no route change needed).
- **Responsive layout** built with Bootstrap utility classes.

## Tech stack

| Layer            | Choice                                              |
|-------------------|-----------------------------------------------------|
| Framework          | Vue 3 (`<script setup>`, Composition API) + Vite + TypeScript |
| Styling            | Bootstrap 5 utility classes + a small amount of scoped SCSS |
| UI components      | PrimeVue (`Editor`, `Popover`, `Dialog`)            |
| Routing            | Vue Router (`/`,`editor`, `/editor/:id`)                     |
| AI provider        | [Groq](https://console.groq.com) (OpenAI-compatible chat completions API) |
| Persistence (mock) | `localStorage`, wrapped to look like async API calls |


## Getting started

```bash
npm install
```

Create a `.env` file in the project root:

```
VITE_GROQ_API_KEY=your_groq_api_key_here
```

Get a free key at [console.groq.com](https://console.groq.com) → API Keys.

```bash
npm run dev
```

## Data model

Three tables: `users`, `blog_posts`, `ai_suggestions`.

The mock API's in-browser data shape mirrors this schema directly, so it
doubles as a spec for what a real backend would need to implement to
replace it.


## Project structure

src/
├── api/
│   ├── ai.ts               # Groq API calls for title/summary/keywords
│   └── mockApi.ts          # mock REST-style persistence (localStorage-backed)
├── assets/
│   └── scss/
│       └── styles.scss
├── components/
│   ├── base/
│   │   ├── Button.vue
│   │   ├── Input.vue
│   │   ├── Search.vue
│   │   └── Spinner.vue
│   ├── blog/
│   │   ├── PostCard.vue
│   │   └── Postpreviewmodal.vue
│   └── editor/
│       ├── AiGenerator.vue
│       ├── DraftPopOver.vue
│       ├── Nav.vue
│       └── SuggestionModal.vue
├── composable/
│   ├── useAiGenerator.ts   # generic async-suggestion status wrapper
│   └── useEditor.ts         # shared editor + drafts + published-posts state
├── types/
│   └── index.ts
├── views/
│   ├── editor.vue
│   ├── editPost.vue
│   ├── landing.vue           # published-posts library
│   └── notFound.vue
└── router.ts
└── utils.ts
