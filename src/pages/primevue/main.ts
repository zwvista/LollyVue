import 'core-js/stable';
import 'regenerator-runtime/runtime';
import Vue from 'vue';
import '@/plugins/plugin-primevue';
import '@/plugins/plugin-vue-typescript-inject';
import '@/plugins/plugin-bootstrap-vue';
import '@/plugins/plugin-vue-clipboard2';
import App from './App.vue';
import router from '@/router';
import store from '@/store';
import '@/registerServiceWorker';

import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'font-awesome/css/font-awesome.min.css';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
