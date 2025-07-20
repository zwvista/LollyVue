/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'
import { routes } from 'vue-router/auto-routes'
import { GlobalVars } from "@/shared/common/common";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // routes,
  routes: [
    ...routes,
    {
      path: '/',
      redirect: { path: "/vuetify/words-unit" }
    },
    {
      path: '/vuetify/',
      redirect: { path: "/vuetify/words-unit" },
    },
    {
      path: '/quasar/',
      redirect: { path: "/quasar/words-unit2" }
    },
    {
      path: '/element/',
      redirect: { path: "/element/words-unit4" }
    },
    {
      path: '/primevue/',
      redirect: { path: "/primevue/words-unit5" }
    },
  ]
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

// https://jasonwatmore.com/post/2018/07/14/vue-vuex-user-registration-and-login-tutorial-example
router.beforeEach((to, from, next) => {
  const publicPages = ['/login'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('userid');

  if (authRequired && !loggedIn)
    window.location.href = 'login';
  else
    GlobalVars.userid = loggedIn!;
  return next();
});

export default router
