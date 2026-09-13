<script setup lang="ts">
import Button from "../components/base/Button.vue";
</script>

<template>
  <div
    class="min-vh-100 d-flex align-items-center justify-content-center bg-light px-3"
  >
    <div class="text-center d-flex flex-column " style="max-width: 520px">
      <p class="fw-semibold text-secondary mb-2">404</p>

      <h1 class="display-4 fw-bold text-dark mb-3">Page not found</h1>

      <p class="text-muted mb-4">
        Looks like this page took a little detour. The page you're looking for
        doesn't exist or may have been moved.
      </p>

      <Button>
        <RouterLink to="/" class="text-white">Go to Blog</RouterLink>
      </Button>
    </div>
  </div>
</template>
