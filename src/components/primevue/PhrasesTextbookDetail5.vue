<template>
  <Dialog v-model:visible="showDialog" style="width: 750px">
      <InputText label="ID" type="text" v-model="item.ID" disabled></InputText>
      <InputText label="TEXTBOOK" type="text" v-model="item.TEXTBOOKNAME" disabled></InputText>
      <Select label="UNIT" :options="settingsService.units" optionLabel="label" optionValue="value" v-model="item.UNIT"></Select>
      <Select label="PART" :options="settingsService.parts" optionLabel="label" optionValue="value" v-model="item.PART"></Select>
      <InputText label="PHRASEID" type="text" v-model="item.PHRASEID" disabled></InputText>
      <InputText label="PHRASE" type="text" v-model="item.PHRASE"></InputText>
      <InputText label="TRANSLATION" type="text" v-model="item.TRANSLATION"></InputText>
      <Button severity="info" @click="showDialog=false">Cancel</Button>
      <Button severity="info" @click="save()">Save</Button>
  </Dialog>
</template>

<script setup lang="ts">
  import { SettingsService } from '@/view-models/misc/settings.service';
  import { MUnitPhrase } from '@/models/wpp/unit-phrase';
  import { PhrasesUnitService } from '@/view-models/wpp/phrases-unit.service';
  import { container } from 'tsyringe';
  import { defineModel, defineProps, ref } from "vue";

  const phrasesUnitService = ref(container.resolve(PhrasesUnitService));
  const settingsService = ref(container.resolve(SettingsService));

  const showDialog = defineModel();
  const props = defineProps({id: Number});
  const item = ref(Object.create(phrasesUnitService.value.textbookPhrases.find(value => value.ID === props.id)!) as MUnitPhrase);

  const save = async () => {
    item.value.PHRASE = settingsService.value.autoCorrectInput(item.value.PHRASE);
    await phrasesUnitService.value.update(item.value);
    showDialog.value = false;
  };
</script>

<style>
  /*@import '../../assets/common.css';*/
</style>
