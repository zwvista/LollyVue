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
        <el-menu-item v-for="(item, i) in items" :to="item.path" :index="i">
          <router-link :to="item.path">
            <i :class="item.icon"></i>{{item.title}}
          </router-link>
        </el-menu-item>
      </el-menu>
    </el-header>
    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { AppService } from '@/view-models/misc/app.service';
  import { container } from "tsyringe";

  @Component
  export default class App extends Vue {
    appService = container.resolve(AppService);
    activeIndex = 0;
    items = [
      {
        icon: 'fa fa-bus fa-lg',
        title: 'Words in Unit',
        path: '/words-unit4',
      },
      {
        icon: 'fa fa-train fa-lg',
        title: 'Phrases in Unit',
        path: '/phrases-unit4',
      },
      {
        icon: 'fa fa-car fa-lg',
        title: 'Words in Textbook',
        path: '/words-textbook4',
      },
      {
        icon: 'fa fa-taxi fa-lg',
        title: 'Phrases in Textbook',
        path: '/phrases-textbook4',
      },
      {
        icon: 'fa fa-plane fa-lg',
        title: 'Words in Language',
        path: '/words-lang4',
      },
      {
        icon: 'fa fa-rocket fa-lg',
        title: 'Phrases in Language',
        path: '/phrases-lang4',
      },
      {
        icon: 'fa fa-motorcycle fa-lg',
        title: 'Patterns in Language',
        path: '/patterns4',
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

<style>
  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
</style>
