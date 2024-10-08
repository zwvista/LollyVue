<template>
  <v-app>
    <v-app-bar
      color="primary"
      :order="clipped ? 0 : 1"
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-btn :icon="rail ? 'fa-chevron-right' : 'fa-chevron-left'" @click.stop="rail = !rail"></v-btn>
      <v-btn :icon="clipped ? 'fa-circle-chevron-left' : 'fa-circle-chevron-down'" @click.stop="clipped = !clipped"></v-btn>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer />
      <a href="/">
        <v-btn variant="elevated" color="info">1. Veutify</v-btn>
      </a>
      <a href="/quasar">
        <v-btn variant="elevated" color="info">2. Quasar</v-btn>
      </a>
      <a href="/material">
        <v-btn variant="elevated" color="info">3. Material</v-btn>
      </a>
      <a href="/element">
        <v-btn variant="elevated" color="info">4. Element</v-btn>
      </a>
      <a href="/primevue">
        <v-btn variant="elevated" color="info">5. PrimeVUE</v-btn>
      </a>
    </v-app-bar>
    <v-navigation-drawer
      persistent
      :rail="rail"
      v-model="drawer"
    >
      <v-list density="compact">
        <v-list-item
          :value="item"
          v-for="(item, i) in items"
          :key="i"
          :to="{path: item.path}"
        >
          <template #prepend>
            <v-icon :icon="item.icon"></v-icon>
          </template>
          <v-list-item-title v-text="item.title"></v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from "vue";
  import { container } from "tsyringe";
  import { AppService } from "@/view-models/misc/app.service";
  import { GlobalVars } from "@/common/common";

  const clipped = ref(true);
  const drawer = ref(true);
  const items = ref([
    {
      icon: 'fa-bus',
      title: 'Words in Unit',
      path: '/vuetify/words-unit',
    },
    {
      icon: 'fa-train',
      title: 'Phrases in Unit',
      path: '/vuetify/phrases-unit',
    },
    {
      icon: 'fa-car',
      title: 'Words in Textbook',
      path: '/vuetify/words-textbook',
    },
    {
      icon: 'fa-taxi',
      title: 'Phrases in Textbook',
      path: '/vuetify/phrases-textbook',
    },
    {
      icon: 'fa-plane',
      title: 'Words in Language',
      path: '/vuetify/words-lang',
    },
    {
      icon: 'fa-rocket',
      title: 'Phrases in Language',
      path: '/vuetify/phrases-lang',
    },
    {
      icon: 'fa-motorcycle',
      title: 'Patterns in Language',
      path: '/vuetify/patterns',
    },
    {
      icon: 'fa-cog',
      title: 'Settings',
      path: '/vuetify/settings',
    },
  ]);
  const rail = ref(false);
  const title = ref('Lolly Vue');
  const appService = ref(container.resolve(AppService));
  onMounted(() => {
    GlobalVars.userid = localStorage.getItem('userid');
    appService.value.getData();
  });
</script>
