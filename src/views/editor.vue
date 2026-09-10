<template>
  <main class="bg-background vh-100 overflow-y-auto py-5">
    <Nav />

    <div class="container">
      <!-- Content -->
      <div class="row g-4 py-5">
        <!-- Blog editor -->
        <section class="col-12 col-lg-9">
          <div class="editor-scroll">
            <!-- Title -->
            <header>
              <div class="d-flex align-items-center justify-content-between">
                <p class="text-xs text-muted mb-0">TITLE</p>

                <Button variant="outline" size="sm">
                  <Sparkles />
                  Generate title
                </Button>
              </div>

              <Input class="fs-1" placeholder="Enter blog title..." />
            </header>

            <hr />

            <!-- Editor -->
            <section>
              <Editor
                v-model="content"
                editorStyle="height: 320px"
                placeholder="Start writing..."
              />
            </section>
          </div>
        </section>

        <!-- Sidebar -->
        <aside class="col-12 col-lg-3">
          <div class="sticky-top bg-white p-4 rounded-3 sidebar">
            <!-- Summary -->
            <section class="mb-5">
              <div
                class="d-flex align-items-center justify-content-between mb-3"
              >
                <p class="text-xs text-muted mb-0">SUMMARY</p>

                <Button variant="outline" size="sm">
                  <Sparkles />
                  Generate
                </Button>
              </div>

              <div class="border border-dotted border-secondary rounded-3 p-3">
                <p class="fw-semibold">
                  A clear sense of what this draft is saying.
                </p>

                <p class="text-xxs fw-light mb-0">Results will appear here.</p>
              </div>
            </section>

            <!-- Keywords -->
            <section>
              <div
                class="d-flex align-items-center justify-content-between mb-3"
              >
                <p class="text-xs text-muted mb-0">KEYWORDS</p>

                <Button variant="outline" size="sm">
                  <Sparkles />
                  Generate
                </Button>
              </div>

              <div
                class="border border-dotted border-secondary rounded-3 d-flex align-items-center gap-2 p-3"
              >
                <span class="bg-muted rounded p-2 text-xs"> sense </span>

                <Input placeholder="add.." />
              </div>
            </section>
          </div>
        </aside>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { Sparkles } from "@primeicons/vue";
import Nav from "../components/editor/Nav.vue";
import Button from "../components/base/Button.vue";
import Input from "../components/base/Input.vue";
import Editor from "primevue/editor";
import { ref } from "vue";

const content = ref("");
</script>

<style lang="scss">
.border-dotted {
  border-style: dotted !important;
}

.editor-scroll {
  padding-bottom: 5rem;
}

.sidebar {
  top: 90px;
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
