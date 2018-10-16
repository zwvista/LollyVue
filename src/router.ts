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
      name: 'words-unit',
      component: WordsUnit,
    },
    {
      path: '/words-unit',
      name: 'words-unit',
      component: WordsUnit,
    },
    {
      path: '/phrases-unit',
      name: 'phrases-unit',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/PhrasesUnit.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('./views/Settings.vue'),
    },
  ],
});
