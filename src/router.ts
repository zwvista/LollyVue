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
      path: '/words-unit-detail/:id',
      name: 'words-unit-detail',
      component: () => import('./views/WordsUnitDetail.vue'),
    },
    {
      path: '/words-dict/:index',
      name: 'words-dict',
      component: () => import('./views/WordsDict.vue'),
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
      path: '/words-dict/:index',
      name: 'words-dict',
      component: () => import('./views/WordsDict.vue'),
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
  ],
});
