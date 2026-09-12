<template>
  <header class="border-bottom fixed-top bg-white">
    <nav
      class="container py-2 d-flex align-items-center justify-content-between"
    >
      <!--  Links -->
      <div class="d-flex align-items-center gap-3">
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
          <div class="d-flex align-items-center gap-2" v-if="isEditor">
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
const router = useRouter();

const toast = useToast();

const draftPopover = ref();

const props = withDefaults(defineProps<{ isEditor?: boolean }>(), { isEditor: true });

const emit = defineEmits<{
  "createEditor": [];
}>();

function navigate() {
  if (props.isEditor) {
    router.push("/");
    return;
  }

  emit("createEditor");
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
    await publishCurrentPost();
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
