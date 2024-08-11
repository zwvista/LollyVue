<template>
  <el-dialog v-model="showDialog" width="750">
    <el-card>
      <el-form label-width="auto" >
        <el-form-item label="ID:">
          <el-input type="text" v-model="item.ID" disabled></el-input>
        </el-form-item>
        <el-form-item label="TEXTBOOK:">
          <el-input type="text" v-model="item.TEXTBOOKNAME" disabled></el-input>
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
          <el-input type="text" v-model="item.SEQNUM"></el-input>
        </el-form-item>
        <el-form-item label="WORDID:">
          <el-input type="text" v-model="item.WORDID" disabled></el-input>
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
