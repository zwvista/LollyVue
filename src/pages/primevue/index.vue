<template>
  <div>
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

<script setup lang="ts">
  import "reflect-metadata";
  import { GlobalVars } from '@/common/common';
  import { container } from 'tsyringe';
  import { onMounted, ref } from "vue";
  import { AppService } from "@/view-models/misc/app.service";

  const appService = ref(container.resolve(AppService));
  const items = ref([
    {
      icon: 'fa fa-bus fa-lg',
      label: 'Words in Unit',
      to: '/primevue/words/words-unit',
    },
    {
      icon: 'fa fa-train fa-lg',
      label: 'Phrases in Unit',
      to: '/primevue/phrases/phrases-unit',
    },
    {
      icon: 'fa fa-car fa-lg',
      label: 'Words in Textbook',
      to: '/primevue/words/words-textbook',
    },
    {
      icon: 'fa fa-taxi fa-lg',
      label: 'Phrases in Textbook',
      to: '/primevue/phrases/phrases-textbook',
    },
    {
      icon: 'fa fa-plane fa-lg',
      label: 'Words in Language',
      to: '/primevue/words/words-lang',
    },
    {
      icon: 'fa fa-rocket fa-lg',
      label: 'Phrases in Language',
      to: '/primevue/phrases/phrases-lang',
    },
    {
      icon: 'fa fa-motorcycle fa-lg',
      label: 'Patterns in Language',
      to: '/primevue/patterns',
    },
    {
      icon: 'fa fa-cog fa-lg',
      label: 'Settings',
      to: '/settings',
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
