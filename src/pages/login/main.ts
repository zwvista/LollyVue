import 'core-js/stable';
import 'regenerator-runtime/runtime';
import Vue from 'vue';
import "reflect-metadata";
import '@/plugins/plugin-bootstrap-vue';
import Login from './Login.vue';
import router from '@/router';
import store from '@/store';
import '@/registerServiceWorker';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'font-awesome/css/font-awesome.min.css';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(Login),
}).$mount('#app');
