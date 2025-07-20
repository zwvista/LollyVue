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
          <el-select value-key="value" v-model="item.UNIT">
            <el-option v-for="item in settingsService.units" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="PART:">
          <el-select value-key="value" emit-value v-model="item.PART">
            <el-option v-for="item in settingsService.parts" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="PHRASEID:">
          <el-input type="text" v-model="item.PHRASEID" disabled></el-input>
        </el-form-item>
        <el-form-item label="PHRASE:">
          <el-input type="text" v-model="item.PHRASE"></el-input>
        </el-form-item>
        <el-form-item label="TRANSLATION:">
          <el-input type="text" v-model="item.TRANSLATION"></el-input>
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
  import { SettingsService } from '@/shared/view-models/misc/settings.service';
  import { MUnitPhrase } from '@/shared/models/wpp/unit-phrase';
  import { PhrasesUnitService } from '@/shared/view-models/wpp/phrases-unit.service';
  import { container } from 'tsyringe';
  import { defineModel, defineProps, ref } from "vue";

  const phrasesUnitService = ref(container.resolve(PhrasesUnitService));
  const settingsService = ref(container.resolve(SettingsService));

  const showDialog = defineModel();
  const {id} = defineProps({id: Number});
  const item = ref(Object.create(phrasesUnitService.value.textbookPhrases.find(value => value.ID === id)!) as MUnitPhrase);

  const save = async () => {
    item.value.PHRASE = settingsService.value.autoCorrectInput(item.value.PHRASE);
    await phrasesUnitService.value.update(item.value);
    showDialog.value = false;
  };
</script>

<style>
  /*@import '../../assets/common.css';*/
</style>
