import '@babel/polyfill';
import Vue from 'vue';
import '@/plugins/plugin-vuetify';
import '@/plugins/plugin-material';
import '@/plugins/plugin-vue-typescript-inject';
import '@/plugins/plugin-bootstrap-vue';
import '@/plugins/plugin-vue-clipboard2';
import App from './App.vue';
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
  render: (h) => h(App),
}).$mount('#app');
