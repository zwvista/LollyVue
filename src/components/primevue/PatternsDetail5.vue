<template>
  <Dialog v-model="showDialog">
    <Card style="width: 750px">
      <InputText label="ID" type="text" v-model="item.ID" :disable="true"></InputText>
      <InputText label="PATTERN" type="text" v-model="item.PATTERN"></InputText>
      <InputText label="NOTE" type="text" v-model="item.NOTE"></InputText>
      <InputText label="TAGS" type="text" v-model="item.TAGS"></InputText>
      <Card-actions>
        <q-space></q-space>
        <Button variant="elevated" color="info" @click="showDialog=false">Cancel</Button>
        <Button variant="elevated" color="info" @click="save()">Save</Button>
      </Card-actions>
    </Card>
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
  const props = defineProps({id: Number});
  const itemOld = patternsService.value.patterns.find(value => value.ID === props.id);
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
