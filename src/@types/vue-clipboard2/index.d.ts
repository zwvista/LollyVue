declare module 'vue-clipboard2' {
  import { PluginFunction, PluginObject } from 'vue';

  export class VueClipboardConfig {
    autoSetContainer: boolean;
  }

  export class VueClipboard implements PluginObject<{}> {
    install: PluginFunction<{}>;
    config: VueClipboardConfig;
  }

  const VuePlugin: VueClipboard;

  export default VuePlugin;

}

