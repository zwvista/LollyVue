
// Plugins
import { registerPlugins } from '@/plugins'

// Components
import "reflect-metadata";

// Composables
import { createApp } from 'vue'

import App from './index.vue';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Dialog from 'primevue/dialog';
import FloatLabel from 'primevue/floatlabel';
import InputText from 'primevue/inputtext';
import Paginator from 'primevue/paginator';
import Select from 'primevue/select';
import TabMenu from 'primevue/tabmenu';
import Toolbar from 'primevue/toolbar';
import Tooltip from 'primevue/tooltip';

const app = createApp(App)
app.component('Button', Button);
app.component('Card', Card);
app.component('Column', Column);
app.component('DataTable', DataTable);
app.component('Dialog', Dialog);
app.component('FloatLabel', FloatLabel);
app.component('InputText', InputText);
app.component('Paginator', Paginator);
app.component('Select', Select);
app.component('TabMenu', TabMenu);
app.component('Toolbar', Toolbar);
app.directive('tooltip2', Tooltip);

registerPlugins(app)
app.use(PrimeVue, {
  theme: {
    preset: Aura
  }
})

app.mount('#app')
