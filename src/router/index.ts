import { createRouter, createWebHistory } from 'vue-router';
import Landing from '../pages/Landing.vue';
import Templates from '../pages/Templates.vue';
import Dashboard from '../pages/Dashboard.vue';
import Editor from '../pages/Editor.vue';

const routes = [
  { path: '/', component: Landing },
  { path: '/templates', component: Templates },
  { path: '/builder', component: Dashboard },
  { path: '/builder/:id', component: Editor },
  { path: '/:pathMatch(.*)*', redirect: '/' }
];

export const router = createRouter({
  history: createWebHistory(),
  routes
});
