<template>
  <header class="border-bottom fixed-top bg-white">
    <nav
      class="container py-2 d-flex align-items-center justify-content-between"
    >
      <!--  Links -->
      <div class="d-flex align-items-center gap-3">
        <RouterLink to="/"> <AngleLeft /></RouterLink>
        <Button variant="secondary" size="sm" class="text-white opacity-75">
          My Drafts
        </Button>
      </div>

      <div class="d-flex align-items-center gap-2 justify-content-center">
        <!-- Actions -->
        <div class="d-flex align-items-center gap-2">
          <Button size="sm" variant="outline"> Draft </Button>

          <Button size="sm"> Publish </Button>
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
import { AngleLeft } from "@primeicons/vue";
import Button from "../base/Button.vue";
</script>

<style scoped lang="scss">
.profile-avatar {
  width: 36px;
  height: 36px;
  font-size: 0.75rem;
  flex-shrink: 0;
}
</style>
