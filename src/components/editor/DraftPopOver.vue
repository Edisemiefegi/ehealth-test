<template>
  <Popover ref="popover" class="" style="z-index:9998;">
    <div class="p-2 overflow-y-auto" style="width: 300px; max-height: 400px;" >
      <div v-if="draftsLoading" class="px-2 py-4 text-center">
        <Spinner/>
      </div>

      <div v-else class="d-flex flex-column gap-1">
        <button
          v-for="draft in drafts"
          :key="draft.post_id"
          type="button"
          class="draft-item btn w-100 text-start border-0 rounded-3 p-2"
          :class="{
            'bg-secondary-subtle': draft.post_id === currentPost.postId,
          }"
          @click="selectDraft(draft)"
        >
          <div class="d-flex align-items-center gap-2">
            <span
              class="bg-light text-secondary rounded-2 d-flex align-items-center justify-content-center flex-shrink-0 draft-icon"
            >
              <File />
            </span>

            <div class="min-w-0 overflow-hidden">
              <p class="fw-semibold text-xs mb-1 text-truncate">
                {{ draft.title || "Untitled draft" }}
              </p>

              <p class="text-xxs fw-light text-muted mb-0">
                Last edited {{ formatRelativeDate(draft.updated_at) }}
              </p>
            </div>
          </div>
        </button>
      </div>

      <!-- Empty state -->
      <div v-if="!drafts.length" class="px-2 py-3">
        <span class="text-xs text-muted"> No drafts yet. </span>
      </div>
    </div>
  </Popover>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import Popover from "primevue/popover";
import { File } from "@primeicons/vue";
import type { Post } from "../../types";
import { getAiSuggestion } from "../../api/mockApi";
import { formatRelativeDate } from "../../utils";
import { useEditor } from "../../composable/useEditor";
import Spinner from "../base/Spinner.vue";
import { useRoute, useRouter } from "vue-router";

const popover = ref();
const { drafts, draftsLoading, refreshDrafts, currentPost, loadDraft } =
  useEditor();

onMounted(refreshDrafts);
const router = useRouter();
const route = useRoute();

const toggle = async (event: MouseEvent) => {
  popover.value.toggle(event);
};

defineExpose({
  toggle,
});

async function selectDraft(post: Post) {
  const suggestion = post.ai_suggestion_id
    ? await getAiSuggestion(post.ai_suggestion_id)
    : undefined;

    console.log(route.path, 'shhs', post.post_id);

    await router.push({
    name: "EditPost",
    params: {
      id: post.post_id,
    },
  });


  loadDraft(post, suggestion?.keywords ?? []);
  popover.value?.hide();
}
</script>

<style scoped lang="scss">
.draft-item:hover {
  background-color: #fbf9f9;
}

.draft-icon {
  width: 32px;
  height: 32px;
}
</style>
