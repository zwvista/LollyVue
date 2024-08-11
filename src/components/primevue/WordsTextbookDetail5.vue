<template>
  <Dialog v-model:visible="showDialog" style="width: 750px">
      <InputText label="ID" type="text" v-model="item.ID" disabled></InputText>
      <InputText label="TEXTBOOK" type="text" v-model="item.TEXTBOOKNAME" disabled></InputText>
      <Select label="UNIT" :options="settingsService.units" optionLabel="label" optionValue="value" v-model="item.UNIT"></Select>
      <Select label="PART" :options="settingsService.parts" optionLabel="label" optionValue="value" v-model="item.PART"></Select>
      <InputText label="SEQNUM" type="text" v-model="item.SEQNUM"></InputText>
      <InputText label="ID" type="text" v-model="item.ID" disabled></InputText>
      <InputText label="WORD" type="text" v-model="item.WORD"></InputText>
      <InputText label="NOTE" type="text" v-model="item.NOTE"></InputText>
      <InputText label="FAMIID" type="text" v-model="item.FAMIID" disabled></InputText>
      <InputText label="ACCURACY" type="text" v-model="item.ACCURACY" disabled></InputText>
      <Button severity="info" @click="showDialog=false">Cancel</Button>
      <Button severity="info" @click="save()">Save</Button>
  </Dialog>
</template>

<script setup lang="ts">
  import { SettingsService } from '@/view-models/misc/settings.service';
  import { WordsUnitService } from '@/view-models/wpp/words-unit.service';
  import { container } from 'tsyringe';
  import { defineModel, defineProps, ref } from "vue";
  import { MUnitWord } from "@/models/wpp/unit-word";

  const wordsUnitService = ref(container.resolve(WordsUnitService));
  const settingsService = ref(container.resolve(SettingsService));

  const showDialog = defineModel();
  const props = defineProps({id: Number});
  const item = ref(Object.create(wordsUnitService.value.textbookWords.find(value => value.ID === props.id)!) as MUnitWord);

  const save = async () => {
    item.value.WORD = settingsService.value.autoCorrectInput(item.value.WORD);
    await wordsUnitService.value.update(item.value);
    showDialog.value = false;
  };
</script>

<style>
  /*@import '../../assets/common.css';*/
</style>
