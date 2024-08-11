<template>
  <q-dialog v-model="showDialog">
    <q-card style="width: 750px">
      <q-card-section>
        <q-input label="ID" type="text" v-model="item.ID" :disable="true" />
        <q-input label="TEXTBOOK" type="text" v-model="item.TEXTBOOKNAME" :disable="true" />
        <q-select map-options emit-value label="UNIT" :options="settingsService.units" v-model="item.UNIT" />
        <q-select map-options emit-value label="PART" :options="settingsService.parts" v-model="item.PART" />
        <q-input label="PHRASEID" type="text" v-model="item.PHRASEID" :disable="true" />
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
