<template>
  <Dialog v-model:visible="showDialog" style="width: 750px">
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
  import { WordsLangService } from '@/view-models/wpp/words-lang.service';
  import { SettingsService } from '@/view-models/misc/settings.service';
  import { container } from 'tsyringe';
  import { defineModel, defineProps, ref } from "vue";
  import { MLangWord } from "@/models/wpp/lang-word";

  const wordsLangService = ref(container.resolve(WordsLangService));
  const settingsService = ref(container.resolve(SettingsService));

  const showDialog = defineModel();
  const props = defineProps({id: Number});
  const itemOld = wordsLangService.value.langWords.find(value => value.ID === props.id);
  const item = ref(itemOld ? Object.create(itemOld) as MLangWord : wordsLangService.value.newLangWord());

  const save = async () => {
    item.value.WORD = settingsService.value.autoCorrectInput(item.value.WORD);
    await (item.value.ID ? wordsLangService.value.update(item.value) : wordsLangService.value.create(item.value));
    showDialog.value = false;
  };
</script>

<style>
  /*@import '../../assets/common.css';*/
</style>
