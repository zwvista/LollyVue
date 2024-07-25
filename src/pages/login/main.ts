
// Plugins
import { registerPlugins } from '@/plugins'

// Components
import "reflect-metadata";

// Composables
import { createApp } from 'vue'

import Login from './index.vue';
import { createBootstrap } from 'bootstrap-vue-next'

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

const app = createApp(Login)

registerPlugins(app)
app.use(createBootstrap())

app.mount('#app')
