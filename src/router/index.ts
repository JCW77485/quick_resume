<<<<<<< HEAD
import { createRouter, createWebHashHistory } from 'vue-router';
=======
import { createRouter, createWebHistory } from 'vue-router';
>>>>>>> origin/main
import Landing from '../pages/Landing.vue';
import Templates from '../pages/Templates.vue';
import Dashboard from '../pages/Dashboard.vue';
import Editor from '../pages/Editor.vue';
<<<<<<< HEAD
import Login from '../pages/Login.vue';
import Pricing from '../pages/Pricing.vue';
import Admin from '../pages/Admin.vue';
import { useAuth } from '../store/auth';

const routes = [
  { path: '/', component: Landing },
  { path: '/login', component: Login },
  { path: '/pricing', component: Pricing },
  { path: '/templates', component: Templates },
  {
    path: '/builder',
    component: Dashboard
  },
  {
    path: '/builder/:id',
    component: Editor
  },
  {
    path: '/admin',
    component: Admin,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
=======

const routes = [
  { path: '/', component: Landing },
  { path: '/templates', component: Templates },
  { path: '/builder', component: Dashboard },
  { path: '/builder/:id', component: Editor },
>>>>>>> origin/main
  { path: '/:pathMatch(.*)*', redirect: '/' }
];

export const router = createRouter({
<<<<<<< HEAD
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
  } else if (to.meta.requiresAdmin && !auth.isAdmin) {
    next('/builder');
  } else if (to.path === '/login' && auth.user) {
    next('/builder');
  } else {
    next();
  }
});
=======
  history: createWebHistory(),
  routes
});
>>>>>>> origin/main
