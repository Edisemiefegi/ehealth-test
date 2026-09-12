<template>
  <main class="bg-background vh-100 overflow-y-auto pt-5">
    <Nav />

    <div class="container">
      <!-- Loading state -->
      <div
        v-if="currentPostLoading"
        class="d-flex align-items-center justify-content-center text-muted py-5"
        style="min-height: 60vh"
      >
        Loading post...
      </div>

      <template v-else>
        <div class="row g-4 py-5">
        <!-- Blog editor -->
        <section class="col-12 col-lg-8">
          <div class="editor-scroll">
            <header>
              <AiGenerator
                label="TITLE"
                :error-message="titleAi.errorMessage.value"
                :status="titleAi.status.value"
                :suggestion="titleAi.suggestion.value"
                @generate="titleAi.generate"
                @apply="currentPost.title = $event"
              />
              <Input
                v-model="currentPost.title"
                placeholder="Enter blog title..."
                class="fs-1"
              />
            </header>

            <hr />

            <section>
              <Editor
                v-model="currentPost.content"
                editorStyle="height: 320px"
                placeholder="Start writing..."
              />
            </section>

            <section>
              <AiGenerator
                label="SUMMARY"
                :error-message="summaryAi.errorMessage.value"
                :suggestion="summaryAi.suggestion.value"
                :status="summaryAi.status.value"
                @generate="summaryAi.generate"
                @apply="currentPost.excerpt = $event"
              />
              <Input
                v-model="currentPost.excerpt"
                placeholder="Generate a summary from your current draft."
                class="text-small opacity-75"
              />
            </section>
          </div>
        </section>

        <!-- Sidebar -->
        <aside class="col-12 col-lg-4">
          <div class="sticky-top z-0 pt-5">
            <div class="d-flex flex-column mb-3 gap-3">
              <AiGenerator
                label="KEYWORDS"
                :error-message="keywordsAi.errorMessage.value"
                :suggestion="keywordsAi.suggestion.value"
                :status="keywordsAi.status.value"
                @generate="keywordsAi.generate"
                @apply="currentPost.keywords = $event"
              />

              <div
                class="p-2 d-flex flex-wrap align-content-start gap-2 border rounded-2 keywords-box"
              >
                <div
                  v-for="keyword in currentPost.keywords"
                  :key="keyword"
                  class="rounded-pill px-2 py-1 d-inline-flex align-items-center gap-1 bg-muted text-xxs flex-shrink-0"
                >
                  <span class="text-truncate">
                    {{ keyword }}
                  </span>

                  <Button
                    variant="ghost"
                    size="sm"
                    :aria-label="`Remove ${keyword}`"
                    @click="removeKeyword(keyword)"
                  >
                    <Times />
                  </Button>
                </div>
                <Input
                  v-model="keywordInput"
                  class="text-xs flex-grow-1"
                  placeholder="add keyword..."
                  style="min-width: 6rem"
                  @keydown.enter.prevent="addManualKeyword"
                />
              </div>

              <SuggestionModal
                ref="keywordsPopover"
                :suggestions="keywordsAi.suggestion.value"
                :status="keywordsAi.status.value"
                @retry="keywordsAi.generate"
                @apply="applyKeywords"
              />
            </div>

            <Button class="w-100" @click="previewModal?.open()">Preview</Button>
          </div>
        </aside>
      </div>
      </template>
      <Postpreviewmodal ref="previewModal" :post="currentPost" />
    </div>
  </main>
</template>

<script setup lang="ts">
import { Times } from "@primeicons/vue";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import Nav from "../components/editor/Nav.vue";
import Button from "../components/base/Button.vue";
import Input from "../components/base/Input.vue";
import Editor from "primevue/editor";
import SuggestionModal from "../components/editor/SuggestionModal.vue";
import { useAiSuggestion } from "../composable/useAiGenerator.ts";
import AiGenerator from "../components/editor/AiGenerator.vue";
import { useEditor } from "../composable/useEditor.ts";
import Postpreviewmodal from "../components/blog/Postpreviewmodal.vue";
import {
  generateKeywordSuggestions,
  generateSummarySuggestion,
  generateTitleSuggestion,
} from "../api/ai.ts";

const keywordInput = ref("");
const previewModal = ref();

const route = useRoute();
const { currentPost, currentPostLoading, loadPostById } = useEditor();

// This page is mounted at /editor/:id, so it needs to load whichever post
// that id points to. `immediate: true` covers landing here directly;
// the watcher (rather than a one-off onMounted call) also covers the id
// changing later without a full remount, e.g. switching drafts from the
// "My Drafts" popover while staying on this same route component.
watch(
  () => route.params.id,
  (id) => {
    if (typeof id === "string") loadPostById(id);
  },
  { immediate: true },
);

const titleAi = useAiSuggestion<string>(() =>
  generateTitleSuggestion(currentPost.content),
);

const summaryAi = useAiSuggestion<string>(() =>
  generateSummarySuggestion(currentPost.content),
);

const keywordsAi = useAiSuggestion<string[]>(() =>
  generateKeywordSuggestions(currentPost.content),
);

function applyKeywords(newKeywords: string | string[]) {
  const list = Array.isArray(newKeywords) ? newKeywords : [newKeywords];
  currentPost.keywords = [...new Set([...currentPost.keywords, ...list])];
}

function addKeyword(value: string) {
  const keyword = value.trim();

  if (!keyword) return;

  const alreadyExists = currentPost.keywords.some(
    (item) => item.toLowerCase() === keyword.toLowerCase(),
  );

  if (alreadyExists) return;

  currentPost.keywords.push(keyword);
}

function addManualKeyword() {
  addKeyword(keywordInput.value);
  keywordInput.value = "";
}

function removeKeyword(keyword: string) {
  currentPost.keywords = currentPost.keywords.filter(
    (item) => item !== keyword,
  );
}
</script>

<style lang="scss">
.border-dotted {
  border-style: dotted !important;
}

.editor-scroll {
  padding-bottom: 5rem;
}

.p-editor {
  background: var(--bs-background);
  border: 0 !important;
  box-shadow: none !important;
}

.p-editor-toolbar,
.p-editor-content {
  background: var(--bs-background) !important;
  border: 0 !important;
}

.p-editor-content .ql-editor {
  background: var(--bs-background) !important;
  color: var(--bs-body-color) !important;
}
</style>