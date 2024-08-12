<template>
  <Dialog v-model:visible="showDialog" style="width: 750px">
    <div class="flex items-center gap-4 mb-4">
      <label class="w-24" for="ID">ID:</label>
      <InputText id="ID" class="flex-auto" type="text" v-model="item.ID" disabled></InputText>
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
      <Button severity="info" @click="showDialog=false">Cancel</Button>
      <Button severity="info" @click="save()">Save</Button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
  import { WordsLangService } from '@/view-models/wpp/words-lang.service';
  import { SettingsService } from '@/view-models/misc/settings.service';
  import { container } from 'tsyringe';
  import { defineModel, defineProps, ref } from "vue";
  import { MLangWord } from "@/models/wpp/lang-word";

  const wordsLangService = ref(container.resolve(WordsLangService));
  const settingsService = ref(container.resolve(SettingsService));

  const showDialog = defineModel();
  const {id} = defineProps({id: Number});
  const itemOld = wordsLangService.value.langWords.find(value => value.ID === id);
  const item = ref(itemOld ? Object.create(itemOld) as MLangWord : wordsLangService.value.newLangWord());

  const save = async () => {
    item.value.WORD = settingsService.value.autoCorrectInput(item.value.WORD);
    await (item.value.ID ? wordsLangService.value.update(item.value) : wordsLangService.value.create(item.value));
    showDialog.value = false;
  };
</script>

<style>
  /*@import '../../assets/common.css';*/
</style>
