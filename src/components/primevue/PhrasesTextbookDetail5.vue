<template>
  <Dialog v-model:visible="showDialog" style="width: 750px">
    <div class="flex items-center gap-4 mb-4">
      <label class="w-24" for="ID">ID:</label>
      <InputText id="ID" class="flex-auto" type="text" v-model="item.ID" disabled></InputText>
    </div>
    <div class="flex items-center gap-4 mb-4">
      <label class="w-24" for="ID">ID:</label>
      <InputText id="TEXTBOOK" class="flex-auto" type="text" v-model="item.TEXTBOOKNAME" disabled></InputText>
    </div>
    <div class="flex items-center gap-4 mb-4">
      <label class="w-24" for="UNIT">UNIT:</label>
      <Select id="UNIT" class="flex-auto" :options="settingsService.units" optionLabel="label" optionValue="value" v-model="item.UNIT"></Select>
    </div>
    <div class="flex items-center gap-4 mb-4">
      <label class="w-24" for="PART">PART:</label>
      <Select id="PART" class="flex-auto" :options="settingsService.parts" optionLabel="label" optionValue="value" v-model="item.PART"></Select>
    </div>
    <div class="flex items-center gap-4 mb-4">
      <label class="w-24" for="PHRASEID">PHRASEID:</label>
      <InputText id="PHRASEID" class="flex-auto" type="text" v-model="item.PHRASEID" disabled></InputText>
    </div>
    <div class="flex items-center gap-4 mb-4">
      <label class="w-24" for="PHRASE">PHRASE:</label>
      <InputText id="PHRASE" class="flex-auto" type="text" v-model="item.PHRASE"></InputText>
    </div>
    <div class="flex items-center gap-4 mb-4">
      <label class="w-24" for="TRANSLATION">TRANSLATION:</label>
      <InputText id="TRANSLATION" class="flex-auto" type="text" v-model="item.TRANSLATION"></InputText>
    </div>
    <template #footer>
      <Button severity="info" @click="showDialog=false">Cancel</Button>
      <Button severity="info" @click="save()">Save</Button>
    </template>
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
