<template>
  <q-dialog v-model="showDialog">
    <q-card style="width: 750px">
      <q-input label="ID" type="text" v-model="item.ID" :disable="true"></q-input>
      <q-input label="TEXTBOOK" type="text" v-model="item.TEXTBOOKNAME" :disable="true"></q-input>
      <q-select map-options emit-value label="UNIT" :options="settingsService.units" v-model="item.UNIT"></q-select>
      <q-select map-options emit-value label="PART" :options="settingsService.parts" v-model="item.PART"></q-select>
      <q-input label="SEQNUM" type="text" v-model="item.SEQNUM"></q-input>
      <q-input label="ID" type="text" v-model="item.ID" :disable="true"></q-input>
      <q-input label="WORD" type="text" v-model="item.WORD"></q-input>
      <q-input label="NOTE" type="text" v-model="item.NOTE"></q-input>
      <q-input label="FAMIID" type="text" v-model="item.FAMIID" :disable="true"></q-input>
      <q-input label="ACCURACY" type="text" v-model="item.ACCURACY" :disable="true"></q-input>
      <q-card-actions>
        <q-space></q-space>
        <q-btn variant="elevated" color="info" @click="showDialog=false">Cancel</q-btn>
        <q-btn variant="elevated" color="info" @click="save()">Save</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
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
