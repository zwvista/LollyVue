<template>
  <v-app>
    <v-navigation-drawer
      persistent
      :mini-variant="miniVariant"
      :clipped="clipped"
      v-model="drawer"
      enable-resize-watcher
      fixed
      app
    >
      <v-list>
        <v-list-item
          value="true"
          v-for="(item, i) in items"
          :key="i"
          :to="{path: item.path}"
        >
          <v-list-item-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      app
      :clipped-left="clipped"
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>
      </v-btn>
      <v-btn icon @click.stop="clipped = !clipped">
        <v-icon>web</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <a href="/">
        <v-btn color="info">1. Veutify</v-btn>
      </a>
      <a href="/quasar">
        <v-btn color="info">2. Quasar</v-btn>
      </a>
      <a href="/material">
        <v-btn color="info">3. Material</v-btn>
      </a>
      <a href="/element">
        <v-btn color="info">4. Element</v-btn>
      </a>
      <a href="/primevue">
        <v-btn color="info">5. PrimeVUE</v-btn>
      </a>
    </v-app-bar>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { AppService } from '@/shared/view-models/misc/app.service';
  import { container } from "tsyringe";

  @Component
  export default class App extends Vue {
    appService = container.resolve(AppService);
    clipped = true;
    drawer = true;
    items = [
      {
        icon: 'fa-bus fa-lg',
        title: 'Words in Unit',
        path: '/words-unit',
      },
      {
        icon: 'fa-train fa-lg',
        title: 'Phrases in Unit',
        path: '/phrases-unit',
      },
      {
        icon: 'fa-car fa-lg',
        title: 'Words in Textbook',
        path: '/words-textbook',
      },
      {
        icon: 'fa-taxi fa-lg',
        title: 'Phrases in Textbook',
        path: '/phrases-textbook',
      },
      {
        icon: 'fa-plane fa-lg',
        title: 'Words in Language',
        path: '/words-lang',
      },
      {
        icon: 'fa-rocket fa-lg',
        title: 'Phrases in Language',
        path: '/phrases-lang',
      },
      {
        icon: 'fa-motorcycle fa-lg',
        title: 'Patterns in Language',
        path: '/patterns',
      },
      {
        icon: 'fa-cog fa-lg',
        title: 'Settings',
        path: '/settings',
      },
    ];
    miniVariant = false;
    title = 'Lolly Vue';

    constructor() {
      super();
      this.appService.getData();
    }
  }
</script>
