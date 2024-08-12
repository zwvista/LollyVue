<template>
  <q-dialog v-model="showDialog">
    <q-card style="width: 750px">
      <q-card-section>
        <q-input label="ID" v-model="item.ID" :disable="true" />
        <q-select map-options emit-value label="UNIT" :options="settingsService.units" v-model="item.UNIT" />
        <q-select map-options emit-value label="PART" :options="settingsService.parts" v-model="item.PART" />
        <q-input label="SEQNUM" v-model="item.SEQNUM" />
        <q-input label="WORD" v-model="item.WORD" />
        <q-input label="NOTE" v-model="item.NOTE" />
        <q-input label="FAMIID" v-model="item.FAMIID" :disable="true" />
        <q-input label="ACCURACY" v-model="item.ACCURACY" :disable="true" />
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
  import { WordsUnitService } from '@/view-models/wpp/words-unit.service';
  import { SettingsService } from '@/view-models/misc/settings.service';
  import { container } from 'tsyringe';
  import { defineModel, defineProps, ref } from "vue";
  import { MUnitWord } from "@/models/wpp/unit-word";

  const wordsUnitService = ref(container.resolve(WordsUnitService));
  const settingsService = ref(container.resolve(SettingsService));

  const showDialog = defineModel();
  const {id} = defineProps({id: Number});
  const itemOld = wordsUnitService.value.unitWords.find(value => value.ID === id);
  const item = ref(itemOld ? Object.create(itemOld) as MUnitWord : wordsUnitService.value.newUnitWord());

  const save = async () => {
    item.value.WORD = settingsService.value.autoCorrectInput(item.value.WORD);
    await (item.value.ID ? wordsUnitService.value.update(item.value) : wordsUnitService.value.create(item.value));
    showDialog.value = false;
  };
</script>

<style>
  /*@import '../../assets/common.css';*/
</style>
