
// Plugins
import { registerPlugins } from '@/plugins'

// Components
import "reflect-metadata";

// Composables
import { createApp } from 'vue'

import App from './index.vue';
import { Quasar } from 'quasar'
// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

const app = createApp(App)

registerPlugins(app)
app.use(Quasar, {
  plugins: {}, // import Quasar plugins and add here
})

app.mount('#app')
