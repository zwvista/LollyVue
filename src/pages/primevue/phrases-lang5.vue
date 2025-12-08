<template>
  <div>
    <Toolbar>
      <template #start>
        <Select :options="settingsService.phraseFilterTypes" optionLabel="label" optionValue="value" v-model="phrasesLangService.filterType" @change="onRefresh" />
        <FloatLabel>
          <InputText id="filter" type="text" v-model="phrasesLangService.filter" @keyup.enter="onRefresh" />
          <label for="filter">Filter</label>
        </FloatLabel>
        <Button rounded @click.stop="showDetailDialog(0)"><font-awesome-icon icon="fa-plus"/>Add</Button>
        <Button rounded @click="onRefresh()"><font-awesome-icon icon="fa-refresh"/>Refresh</Button>
      </template>
    </Toolbar>
    <Paginator :rows.sync="phrasesLangService.rows" :totalRecords="phrasesLangService.langPhraseCount" :rowsPerPageOptions="settingsService.USROWSPERPAGEOPTIONS" @page="onPage($event)" />
    <DataTable
      :value="phrasesLangService.langPhrases"
    >
      <Column headerStyle="width: 80px" field="ID" header="ID" />
      <Column field="PHRASE" header="PHRASE" />
      <Column field="TRANSLATION" header="TRANSLATION" />
      <Column headerStyle="width: 30%" header="ACTIONS">
        <template #body="slotProps">
         <Button rounded v-tooltip2.top="'Delete'" severity="danger" @click="deletePhrase(slotProps.data)"><font-awesome-icon icon="fa-trash"/></Button>
          <Button rounded v-tooltip2.top="'Edit'" @click.stop="showDetailDialog(slotProps.data.ID)"><font-awesome-icon icon="fa-edit"/></Button>
          <Button rounded v-tooltip2.top="'Speak'" @click="settingsService.speak(slotProps.data.PHRASE)"><font-awesome-icon icon="fa-volume-up"/></Button>
          <Button rounded v-tooltip2.top="'Copy'" v-clipboard:copy="slotProps.data.PHRASE"><font-awesome-icon icon="fa-copy"/></Button>
          <Button rounded v-tooltip2.top="'Google Phrase'" @click="googlePhrase(slotProps.data.PHRASE)"><font-awesome-icon icon="fa-brands fa-google"/></Button>
        </template>
      </Column>
    </DataTable>
    <Paginator :rows.sync="phrasesLangService.rows" :totalRecords="phrasesLangService.langPhraseCount" :rowsPerPageOptions="settingsService.USROWSPERPAGEOPTIONS" @page="onPage($event)" />
    <PhrasesLangDetail5 v-if="showDetail" v-model="showDetail" :id="detailId"></PhrasesLangDetail5>
  </div>
</template>

<script setup lang="ts">
  import { PhrasesLangService } from '@/shared/view-models/wpp/phrases-lang.service';
  import { googleString } from '@/shared/common/common';
  import { SettingsService } from '@/shared/view-models/misc/settings.service';
  import { AppService } from '@/shared/view-models/misc/app.service';
  import { MLangPhrase } from '@/shared/models/wpp/lang-phrase';
  import { container } from 'tsyringe';
  import { ref } from "vue";
  import PhrasesLangDetail5 from '@/components/primevue/PhrasesLangDetail5.vue'

  const appService = ref(container.resolve(AppService));
  const phrasesLangService = ref(container.resolve(PhrasesLangService));
  const settingsService = ref(container.resolve(SettingsService));
  const showDetail = ref(false);
  const detailId = ref(0);

  const onRefresh = async () => {
    // https://stackoverflow.com/questions/4228356/integer-division-with-remainder-in-javascript
    await phrasesLangService.value.getData();
  };

  const onPage = async (event: any) => {
    phrasesLangService.value.page = event.page + 1;
    await onRefresh();
  };

  (async () => {
    await appService.value.getData();
    await onRefresh();
  })();

  const rowsChange = async (rows: number) => {
    phrasesLangService.value.page = 1;
    await onRefresh();
  };

  const deletePhrase = async (item: MLangPhrase) => {
    await phrasesLangService.value.delete(item);
  };

  const googlePhrase = (phrase: string) => {
    googleString(phrase);
  };

  const showDetailDialog = (id: number) => {
    detailId.value = id;
    showDetail.value = true;
  };
</script>

<style>
  /*@import '../../assets/common.css';*/
</style>
