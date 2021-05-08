import Vue from 'vue';
import Router from 'vue-router';
import WordsUnit from './views/words/WordsUnit.vue';
import { GlobalVars } from '@/common/common';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: WordsUnit,
    },
    {
      path: '/quasar',
      name: 'home2',
      component: () => import('./views/words/WordsUnit2.vue'),
    },
    {
      path: '/material',
      name: 'home3',
      component: () => import('./views/words/WordsUnit3.vue'),
    },
    {
      path: '/element',
      name: 'home4',
      component: () => import('./views/words/WordsUnit4.vue'),
    },
    {
      path: '/primevue',
      name: 'home5',
      component: () => import('./views/words/WordsUnit5.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./pages/login/Login.vue'),
    },
    {
      path: '/words-unit',
      name: 'words-unit',
      component: WordsUnit,
    },
    {
      path: '/words-unit2',
      name: 'words-unit2',
      component: () => import('./views/words/WordsUnit2.vue'),
    },
    {
      path: '/words-unit3',
      name: 'words-unit3',
      component: () => import('./views/words/WordsUnit3.vue'),
    },
    {
      path: '/words-unit4',
      name: 'words-unit4',
      component: () => import('./views/words/WordsUnit4.vue'),
    },
    {
      path: '/words-unit5',
      name: 'words-unit5',
      component: () => import('./views/words/WordsUnit5.vue'),
    },
    {
      path: '/words-unit-detail/:id',
      name: 'words-unit-detail',
      component: () => import('./views/words/WordsUnitDetail.vue'),
    },
    {
      path: '/words-textbook',
      name: 'words-textbook',
      component: () => import('./views/words/WordsTextbook.vue'),
    },
    {
      path: '/words-textbook2',
      name: 'words-textbook2',
      component: () => import('./views/words/WordsTextbook2.vue'),
    },
    {
      path: '/words-textbook3',
      name: 'words-textbook3',
      component: () => import('./views/words/WordsTextbook3.vue'),
    },
    {
      path: '/words-textbook4',
      name: 'words-textbook4',
      component: () => import('./views/words/WordsTextbook4.vue'),
    },
    {
      path: '/words-textbook5',
      name: 'words-textbook5',
      component: () => import('./views/words/WordsTextbook5.vue'),
    },
    {
      path: '/words-textbook-detail/:id',
      name: 'words-textbook-detail',
      component: () => import('./views/words/WordsTextbookDetail.vue'),
    },
    {
      path: '/words-lang',
      name: 'words-lang',
      component: () => import('./views/words/WordsLang.vue'),
    },
    {
      path: '/words-lang2',
      name: 'words-lang2',
      component: () => import('./views/words/WordsLang2.vue'),
    },
    {
      path: '/words-lang3',
      name: 'words-lang3',
      component: () => import('./views/words/WordsLang3.vue'),
    },
    {
      path: '/words-lang4',
      name: 'words-lang4',
      component: () => import('./views/words/WordsLang4.vue'),
    },
    {
      path: '/words-lang5',
      name: 'words-lang5',
      component: () => import('./views/words/WordsLang5.vue'),
    },
    {
      path: '/words-lang-detail/:id',
      name: 'words-lang-detail',
      component: () => import('./views/words/WordsLangDetail.vue'),
    },
    {
      path: '/phrases-unit',
      name: 'phrases-unit',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('./views/phrases/PhrasesUnit.vue'),
    },
    {
      path: '/phrases-unit2',
      name: 'phrases-unit2',
      component: () => import('./views/phrases/PhrasesUnit2.vue'),
    },
    {
      path: '/phrases-unit3',
      name: 'phrases-unit3',
      component: () => import('./views/phrases/PhrasesUnit3.vue'),
    },
    {
      path: '/phrases-unit4',
      name: 'phrases-unit4',
      component: () => import('./views/phrases/PhrasesUnit4.vue'),
    },
    {
      path: '/phrases-unit5',
      name: 'phrases-unit5',
      component: () => import('./views/phrases/PhrasesUnit5.vue'),
    },
    {
      path: '/phrases-unit-detail/:id',
      name: 'phrases-unit-detail',
      component: () => import('./views/phrases/PhrasesUnitDetail.vue'),
    },
    {
      path: '/phrases-textbook',
      name: 'phrases-textbook',
      component: () => import('./views/phrases/PhrasesTextbook.vue'),
    },
    {
      path: '/phrases-textbook2',
      name: 'phrases-textbook2',
      component: () => import('./views/phrases/PhrasesTextbook2.vue'),
    },
    {
      path: '/phrases-textbook3',
      name: 'phrases-textbook3',
      component: () => import('./views/phrases/PhrasesTextbook3.vue'),
    },
    {
      path: '/phrases-textbook4',
      name: 'phrases-textbook4',
      component: () => import('./views/phrases/PhrasesTextbook4.vue'),
    },
    {
      path: '/phrases-textbook5',
      name: 'phrases-textbook5',
      component: () => import('./views/phrases/PhrasesTextbook5.vue'),
    },
    {
      path: '/phrases-textbook-detail/:id',
      name: 'phrases-textbook-detail',
      component: () => import('./views/phrases/PhrasesTextbookDetail.vue'),
    },
    {
      path: '/phrases-lang',
      name: 'phrases-lang',
      component: () => import('./views/phrases/PhrasesLang.vue'),
    },
    {
      path: '/phrases-lang2',
      name: 'phrases-lang2',
      component: () => import('./views/phrases/PhrasesLang2.vue'),
    },
    {
      path: '/phrases-lang3',
      name: 'phrases-lang3',
      component: () => import('./views/phrases/PhrasesLang3.vue'),
    },
    {
      path: '/phrases-lang4',
      name: 'phrases-lang4',
      component: () => import('./views/phrases/PhrasesLang4.vue'),
    },
    {
      path: '/phrases-lang5',
      name: 'phrases-lang5',
      component: () => import('./views/phrases/PhrasesLang5.vue'),
    },
    {
      path: '/phrases-lang-detail/:id',
      name: 'phrases-lang-detail',
      component: () => import('./views/phrases/PhrasesLangDetail.vue'),
    },
    {
      path: '/patterns',
      name: 'patterns',
      component: () => import('./views/patterns/Patterns.vue'),
    },
    {
      path: '/patterns2',
      name: 'patterns2',
      component: () => import('./views/patterns/Patterns2.vue'),
    },
    {
      path: '/patterns3',
      name: 'patterns3',
      component: () => import('./views/patterns/Patterns3.vue'),
    },
    {
      path: '/patterns4',
      name: 'patterns4',
      component: () => import('./views/patterns/Patterns4.vue'),
    },
    {
      path: '/patterns5',
      name: 'patterns5',
      component: () => import('./views/patterns/Patterns5.vue'),
    },
    {
      path: '/patterns-detail/:id',
      name: 'patterns-detail',
      component: () => import('./views/patterns/PatternsDetail.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('./views/misc/Settings.vue'),
    },
    {
      path: '/settings2',
      name: 'settings2',
      component: () => import('./views/misc/Settings2.vue'),
    },
    {
      path: '/words-dict/:type/:index',
      name: 'words-dict',
      component: () => import('./views/misc/WordsDict.vue'),
    },
  ],
});

// https://jasonwatmore.com/post/2018/07/14/vue-vuex-user-registration-and-login-tutorial-example
router.beforeEach((to, from, next) => {
  const publicPages = ['/login'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('userid');

  if (authRequired && !loggedIn)
    window.location.href = '/login';
  else
    GlobalVars.userid = loggedIn!;
  return next();
});

export default router;
