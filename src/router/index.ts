import { createRouter, createWebHashHistory } from 'vue-router';
import Landing from '../pages/Landing.vue';
import Templates from '../pages/Templates.vue';
import Dashboard from '../pages/Dashboard.vue';
import Editor from '../pages/Editor.vue';
import Login from '../pages/Login.vue';
import Pricing from '../pages/Pricing.vue';
import { useAuth } from '../store/auth';

const routes = [
  { path: '/', component: Landing },
  { path: '/login', component: Login },
  { path: '/pricing', component: Pricing },
  { path: '/templates', component: Templates },
  {
    path: '/builder',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/builder/:id',
    component: Editor,
    meta: { requiresAuth: true }
  },
  { path: '/:pathMatch(.*)*', redirect: '/' }
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes
});

router.beforeEach(async (to, _from, next) => {
  const auth = useAuth();
  if (!auth.initialized) {
    await auth.init();
  }

  if (to.meta.requiresAuth && !auth.user) {
    next('/login');
  } else if (to.path === '/login' && auth.user) {
    next('/builder');
  } else {
    next();
  }
});
