import Vue from 'vue';
import Router from 'vue-router';
import WordsUnit from './views/WordsUnit.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: WordsUnit,
    },
    {
      path: '/words-unit',
      name: 'words-unit',
      component: WordsUnit,
    },
    {
      path: '/words-unit2',
      name: 'words-unit2',
      component: () => import('./views/WordsUnit2.vue'),
    },
    {
      path: '/words-unit3',
      name: 'words-unit3',
      component: () => import('./views/WordsUnit3.vue'),
    },
    {
      path: '/words-unit-detail/:id',
      name: 'words-unit-detail',
      component: () => import('./views/WordsUnitDetail.vue'),
    },
    {
      path: '/words-textbook',
      name: 'words-textbook',
      component: () => import('./views/WordsTextbook.vue'),
    },
    {
      path: '/words-textbook-detail/:id',
      name: 'words-textbook-detail',
      component: () => import('./views/WordsTextbookDetail.vue'),
    },
    {
      path: '/words-lang',
      name: 'words-lang',
      component: () => import('./views/WordsLang.vue'),
    },
    {
      path: '/words-lang-detail/:id',
      name: 'words-lang-detail',
      component: () => import('./views/WordsLangDetail.vue'),
    },
    {
      path: '/phrases-unit',
      name: 'phrases-unit',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('./views/PhrasesUnit.vue'),
    },
    {
      path: '/phrases-unit-detail/:id',
      name: 'phrases-unit-detail',
      component: () => import('./views/PhrasesUnitDetail.vue'),
    },
    {
      path: '/phrases-textbook',
      name: 'phrases-textbook',
      component: () => import('./views/PhrasesTextbook.vue'),
    },
    {
      path: '/phrases-textbook-detail/:id',
      name: 'phrases-textbook-detail',
      component: () => import('./views/PhrasesTextbookDetail.vue'),
    },
    {
      path: '/phrases-lang',
      name: 'phrases-lang',
      component: () => import('./views/PhrasesLang.vue'),
    },
    {
      path: '/phrases-lang-detail/:id',
      name: 'phrases-lang-detail',
      component: () => import('./views/PhrasesLangDetail.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('./views/Settings.vue'),
    },
    {
      path: '/words-dict/:type/:index',
      name: 'words-dict',
      component: () => import('./views/WordsDict.vue'),
    },
  ],
});
