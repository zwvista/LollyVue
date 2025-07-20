<template>
  <Dialog v-model:visible="showDialog" style="width: 750px">
    <div class="flex items-center gap-4 mb-4">
      <label class="w-24" for="ID">ID:</label>
      <InputText id="ID" class="flex-auto" type="text" v-model="item.ID" disabled></InputText>
    </div>
    <div class="flex items-center gap-4 mb-4">
      <label class="w-24" for="TEXTBOOK">TEXTBOOK:</label>
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
      <label class="w-24" for="SEQNUM">SEQNUM:</label>
      <InputText id="SEQNUM" class="flex-auto" type="text" v-model="item.SEQNUM"></InputText>
    </div>
    <div class="flex items-center gap-4 mb-4">
      <label class="w-24" for="WORDID">WORDID:</label>
      <InputText id="WORDID" class="flex-auto" type="text" v-model="item.ID" disabled></InputText>
    </div>
    <div class="flex items-center gap-4 mb-4">
      <label class="w-24" for="WORD">WORD:</label>
      <InputText id="WORD" class="flex-auto" type="text" v-model="item.WORD"></InputText>
    </div>
    <div class="flex items-center gap-4 mb-4">
      <label class="w-24" for="NOTE">NOTE:</label>
      <InputText id="NOTE" class="flex-auto" type="text" v-model="item.NOTE"></InputText>
    </div>
    <div class="flex items-center gap-4 mb-4">
      <label class="w-24" for="FAMIID">FAMIID:</label>
      <InputText id="FAMIID" class="flex-auto" type="text" v-model="item.FAMIID" disabled></InputText>
    </div>
    <div class="flex items-center gap-4 mb-4">
      <label class="w-24" for="ACCURACY">ACCURACY:</label>
      <InputText id="ACCURACY" class="flex-auto" type="text" v-model="item.ACCURACY" disabled></InputText>
    </div>
    <template #footer>
      <Button rounded severity="info" @click="showDialog=false">Cancel</Button>
      <Button rounded severity="info" @click="save()">Save</Button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
  import { SettingsService } from '@/shared/view-models/misc/settings.service';
  import { WordsUnitService } from '@/shared/view-models/wpp/words-unit.service';
  import { container } from 'tsyringe';
  import { defineModel, defineProps, ref } from "vue";
  import { MUnitWord } from "@/shared/models/wpp/unit-word";

  const wordsUnitService = ref(container.resolve(WordsUnitService));
  const settingsService = ref(container.resolve(SettingsService));

  const showDialog = defineModel();
  const {id} = defineProps({id: Number});
  const item = ref(Object.create(wordsUnitService.value.textbookWords.find(value => value.ID === id)!) as MUnitWord);

  const save = async () => {
    item.value.WORD = settingsService.value.autoCorrectInput(item.value.WORD);
    await wordsUnitService.value.update(item.value);
    showDialog.value = false;
  };
</script>

<style>
  /*@import '../../assets/common.css';*/
</style>
