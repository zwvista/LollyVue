<template>
  <el-container>
    <el-header>
      Lolly Vue
      <a href="/">
        <el-button type="primary">1. Vuetify</el-button>
      </a>
      <a href="/quasar">
        <el-button type="primary">2. Quasar</el-button>
      </a>
      <a href="/material">
        <el-button type="primary">3. Material</el-button>
      </a>
      <a href="/element">
        <el-button type="primary">4. Element</el-button>
      </a>
      <a href="/primevue">
        <el-button type="primary">5. PrimeVUE</el-button>
      </a>
    </el-header>
    <el-header>
      <el-menu :default-active="activeIndex" mode="horizontal" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
        <el-menu-item v-for="(item, i) in items" :to="item.path" :index="String(i)">
          <router-link :to="item.path">
            <el-icon><font-awesome-icon :icon="item.icon"/></el-icon>{{item.title}}
          </router-link>
        </el-menu-item>
      </el-menu>
    </el-header>
    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
  import "reflect-metadata";
  import { GlobalVars } from '@/common/common';
  import { container } from 'tsyringe';
  import { onMounted, ref } from "vue";
  import { AppService } from "@/view-models/misc/app.service";

  const appService = ref(container.resolve(AppService));
  const activeIndex = ref('0');
  const items = ref([
    {
      icon: 'fa fa-bus fa-lg',
      title: 'Words in Unit',
      path: '/element/words-unit4',
    },
    {
      icon: 'fa fa-train fa-lg',
      title: 'Phrases in Unit',
      path: '/element/phrases-unit4',
    },
    {
      icon: 'fa fa-car fa-lg',
      title: 'Words in Textbook',
      path: '/element/words-textbook4',
    },
    {
      icon: 'fa fa-taxi fa-lg',
      title: 'Phrases in Textbook',
      path: '/element/phrases-textbook4',
    },
    {
      icon: 'fa fa-plane fa-lg',
      title: 'Words in Language',
      path: '/element/words-lang4',
    },
    {
      icon: 'fa fa-rocket fa-lg',
      title: 'Phrases in Language',
      path: '/element/phrases-lang4',
    },
    {
      icon: 'fa fa-motorcycle fa-lg',
      title: 'Patterns in Language',
      path: '/element/patterns4',
    },
    {
      icon: 'fa fa-cog fa-lg',
      title: 'Settings',
      path: '/element/settings',
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
