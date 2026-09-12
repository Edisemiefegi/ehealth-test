<template>
  <main class="min-vh-100 bg-background">
    <Nav :hide="true" />

    <div class="container pt-5 pb-5" style="padding-top: 100px !important">
      <!-- Header -->
      <div
        class="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-5"
      >
        <div>
          <p class="text-uppercase text-xxs fw-semibold text-muted mb-2">
            Writing workspace
          </p>

          <h1 class="display-6 fw-semibold mb-2">
            What do you want to write today?
          </h1>

          <p class="text-muted mb-0">
            Create, refine, and publish your next blog post.
          </p>
        </div>
      </div>

      <!-- Start writing -->
      <section class="bg-white border rounded-4 p-4 p-md-5 mb-5">
        <div class="row align-items-center">
          <div class="col-lg-8">
            <div
              class="d-flex align-items-center justify-content-center bg-secondary-subtle rounded-3"
              style="width: 44px; height: 44px"
            >
              <Pencil class="text-secondary" />
            </div>

            <h2 class="h4 fw-semibold mt-4 mb-2">Start with a blank page</h2>

            <p class="text-muted mb-4 mb-lg-0">
              Put your ideas into words and use AI to help you shape them into
              something worth publishing.
            </p>
          </div>

          <div class="col-lg-4 text-lg-end">
            <Button variant="outline" @click="createPost">
              Start writing
              <ArrowRight />
            </Button>
          </div>
        </div>
      </section>

      <!-- Drafts -->
      <section>
        <div class="d-flex justify-content-between align-items-end mb-3">
          <div>
            <h2 class="h6 fw-semibold mb-1">Recent drafts</h2>

            <p class="text-xxs text-muted mb-0">
              Continue working on something you started.
            </p>
          </div>

          <span class="text-xxs text-muted">
            {{ drafts.length }} {{ drafts.length === 1 ? "draft" : "drafts" }}
          </span>
        </div>

        <!-- Draft list -->
        <div v-if="drafts.length" class="row g-3">
          <div
            v-for="draft in drafts"
            :key="draft.post_id"
            class="col-12 col-md-6 col-lg-4"
          >
            <div class="bg-white border rounded-3 p-3 w-100 text-start">
              <div class="d-flex justify-content-between">
                <div
                  class="d-flex align-items-center justify-content-center bg-light rounded-2"
                  style="width: 36px; height: 36px"
                >
                  <FileEdit class="text-secondary" />
                </div>
                <div class="d-flex gap-2 align-items-center">
                  <Button @click.stop="handleDelete(draft)" variant="ghost">
                    <Trash style="color: red" class="fw-bold" />
                  </Button>

                  <Button @click="openDraft" variant="ghost">
                    <ArrowRight />
                  </Button>
                </div>
              </div>

              <p class="fw-semibold text-sm mb-0 text-truncate">
                {{ draft.title || "Untitled draft" }}
              </p>

              <p class="text-xxs text-muted mb-0">
                Last edited {{ formatRelativeDate(draft.updated_at) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else class="bg-white border rounded-3 text-center py-5 px-3">
          <div
            class="d-flex align-items-center justify-content-center bg-light rounded-circle mx-auto mb-3"
            style="width: 44px; height: 44px"
          >
            <i class="pi pi-file text-muted"></i>
          </div>

          <p class="text-sm fw-semibold mb-1">No drafts yet</p>

          <p class="text-xxs text-muted mb-0">
            Your unfinished posts will appear here.
          </p>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";

import Nav from "../components/editor/Nav.vue";
import Button from "../components/base/Button.vue";
import { useEditor } from "../composable/useEditor";
import type { Post } from "../types";
import { formatRelativeDate } from "../utils";
import { ArrowRight, FileEdit, Pencil, Trash } from "@primeicons/vue";

const router = useRouter();

const { drafts, refreshDrafts, createNewPost, deleteDraft } = useEditor();

onMounted(refreshDrafts);

async function createPost() {
  const postId = await createNewPost();

  if (!postId) return;

  await router.push({
    name: "EditPost",
    params: {
      id: postId,
    },
  });
}

function openDraft(post: Post) {
  router.push({
    name: "EditPost",
    params: {
      id: post.post_id,
    },
  });
}

async function handleDelete(post: Post) {
  console.log(post, "shshs");

  const confirmed = window.confirm(
    `Delete "${post.title || "Untitled draft"}"?`,
  );

  if (!confirmed) return;

  await deleteDraft(post.post_id);

  console.log(post, "shshsafatt");
}
</script>

<style scoped scss></style>
