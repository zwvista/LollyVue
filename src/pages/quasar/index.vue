<template>
  <q-layout view="hHr LpR lFf">
    <q-header>
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
    </q-header>
    <q-drawer side="left" v-model="showLeft">
      <q-list no-border link inset-separator>
        <q-item v-for="item in items" :to="item.path">
          <q-item-section avatar>
            <q-icon :name="item.icon" />
          </q-item-section>
          <q-item-section>
            {{item.title}}
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>
    <q-page-container>
      <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" mode="out-in">
        <router-view />
      </transition>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
  import "reflect-metadata";
  import { GlobalVars } from '@/common/common';
  import { container } from 'tsyringe';
  import { onMounted, ref } from "vue";
  import { AppService } from "@/view-models/misc/app.service";

  const appService = ref(container.resolve(AppService));
  const showLeft = ref(true);
  const items = ref([
    {
      icon: 'fa fa-bus fa-lg',
      title: 'Words in Unit',
      path: '/quasar/words-unit2',
    },
    {
      icon: 'fa fa-train fa-lg',
      title: 'Phrases in Unit',
      path: '/quasar/phrases-unit2',
    },
    {
      icon: 'fa fa-car fa-lg',
      title: 'Words in Textbook',
      path: '/quasar/words-textbook2',
    },
    {
      icon: 'fa fa-taxi fa-lg',
      title: 'Phrases in Textbook',
      path: '/quasar/phrases-textbook2',
    },
    {
      icon: 'fa fa-plane fa-lg',
      title: 'Words in Language',
      path: '/quasar/words-lang2',
    },
    {
      icon: 'fa fa-rocket fa-lg',
      title: 'Phrases in Language',
      path: '/quasar/phrases-lang2',
    },
    {
      icon: 'fa fa-motorcycle fa-lg',
      title: 'Patterns in Language',
      path: '/quasar/patterns2',
    },
    {
      icon: 'fa fa-cog fa-lg',
      title: 'Settings',
      path: '/settings',
    },
  ]);
  const title = ref('Lolly Vue');
  onMounted(() => {
    GlobalVars.userid = localStorage.getItem('userid');
    appService.value.getData();
  });
</script>

<style>

</style>
