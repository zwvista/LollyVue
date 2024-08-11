<template>
  <Dialog v-model="showDialog">
    <Card style="width: 750px">
      <InputText label="ID" type="text" v-model="item.ID" :disable="true"></InputText>
      <InputText label="TEXTBOOK" type="text" v-model="item.TEXTBOOKNAME" :disable="true"></InputText>
      <Select label="UNIT" :options="settingsService.units" v-model="item.UNIT"></Select>
      <Select label="PART" :options="settingsService.parts" v-model="item.PART"></Select>
      <InputText label="PHRASEID" type="text" v-model="item.PHRASEID" :disable="true"></InputText>
      <InputText label="PHRASE" type="text" v-model="item.PHRASE"></InputText>
      <InputText label="TRANSLATION" type="text" v-model="item.TRANSLATION"></InputText>
      <Card-actions>
        <q-space></q-space>
        <Button variant="elevated" color="info" @click="showDialog=false">Cancel</Button>
        <Button variant="elevated" color="info" @click="save()">Save</Button>
      </Card-actions>
    </Card>
  </Dialog>
</template>

<script setup lang="ts">
  import { SettingsService } from '@/view-models/misc/settings.service';
  import { MUnitPhrase } from '@/models/wpp/unit-phrase';
  import { PhrasesUnitService } from '@/view-models/wpp/phrases-unit.service';
  import { container } from 'tsyringe';
  import { defineModel, defineProps, ref } from "vue";

  const phrasesUnitService = ref(container.resolve(PhrasesUnitService));
  const settingsService = ref(container.resolve(SettingsService));

  const showDialog = defineModel();
  const props = defineProps({id: Number});
  const item = ref(Object.create(phrasesUnitService.value.textbookPhrases.find(value => value.ID === props.id)!) as MUnitPhrase);

  const save = async () => {
    item.value.PHRASE = settingsService.value.autoCorrectInput(item.value.PHRASE);
    await phrasesUnitService.value.update(item.value);
    showDialog.value = false;
  };
</script>

<style>
  /*@import '../../assets/common.css';*/
</style>
