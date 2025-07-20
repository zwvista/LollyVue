<template>
  <div class="page-container">
    <md-app md-mode="reveal">
      <md-app-toolbar class="md-primary">
        <md-button class="md-icon-button" @click="menuVisible = !menuVisible">
          <md-icon>menu</md-icon>
        </md-button>
        <span class="md-title" style="flex: 1">{{title}}</span>
        <a href="/">
          <md-button class="md-raised md-primary">1. Vuetify</md-button>
        </a>
        <a href="/quasar">
          <md-button class="md-raised md-primary">2. Quasar</md-button>
        </a>
        <a href="/material">
          <md-button class="md-raised md-primary">3. Material</md-button>
        </a>
        <a href="/element">
          <md-button class="md-raised md-primary">4. Element</md-button>
        </a>
        <a href="/primevue">
          <md-button class="md-raised md-primary">5. PrimeVUE</md-button>
        </a>
      </md-app-toolbar>
      <md-app-drawer :md-active.sync="menuVisible">
        <md-list>
          <md-list-item v-for="item in items" @click="menuVisible = false; $router.push(item.path);">
            <md-icon :class="item.icon"></md-icon>
            <span class="md-list-item-text">{{item.title}}</span>
          </md-list-item>
        </md-list>
      </md-app-drawer>
      <md-app-content>
        <router-view />
      </md-app-content>
    </md-app>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { AppService } from '@/shared/view-models/misc/app.service';
  import { container } from "tsyringe";

  @Component
  export default class App extends Vue {
    appService = container.resolve(AppService);
    menuVisible = false;
    items = [
      {
        icon: 'fa fa-bus fa-lg',
        title: 'Words in Unit',
        path: '/words-unit3',
      },
      {
        icon: 'fa fa-train fa-lg',
        title: 'Phrases in Unit',
        path: '/phrases-unit3',
      },
      {
        icon: 'fa fa-car fa-lg',
        title: 'Words in Textbook',
        path: '/words-textbook3',
      },
      {
        icon: 'fa fa-taxi fa-lg',
        title: 'Phrases in Textbook',
        path: '/phrases-textbook3',
      },
      {
        icon: 'fa fa-plane fa-lg',
        title: 'Words in Language',
        path: '/words-lang3',
      },
      {
        icon: 'fa fa-rocket fa-lg',
        title: 'Phrases in Language',
        path: '/phrases-lang3',
      },
      {
        icon: 'fa fa-motorcycle fa-lg',
        title: 'Patterns in Language',
        path: '/patterns3',
      },
      {
        icon: 'fa fa-cog fa-lg',
        title: 'Settings',
        path: '/settings',
      },
    ];
    title = 'Lolly Vue';

    constructor() {
      super();
      this.appService.getData();
    }
  }
</script>

<style lang="scss" scoped>
  .md-app {
    min-height: 1000px;
    border: 1px solid rgba(#000, .12);
  }

  // Demo purposes only
  .md-drawer {
    width: 230px;
    max-width: calc(100vw - 125px);
  }

</style>
