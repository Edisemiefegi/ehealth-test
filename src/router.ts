import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Blog",
    component: () => import("./views/landing.vue"),
  },
  {
    path: "/editor",
    name: "Editor",
    component: () => import("./views/editor.vue"),
  },
  
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
