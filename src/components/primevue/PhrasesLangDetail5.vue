<template>
  <Dialog v-model:visible="showDialog" style="width: 750px">
    <div class="flex items-center gap-4 mb-4">
      <label class="w-24" for="ID">ID:</label>
      <InputText id="ID" class="flex-auto" type="text" v-model="item.ID" disabled></InputText>
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
      <Button rounded severity="info" @click="showDialog=false">Cancel</Button>
      <Button rounded severity="info" @click="save()">Save</Button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
  import { PhrasesLangService } from '@/view-models/wpp/phrases-lang.service';
  import { SettingsService } from '@/view-models/misc/settings.service';
  import { container } from 'tsyringe';
  import { defineModel, defineProps, ref } from "vue";
  import { MLangPhrase } from '@/models/wpp/lang-phrase';

  const phrasesLangService = ref(container.resolve(PhrasesLangService));
  const settingsService = ref(container.resolve(SettingsService));

  const showDialog = defineModel();
  const {id} = defineProps({id: Number});
  const itemOld = phrasesLangService.value.langPhrases.find(value => value.ID === id);
  const item = ref(itemOld ? Object.create(itemOld) as MLangPhrase : phrasesLangService.value.newLangPhrase());

  const save = async () => {
    item.value.PHRASE = settingsService.value.autoCorrectInput(item.value.PHRASE);
    await (item.value.ID ? phrasesLangService.value.update(item.value) : phrasesLangService.value.create(item.value));
    showDialog.value = false;
  };
</script>

<style>
  /*@import '../../assets/common.css';*/
</style>
