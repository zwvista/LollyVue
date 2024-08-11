<template>
  <el-dialog v-model="showDialog" width="750">
    <el-card>
      <el-input label="ID" type="text" v-model="item.ID" :disable="true"></el-input>
      <el-input label="TEXTBOOK" type="text" v-model="item.TEXTBOOKNAME" :disable="true"></el-input>
      <el-select map-options emit-value label="UNIT" v-model="item.UNIT">
        <el-option v-for="item in settingsService.units" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select map-options emit-value label="PART" v-model="item.PART">
        <el-option v-for="item in settingsService.parts" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-input label="SEQNUM" type="text" v-model="item.SEQNUM"></el-input>
      <el-input label="WORDID" type="text" v-model="item.WORDID" :disable="true"></el-input>
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
