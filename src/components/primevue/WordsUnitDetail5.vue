<template>
  <Dialog v-model="showDialog">
    <Card style="width: 750px">
      <InputText label="ID" v-model="item.ID" :disable="true"></InputText>
      <Select label="UNIT" :options="settingsService.units" v-model="item.UNIT"></Select>
      <Select label="PART" :options="settingsService.parts" v-model="item.PART"></Select>
      <InputText label="SEQNUM" v-model="item.SEQNUM"></InputText>
      <InputText label="WORD" v-model="item.WORD"></InputText>
      <InputText label="NOTE" v-model="item.NOTE"></InputText>
      <InputText label="FAMIID" v-model="item.FAMIID" :disable="true"></InputText>
      <InputText label="ACCURACY" v-model="item.ACCURACY" :disable="true"></InputText>
      <Card-actions>
        <q-space></q-space>
        <Button variant="elevated" color="info" @click="showDialog=false">Cancel</Button>
        <Button variant="elevated" color="info" @click="save()">Save</Button>
      </Card-actions>
    </Card>
  </Dialog>
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
