import 'core-js/stable';
import 'regenerator-runtime/runtime';
import Vue from 'vue';
import '@/plugins/plugin-quasar';
import '@/plugins/plugin-vue-typescript-inject';
import '@/plugins/plugin-vue-clipboard2';
import App from './App.vue';
import router from '@/router';
import store from '@/store';
import '@/registerServiceWorker';

import 'font-awesome/css/font-awesome.min.css';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
