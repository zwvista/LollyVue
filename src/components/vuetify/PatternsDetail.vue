<template>
  <v-dialog v-model="showDialog" max-width="750px">
    <v-card>
      <v-text-field label="ID" type="text" v-model="item.ID" disabled></v-text-field>
      <v-text-field label="PATTERN" type="text" v-model="item.PATTERN"></v-text-field>
      <v-text-field label="NOTE" type="text" v-model="item.NOTE"></v-text-field>
      <v-text-field label="TAGS" type="text" v-model="item.TAGS"></v-text-field>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="elevated" color="info" @click="showDialog=false">Cancel</v-btn>
        <v-btn variant="elevated" color="info" @click="save()">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
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
  const props = defineProps({id: Number});
  const itemOld = patternsService.value.patterns.find(value => value.ID === props.id);
  const item = ref(itemOld ? Object.create(itemOld) as MPattern : patternsService.value.newPattern());

  const save = async () => {
    item.value.PATTERN = settingsService.value.autoCorrectInput(item.value.PATTERN);
    if (item.value.ID) {
      await patternsService.value.update(item.value);
      showDialog.value = false;
    } else {
      await patternsService.value.create(item.value);
      showDialog.value = false;
    }
  };
</script>

<style>
  /*@import '../../assets/common.css';*/
</style>
