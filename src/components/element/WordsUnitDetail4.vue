<template>
  <el-dialog v-model="showDialog" width="750">
    <el-card>
      <el-input label="ID" v-model="item.ID" :disable="true"></el-input>
      <el-select map-options emit-value label="UNIT" v-model="item.UNIT">
        <el-option v-for="item in settingsService.units" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select map-options emit-value label="PART" v-model="item.PART">
        <el-option v-for="item in settingsService.parts" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-input label="SEQNUM" v-model="item.SEQNUM"></el-input>
      <el-input label="WORD" v-model="item.WORD"></el-input>
      <el-input label="NOTE" v-model="item.NOTE"></el-input>
      <el-input label="FAMIID" v-model="item.FAMIID" :disable="true"></el-input>
      <el-input label="ACCURACY" v-model="item.ACCURACY" :disable="true"></el-input>
      <template #footer>
        <el-button type="info" @click="showDialog=false">Cancel</el-button>
        <el-button type="info" @click="save()">Save</el-button>
      </template>
    </el-card>
  </el-dialog>
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
  const props = defineProps({id: Number});
  const itemOld = wordsUnitService.value.unitWords.find(value => value.ID === props.id);
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
