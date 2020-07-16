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
      path: '/quasar',
      name: 'home2',
      component: () => import('./views/WordsUnit2.vue'),
    },
    {
      path: '/material',
      name: 'home3',
      component: () => import('./views/WordsUnit3.vue'),
    },
    {
      path: '/element',
      name: 'home4',
      component: () => import('./views/WordsUnit4.vue'),
    },
    {
      path: '/primevue',
      name: 'home5',
      component: () => import('./views/WordsUnit5.vue'),
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
      path: '/words-unit4',
      name: 'words-unit4',
      component: () => import('./views/WordsUnit4.vue'),
    },
    {
      path: '/words-unit5',
      name: 'words-unit5',
      component: () => import('./views/WordsUnit5.vue'),
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
      path: '/words-textbook2',
      name: 'words-textbook2',
      component: () => import('./views/WordsTextbook2.vue'),
    },
    {
      path: '/words-textbook3',
      name: 'words-textbook3',
      component: () => import('./views/WordsTextbook3.vue'),
    },
    {
      path: '/words-textbook4',
      name: 'words-textbook4',
      component: () => import('./views/WordsTextbook4.vue'),
    },
    {
      path: '/words-textbook5',
      name: 'words-textbook5',
      component: () => import('./views/WordsTextbook5.vue'),
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
      path: '/words-lang2',
      name: 'words-lang2',
      component: () => import('./views/WordsLang2.vue'),
    },
    {
      path: '/words-lang3',
      name: 'words-lang3',
      component: () => import('./views/WordsLang3.vue'),
    },
    {
      path: '/words-lang4',
      name: 'words-lang4',
      component: () => import('./views/WordsLang4.vue'),
    },
    {
      path: '/words-lang5',
      name: 'words-lang5',
      component: () => import('./views/WordsLang5.vue'),
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
      path: '/phrases-unit2',
      name: 'phrases-unit2',
      component: () => import('./views/PhrasesUnit2.vue'),
    },
    {
      path: '/phrases-unit3',
      name: 'phrases-unit3',
      component: () => import('./views/PhrasesUnit3.vue'),
    },
    {
      path: '/phrases-unit4',
      name: 'phrases-unit4',
      component: () => import('./views/PhrasesUnit4.vue'),
    },
    {
      path: '/phrases-unit5',
      name: 'phrases-unit5',
      component: () => import('./views/PhrasesUnit5.vue'),
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
      path: '/phrases-textbook2',
      name: 'phrases-textbook2',
      component: () => import('./views/PhrasesTextbook2.vue'),
    },
    {
      path: '/phrases-textbook3',
      name: 'phrases-textbook3',
      component: () => import('./views/PhrasesTextbook3.vue'),
    },
    {
      path: '/phrases-textbook4',
      name: 'phrases-textbook4',
      component: () => import('./views/PhrasesTextbook4.vue'),
    },
    {
      path: '/phrases-textbook5',
      name: 'phrases-textbook5',
      component: () => import('./views/PhrasesTextbook5.vue'),
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
      path: '/phrases-lang2',
      name: 'phrases-lang2',
      component: () => import('./views/PhrasesLang2.vue'),
    },
    {
      path: '/phrases-lang3',
      name: 'phrases-lang3',
      component: () => import('./views/PhrasesLang3.vue'),
    },
    {
      path: '/phrases-lang4',
      name: 'phrases-lang4',
      component: () => import('./views/PhrasesLang4.vue'),
    },
    {
      path: '/phrases-lang5',
      name: 'phrases-lang5',
      component: () => import('./views/PhrasesLang5.vue'),
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
      path: '/settings2',
      name: 'settings2',
      component: () => import('./views/Settings2.vue'),
    },
    {
      path: '/words-dict/:type/:index',
      name: 'words-dict',
      component: () => import('./views/WordsDict.vue'),
    },
  ],
});
