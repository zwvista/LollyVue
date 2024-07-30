
// Plugins
import { registerPlugins } from '@/plugins'

// Components
import "reflect-metadata";

// Composables
import { createApp } from 'vue'

import App from './index.vue';
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/index.css'

const app = createApp(App)

registerPlugins(app)
app.use(ElementPlus)

app.mount('#app')
