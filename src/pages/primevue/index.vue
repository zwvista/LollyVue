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
    <TabMenu :model="items">
      <template #item="{ item, props }">
        <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
          <a :href="href" v-bind="props.action" @click="navigate">
            <font-awesome-icon :icon="item.icon" />
            <span class="ml-2">{{ item.label }}</span>
          </a>
        </router-link>
      </template>
    </TabMenu>
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
      route: '/primevue/words-unit5',
    },
    {
      icon: 'fa fa-train fa-lg',
      label: 'Phrases in Unit',
      route: '/primevue/phrases-unit5',
    },
    {
      icon: 'fa fa-car fa-lg',
      label: 'Words in Textbook',
      route: '/primevue/words-textbook5',
    },
    {
      icon: 'fa fa-taxi fa-lg',
      label: 'Phrases in Textbook',
      route: '/primevue/phrases-textbook5',
    },
    {
      icon: 'fa fa-plane fa-lg',
      label: 'Words in Language',
      route: '/primevue/words-lang5',
    },
    {
      icon: 'fa fa-rocket fa-lg',
      label: 'Phrases in Language',
      route: '/primevue/phrases-lang5',
    },
    {
      icon: 'fa fa-motorcycle fa-lg',
      label: 'Patterns in Language',
      route: '/primevue/patterns5',
    },
    {
      icon: 'fa fa-cog fa-lg',
      label: 'Settings',
      route: '/settings',
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
