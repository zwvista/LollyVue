/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './index.vue'
import "reflect-metadata";
import vuetify from '../../plugins/vuetify'

// Composables
import { createApp } from 'vue'

const app = createApp(App)


registerPlugins(app)
app.use(vuetify);

app.mount('#app')
