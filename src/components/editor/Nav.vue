<template>
  <header class="border-bottom fixed-top bg-white">
    <nav
      class="container py-2 d-flex align-items-center justify-content-between"
    >
      <!--  Links -->
      <div class="d-flex align-items-center gap-3">
        <div v-if="isEditor && !hide">
          <RouterLink to="/editor"><AngleLeft /></RouterLink>
        </div>

        <Button
          v-if="isEditor"
          @click="toggle"
          variant="secondary"
          size="sm"
          class="text-white opacity-75"
        >
          My Drafts
        </Button>
        <DraftPopOver ref="draftPopover" />
      </div>

      <div class="d-flex align-items-center gap-2 justify-content-center">
        <!-- Actions -->
        <div class="d-flex align-items-center gap-2">
          <Button
            @click="navigate"
            variant="ghost"
            size="sm"
            class="text-muted"
            >{{ isEditor ? "All posts" : "Editor" }}</Button
          >
          <div class="d-flex align-items-center gap-2" v-if="isEditor && !hide">
            <Button
              size="sm"
              variant="outline"
              :disabled="currentPost.saveState === 'saving'"
              @click="onSaveDraft"
            >
              {{ currentPost.saveState === "saving" ? "Saving..." : "Draft" }}
            </Button>

            <Button
              size="sm"
              :disabled="currentPost.saveState === 'saving'"
              @click="onPublish"
            >
              {{
                currentPost.status === "published" ? "Published" : "Publish"
              }}</Button
            >
          </div>
        </div>

        <!--  Profile -->
        <span
          class="bg-secondary rounded-circle d-inline-flex align-items-center justify-content-center text-white opacity-50 profile-avatar"
        >
          AE
        </span>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import Button from "../base/Button.vue";
import { ref } from "vue";
import DraftPopOver from "./DraftPopOver.vue";
import { useRouter } from "vue-router";

import { useToast } from "primevue/usetoast";
import { useEditor } from "../../composable/useEditor.ts";
import { AngleLeft } from "@primeicons/vue";
const router = useRouter();

const toast = useToast();

const draftPopover = ref();

const props = withDefaults(
  defineProps<{ isEditor?: boolean; hide?: boolean }>(),
  { isEditor: true, hide: false },
);

const emit = defineEmits<{
  createEditor: [];
}>();

function navigate() {
  if (props.isEditor) {
    router.push("/");
    return;
  } else {
    router.push("/editor");
  }
}

const toggle = (event: MouseEvent) => {
  draftPopover.value.toggle(event);
};

const { currentPost, saveCurrentDraft, publishCurrentPost, refreshDrafts } =
  useEditor();

async function onSaveDraft() {
  try {
    await saveCurrentDraft();
    toast.add({ severity: "success", summary: "Draft saved.", life: 3000 });

    if (currentPost.saveState !== "error") await refreshDrafts();
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Something went wrong",
      life: 3000,
    });
  }
}

async function onPublish() {
  try {
    const published = await publishCurrentPost();
    if (!published) {
      toast.add({
        severity: "warn",
        summary: "Cannot publish",
        detail: "Please add a title and content before publishing.",
        life: 3000,
      });
      return;
    }
    toast.add({ severity: "success", summary: "Post Published.", life: 3000 });

    if (currentPost.saveState !== "error") await refreshDrafts();
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Something went wrong",
      life: 3000,
    });
  }
}
</script>

<style scoped lang="scss">
.profile-avatar {
  width: 36px;
  height: 36px;
  font-size: 0.75rem;
  flex-shrink: 0;
}
</style>
