<template>
  <Dialog v-model:visible="showDialog" style="width: 750px">
    <div class="flex items-center gap-4 mb-4">
      <label class="w-24" for="ID">ID:</label>
      <InputText id="ID" class="flex-auto" type="text" v-model="item.ID" disabled></InputText>
    </div>
    <div class="flex items-center gap-4 mb-4">
      <label class="w-24" for="PATTERN">PATTERN:</label>
      <InputText id="PATTERN" class="flex-auto" type="text" v-model="item.PATTERN"></InputText>
    </div>
    <div class="flex items-center gap-4 mb-4">
      <label class="w-24" for="TAGS">TAGS:</label>
      <InputText id="TAGS" class="flex-auto" type="text" v-model="item.TAGS"></InputText>
    </div>
    <div class="flex items-center gap-4 mb-4">
      <label class="w-24" for="TITLE">TITLE:</label>
      <InputText id="TITLE" class="flex-auto" type="text" v-model="item.TITLE"></InputText>
    </div>
    <div class="flex items-center gap-4 mb-4">
      <label class="w-24" for="URL">URL:</label>
      <InputText id="URL" class="flex-auto" type="text" v-model="item.URL"></InputText>
    </div>
    <template #footer>
      <Button rounded severity="info" @click="showDialog=false">Cancel</Button>
      <Button rounded severity="info" @click="save()">Save</Button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
  import { SettingsService } from '@/view-models/misc/settings.service';
  import { PatternsService } from '@/view-models/wpp/patterns.service';
  import { container } from 'tsyringe';
  import { defineModel, defineProps, ref } from "vue";
  import { MPattern } from '@/models/wpp/pattern';

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
