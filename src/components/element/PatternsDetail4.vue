<template>
  <el-dialog v-model="showDialog" width="750">
    <el-card>
      <el-form label-width="auto" >
        <el-form-item label="ID:">
          <el-input type="text" v-model="item.ID" disabled></el-input>
        </el-form-item>
        <el-form-item label="PATTERN:">
          <el-input type="text" v-model="item.PATTERN"></el-input>
        </el-form-item>
        <el-form-item label="TAGS:">
          <el-input type="text" v-model="item.TAGS"></el-input>
        </el-form-item>
        <el-form-item label="TITLE:">
          <el-input type="text" v-model="item.TITLE"></el-input>
        </el-form-item>
        <el-form-item label="URL:">
          <el-input type="text" v-model="item.URL"></el-input>
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
  import { PatternsService } from '@/view-models/wpp/patterns.service';
  import { container } from 'tsyringe';
  import { defineModel, defineProps, ref } from "vue";
  import { MPattern } from '@/models/wpp/pattern';

  const patternsService = ref(container.resolve(PatternsService));
  const settingsService = ref(container.resolve(SettingsService));

  const showDialog = defineModel();
  const {id} = defineProps({id: Number});
  const itemOld = patternsService.value.patterns.find(value => value.ID === id);
  const item = ref(itemOld ? Object.create(itemOld) as MPattern : patternsService.value.newPattern());

  const save = async () => {
    item.value.PATTERN = settingsService.value.autoCorrectInput(item.value.PATTERN);
    await (item.value.ID ? patternsService.value.update(item.value) : patternsService.value.create(item.value));
    showDialog.value = false;
  };
</script>

<style>
  /*@import '../../assets/common.css';*/
</style>
