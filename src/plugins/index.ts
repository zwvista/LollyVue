/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import router from '../router'
import VueClipboard from 'vue3-clipboard'
import "reflect-metadata";


// Types
import type { App } from 'vue'

export function registerPlugins (app: App) {
  app
    .use(router)
    .use(VueClipboard, {
      autoSetContainer: true,
      appendToBody: true,
    })
}
