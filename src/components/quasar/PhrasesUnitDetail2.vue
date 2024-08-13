<template>
  <q-dialog v-model="showDialog">
    <q-card style="width: 750px">
      <q-card-section>
        <q-input label="ID" type="text" v-model="item.ID" disable />
        <q-select map-options emit-value label="UNIT" :options="settingsService.units" v-model="item.UNIT" />
        <q-select map-options emit-value label="PART" :options="settingsService.parts" v-model="item.PART" />
        <q-input label="SEQNUM" type="text" v-model="item.SEQNUM" />
        <q-input label="PHRASEID" type="text" v-model="item.PHRASEID" disable />
        <q-input label="PHRASE" type="text" v-model="item.PHRASE" />
        <q-input label="TRANSLATION" type="text" v-model="item.TRANSLATION" />
      </q-card-section>
      <q-card-actions>
        <q-space />
        <q-btn variant="elevated" color="info" label="Cancel" @click="showDialog=false" />
        <q-btn variant="elevated" color="info" label="Save" @click="save()" />
      </q-card-actions>
    </q-card>
  </q-dialog>
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
  const {id} = defineProps({id: Number});
  const itemOld = phrasesUnitService.value.unitPhrases.find(value => value.ID === id);
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
