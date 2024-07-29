<template>
  <q-layout view="hHr LpR lFf">
    <q-layout-header>
      <q-toolbar :inverted="false">
        <q-btn flat round dense icon="menu" @click="showLeft=!showLeft"></q-btn>
        <q-toolbar-title>{{title}}</q-toolbar-title>
        <a href="/">
          <q-btn color="primary" label="1. Veutify"></q-btn>
        </a>
        <a href="/quasar">
          <q-btn color="primary" label="2. Quasar"></q-btn>
        </a>
        <a href="/material">
          <q-btn color="primary" label="3. Material"></q-btn>
        </a>
        <a href="/element">
          <q-btn color="primary" label="4. Element"></q-btn>
        </a>
        <a href="/primevue">
          <q-btn color="primary" label="5. PrimeVUE"></q-btn>
        </a>
      </q-toolbar>
    </q-layout-header>
    <q-layout-drawer side="left" v-model="showLeft">
      <q-list no-border link inset-separator>
        <q-item v-for="item in items" :to="item.path">
          <q-item-side :icon="item.icon"></q-item-side>
          <q-item-main :label="item.title"></q-item-main>
        </q-item>
      </q-list>
    </q-layout-drawer>
    <q-page-container>
      <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" mode="out-in">
        <router-view />
      </transition>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { AppService } from '@/view-models/misc/app.service';
  import { container } from 'tsyringe';

  @Component
  export default class App extends Vue {
    appService = container.resolve(AppService);
    showLeft = true;
    items = [
      {
        icon: 'fa fa-bus fa-lg',
        title: 'Words in Unit',
        path: '/words-unit2',
      },
      {
        icon: 'fa fa-train fa-lg',
        title: 'Phrases in Unit',
        path: '/phrases-unit2',
      },
      {
        icon: 'fa fa-car fa-lg',
        title: 'Words in Textbook',
        path: '/words-textbook2',
      },
      {
        icon: 'fa fa-taxi fa-lg',
        title: 'Phrases in Textbook',
        path: '/phrases-textbook2',
      },
      {
        icon: 'fa fa-plane fa-lg',
        title: 'Words in Language',
        path: '/words-lang2',
      },
      {
        icon: 'fa fa-rocket fa-lg',
        title: 'Phrases in Language',
        path: '/phrases-lang2',
      },
      {
        icon: 'fa fa-motorcycle fa-lg',
        title: 'Patterns in Language',
        path: '/patterns2',
      },
      {
        icon: 'fa fa-cog fa-lg',
        title: 'Settings',
        path: '/settings2',
      },
    ];
    title = 'Lolly Vue';

    constructor() {
      super();
      this.appService.getData();
    }
  }
</script>
