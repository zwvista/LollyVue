<template>
  <el-dialog v-model="showDialog" width="750">
    <el-card>
      <el-form label-width="auto" >
        <el-form-item label="ID:">
          <el-input v-model="item.ID" disabled></el-input>
        </el-form-item>
        <el-form-item label="UNIT:">
          <el-select map-options emit-value v-model="item.UNIT">
            <el-option v-for="item in settingsService.units" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="PART:">
          <el-select map-options emit-value v-model="item.PART">
            <el-option v-for="item in settingsService.parts" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="SEQNUM:">
          <el-input v-model="item.SEQNUM"></el-input>
        </el-form-item>
        <el-form-item label="WORD:">
          <el-input v-model="item.WORD"></el-input>
        </el-form-item>
        <el-form-item label="NOTE:">
          <el-input v-model="item.NOTE"></el-input>
        </el-form-item>
        <el-form-item label="FAMIID:">
          <el-input v-model="item.FAMIID" disabled></el-input>
        </el-form-item>
        <el-form-item label="ACCURACY:">
          <el-input v-model="item.ACCURACY" disabled></el-input>
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
