/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import router from '../router'
import VueClipboard from 'vue3-clipboard'
import "reflect-metadata";
import { library } from "@fortawesome/fontawesome-svg-core";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fas) // Include needed solid icons
library.add(far) // Include needed regular icons
library.add(fab) // Include needed brand icons

// Types
import type { App } from 'vue'

export function registerPlugins (app: App) {
  app
    .use(router)
    .use(VueClipboard, {
      autoSetContainer: true,
      appendToBody: true,
    })
  app.component('font-awesome-icon', FontAwesomeIcon) // Register component globally
}
