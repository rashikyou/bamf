/* eslint-disable */
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Dropzone from "@/components/Dropzone/index.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Dropzone1",
    component: Dropzone
  },
  {
    path: "/reader",
    name: "Dropzone2",
    component: Dropzone
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
