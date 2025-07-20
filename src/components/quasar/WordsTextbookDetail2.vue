<template>
  <q-dialog v-model="showDialog">
    <q-card style="width: 750px">
      <q-card-section>
        <q-input label="ID" type="text" v-model="item.ID" disable />
        <q-input label="TEXTBOOK" type="text" v-model="item.TEXTBOOKNAME" disable />
        <q-select map-options emit-value label="UNIT" :options="settingsService.units" v-model="item.UNIT" />
        <q-select map-options emit-value label="PART" :options="settingsService.parts" v-model="item.PART" />
        <q-input label="SEQNUM" type="text" v-model="item.SEQNUM" />
        <q-input label="WORDID" type="text" v-model="item.WORDID" disable />
        <q-input label="WORD" type="text" v-model="item.WORD" />
        <q-input label="NOTE" type="text" v-model="item.NOTE" />
        <q-input label="FAMIID" type="text" v-model="item.FAMIID" disable />
        <q-input label="ACCURACY" type="text" v-model="item.ACCURACY" disable />
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
  import { WordsUnitService } from '@/shared/view-models/wpp/words-unit.service';
  import { container } from 'tsyringe';
  import { defineModel, defineProps, ref } from "vue";
  import { MUnitWord } from "@/shared/models/wpp/unit-word";

  const wordsUnitService = ref(container.resolve(WordsUnitService));
  const settingsService = ref(container.resolve(SettingsService));

  const showDialog = defineModel();
  const {id} = defineProps({id: Number});
  const item = ref(Object.create(wordsUnitService.value.textbookWords.find(value => value.ID === id)!) as MUnitWord);

  const save = async () => {
    item.value.WORD = settingsService.value.autoCorrectInput(item.value.WORD);
    await wordsUnitService.value.update(item.value);
    showDialog.value = false;
  };
</script>

<style>
  /*@import '../../assets/common.css';*/
</style>
