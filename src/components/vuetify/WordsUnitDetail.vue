<template>
  <v-dialog v-if="showDialog" v-model="showDialog" max-width="500px">
  <div>
    <v-text-field label="ID" type="text" v-model="item.ID" disabled></v-text-field>
    <v-select label="UNIT" :items="settingsService.units" item-text="label" item-value="value" v-model="item.UNIT"></v-select>
    <v-select label="PART" :items="settingsService.parts" item-text="label" item-value="value" v-model="item.PART"></v-select>
    <v-text-field label="SEQNUM" type="text" v-model="item.SEQNUM"></v-text-field>
    <v-text-field label="WORD" type="text" v-model="item.WORD"></v-text-field>
    <v-text-field label="NOTE" type="text" v-model="item.NOTE"></v-text-field>
    <v-text-field label="FAMIID" type="text" v-model="item.FAMIID" disabled></v-text-field>
    <v-text-field label="ACCURACY" type="text" v-model="item.ACCURACY" disabled></v-text-field>
    <v-btn color="info" @click="goBack()">Back</v-btn>
    <v-btn color="info" @click="save()">Save</v-btn>
  </div>
  </v-dialog>
</template>

<script setup lang="ts">
  import { WordsUnitService } from '@/view-models/wpp/words-unit.service';
  import { SettingsService } from '@/view-models/misc/settings.service';
  import { container } from 'tsyringe';
  import { defineModel, defineProps, ref } from "vue";

  const wordsUnitService = ref(container.resolve(WordsUnitService));
  const settingsService = ref(container.resolve(SettingsService));

  const showDialog = defineModel();
  const id = defineProps<{id: number}>();
  const item = ref((() => {
      const o = wordsUnitService.value.unitWords.find(value => value.ID === id);
      return o || wordsUnitService.value.newUnitWord();
  })());

  function goBack() {
    showDialog.value = false;
    // $router.go(-1);
  }

  async function save() {
    item.value.WORD = settingsService.value.autoCorrectInput(item.value.WORD);
    if (item.value.ID) {
      await wordsUnitService.value.update(item.value);
      showDialog.value = false;
    } else {
      await wordsUnitService.value.create(item.value);
      showDialog.value = false;
    }
  }
</script>

<style>
  /*@import '../../assets/common.css';*/
</style>
