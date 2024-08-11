<template>
  <el-dialog v-model="showDialog" width="750">
    <el-card>
      <el-input label="ID" type="text" v-model="item.ID" :disable="true"></el-input>
      <el-input label="PHRASE" type="text" v-model="item.PHRASE"></el-input>
      <el-input label="TRANSLATION" type="text" v-model="item.TRANSLATION"></el-input>
      <template #footer>
        <el-button type="info" @click="showDialog=false">Cancel</el-button>
        <el-button type="info" @click="save()">Save</el-button>
      </template>
    </el-card>
  </el-dialog>
</template>

<script setup lang="ts">
  import { PhrasesLangService } from '@/view-models/wpp/phrases-lang.service';
  import { SettingsService } from '@/view-models/misc/settings.service';
  import { container } from 'tsyringe';
  import { defineModel, defineProps, ref } from "vue";
  import { MLangPhrase } from '@/models/wpp/lang-phrase';

  const phrasesLangService = ref(container.resolve(PhrasesLangService));
  const settingsService = ref(container.resolve(SettingsService));

  const showDialog = defineModel();
  const props = defineProps({id: Number});
  const itemOld = phrasesLangService.value.langPhrases.find(value => value.ID === props.id);
  const item = ref(itemOld ? Object.create(itemOld) as MLangPhrase : phrasesLangService.value.newLangPhrase());

  const save = async () => {
    item.value.PHRASE = settingsService.value.autoCorrectInput(item.value.PHRASE);
    await (item.value.ID ? phrasesLangService.value.update(item.value) : phrasesLangService.value.create(item.value));
    showDialog.value = false;
  };
</script>

<style>
  /*@import '../../assets/common.css';*/
</style>
