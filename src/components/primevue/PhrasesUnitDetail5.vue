<template>
  <Dialog v-model:visible="showDialog" style="width: 750px">
      <InputText label="ID" type="text" v-model="item.ID" disabled></InputText>
      <Select label="UNIT" :options="settingsService.units" optionLabel="label" optionValue="value" v-model="item.UNIT"></Select>
      <Select label="PART" :options="settingsService.parts" optionLabel="label" optionValue="value" v-model="item.PART"></Select>
      <InputText label="SEQNUM" type="text" v-model="item.SEQNUM"></InputText>
      <InputText label="PHRASEID" type="text" v-model="item.PHRASEID" disabled></InputText>
      <InputText label="PHRASE" type="text" v-model="item.PHRASE"></InputText>
      <InputText label="TRANSLATION" type="text" v-model="item.TRANSLATION"></InputText>
      <Button severity="info" @click="showDialog=false">Cancel</Button>
      <Button severity="info" @click="save()">Save</Button>
  </Dialog>
</template>

<script setup lang="ts">
  import { PhrasesUnitService } from '@/view-models/wpp/phrases-unit.service';
  import { SettingsService } from '@/view-models/misc/settings.service';
  import { container } from 'tsyringe';
  import { defineModel, defineProps, ref } from "vue";
  import { MUnitPhrase } from '@/models/wpp/unit-phrase';

  const phrasesUnitService = ref(container.resolve(PhrasesUnitService));
  const settingsService = ref(container.resolve(SettingsService));

  const showDialog = defineModel();
  const props = defineProps({id: Number});
  const itemOld = phrasesUnitService.value.unitPhrases.find(value => value.ID === props.id);
  const item = ref(itemOld ? Object.create(itemOld) as MUnitPhrase : phrasesUnitService.value.newUnitPhrase());

  const save = async () => {
    item.value.PHRASE = settingsService.value.autoCorrectInput(item.value.PHRASE);
    await (item.value.ID ? phrasesUnitService.value.update(item.value) : await phrasesUnitService.value.create(item.value));
    showDialog.value = false;
  };
</script>

<style>
  /*@import '../../assets/common.css';*/
</style>
