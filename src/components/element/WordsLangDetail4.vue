<template>
  <el-dialog v-model="showDialog" width="750">
    <el-card>
      <el-input label="ID" type="text" v-model="item.ID" :disable="true"></el-input>
      <el-input label="WORD" type="text" v-model="item.WORD"></el-input>
      <el-input label="NOTE" type="text" v-model="item.NOTE"></el-input>
      <el-input label="FAMIID" type="text" v-model="item.FAMIID" :disable="true"></el-input>
      <el-input label="ACCURACY" type="text" v-model="item.ACCURACY" :disable="true"></el-input>
      <template #footer>
        <el-button type="info" @click="showDialog=false">Cancel</el-button>
        <el-button type="info" @click="save()">Save</el-button>
      </template>
    </el-card>
  </el-dialog>
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
