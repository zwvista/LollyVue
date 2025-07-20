<template>
  <div id="app">
    <Toolbar>
      <template #start>
        {{ title }}
      </template>
      <template #end>
        <a href="/">
          <Button label="1. Veutify" />
        </a>
        <a href="/quasar">
          <Button label="2. Quasar" />
        </a>
        <a href="/material">
          <Button label="3. Material" />
        </a>
        <a href="/element">
          <Button label="4. Element" />
        </a>
        <a href="/primevue">
          <Button label="5. PrimeVUE" />
        </a>
      </template>
    </Toolbar>
    <TabMenu :model="items" />
    <router-view />
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { AppService } from '@/shared/view-models/misc/app.service';
  import { container } from "tsyringe";

  @Component
  export default class App extends Vue {
    appService = container.resolve(AppService);
    items = [
      {
        icon: 'fa fa-bus fa-lg',
        label: 'Words in Unit',
        to: '/words-unit5',
      },
      {
        icon: 'fa fa-train fa-lg',
        label: 'Phrases in Unit',
        to: '/phrases-unit5',
      },
      {
        icon: 'fa fa-car fa-lg',
        label: 'Words in Textbook',
        to: '/words-textbook5',
      },
      {
        icon: 'fa fa-taxi fa-lg',
        label: 'Phrases in Textbook',
        to: '/phrases-textbook5',
      },
      {
        icon: 'fa fa-plane fa-lg',
        label: 'Words in Language',
        to: '/words-lang5',
      },
      {
        icon: 'fa fa-rocket fa-lg',
        label: 'Phrases in Language',
        to: '/phrases-lang5',
      },
      {
        icon: 'fa fa-motorcycle fa-lg',
        label: 'Patterns in Language',
        to: '/patterns5',
      },
      {
        icon: 'fa fa-cog fa-lg',
        label: 'Settings',
        to: '/settings',
      },
    ];
    title = 'Lolly Vue';

    constructor() {
      super();
      this.appService.getData();
    }
  }
</script>
