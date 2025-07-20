<template>
  <q-dialog v-model="showDialog">
    <q-card style="width: 750px">
      <q-card-section>
        <q-input label="ID" type="text" v-model="item.ID" disable />
        <q-input label="PATTERN" type="text" v-model="item.PATTERN" />
        <q-input label="TAGS" type="text" v-model="item.TAGS" />
        <q-input label="TITLE" type="text" v-model="item.TITLE" />
        <q-input label="URL" type="text" v-model="item.URL" />
      </q-card-section>
      <q-card-actions>
        <q-space />
        <q-btn variant="elevated" color="info" label="Cancel" @click="showDialog=false" />
        <q-btn variant="elevated" color="info" label="Save" @click="save()" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
  import { SettingsService } from '@/shared/view-models/misc/settings.service';
  import { PatternsService } from '@/shared/view-models/wpp/patterns.service';
  import { container } from 'tsyringe';
  import { defineModel, defineProps, ref } from "vue";
  import { MPattern } from '@/shared/models/wpp/pattern';

  const patternsService = ref(container.resolve(PatternsService));
  const settingsService = ref(container.resolve(SettingsService));

  const showDialog = defineModel();
  const {id} = defineProps({id: Number});
  const itemOld = patternsService.value.patterns.find(value => value.ID === id);
  const item = ref(itemOld ? Object.create(itemOld) as MPattern : patternsService.value.newPattern());

  const save = async () => {
    item.value.PATTERN = settingsService.value.autoCorrectInput(item.value.PATTERN);
    await (item.value.ID ? patternsService.value.update(item.value) : patternsService.value.create(item.value));
    showDialog.value = false;
  };
</script>

<style>
  /*@import '../../assets/common.css';*/
</style>
