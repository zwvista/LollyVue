<template>
  <el-dialog v-model="showDialog" width="750">
    <el-card>
      <el-form label-width="auto" >
        <el-form-item label="ID:">
          <el-input type="text" v-model="item.ID" disabled></el-input>
        </el-form-item>
        <el-form-item label="WORD:">
          <el-input type="text" v-model="item.WORD"></el-input>
        </el-form-item>
        <el-form-item label="NOTE:">
          <el-input type="text" v-model="item.NOTE"></el-input>
        </el-form-item>
        <el-form-item label="FAMIID:">
          <el-input type="text" v-model="item.FAMIID" disabled></el-input>
        </el-form-item>
        <el-form-item label="ACCURACY:">
          <el-input type="text" v-model="item.ACCURACY" disabled></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="info" @click="showDialog=false">Cancel</el-button>
        <el-button type="info" @click="save()">Save</el-button>
      </template>
    </el-card>
  </el-dialog>
</template>

<script setup lang="ts">
  import { WordsLangService } from '@/shared/view-models/wpp/words-lang.service';
  import { SettingsService } from '@/shared/view-models/misc/settings.service';
  import { container } from 'tsyringe';
  import { defineModel, defineProps, ref } from "vue";
  import { MLangWord } from "@/shared/models/wpp/lang-word";

  const wordsLangService = ref(container.resolve(WordsLangService));
  const settingsService = ref(container.resolve(SettingsService));

  const showDialog = defineModel();
  const {id} = defineProps({id: Number});
  const itemOld = wordsLangService.value.langWords.find(value => value.ID === id);
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
