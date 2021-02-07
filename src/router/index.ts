/* eslint-disable */
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Dropzone from "@/components/Dropzone/index.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Dropzone",
    component: Dropzone
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
