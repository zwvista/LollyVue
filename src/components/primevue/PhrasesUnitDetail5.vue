<template>
  <Dialog v-model="showDialog">
    <Card style="width: 750px">
      <InputText label="ID" type="text" v-model="item.ID" :disable="true"></InputText>
      <Select label="UNIT" :options="settingsService.units" v-model="item.UNIT"></Select>
      <Select label="PART" :options="settingsService.parts" v-model="item.PART"></Select>
      <InputText label="SEQNUM" type="text" v-model="item.SEQNUM"></InputText>
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
