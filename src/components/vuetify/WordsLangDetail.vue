<template>
  <v-dialog v-model="showDialog" max-width="750px">
    <v-card>
      <v-text-field label="ID" type="text" v-model="item.ID" disabled></v-text-field>
      <v-text-field label="WORD" type="text" v-model="item.WORD"></v-text-field>
      <v-text-field label="NOTE" type="text" v-model="item.NOTE"></v-text-field>
      <v-text-field label="FAMIID" type="text" v-model="item.FAMIID" disabled></v-text-field>
      <v-text-field label="ACCURACY" type="text" v-model="item.ACCURACY" disabled></v-text-field>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="elevated" color="info" @click="showDialog=false">Cancel</v-btn>
        <v-btn variant="elevated" color="info" @click="save()">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
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
  const item = ref(itemOld ? {...itemOld} as MLangWord : wordsLangService.value.newLangWord());

  async function save() {
    item.value.WORD = settingsService.value.autoCorrectInput(item.value.WORD);
    if (item.value.ID) {
      await wordsLangService.value.update(item.value);
      showDialog.value = false;
    } else {
      await wordsLangService.value.create(item.value);
      showDialog.value = false;
    }
  }
</script>

<style>
  /*@import '../../assets/common.css';*/
</style>
