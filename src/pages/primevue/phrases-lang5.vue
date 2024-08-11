<template>
  <div>
    <Toolbar>
      <template #start>
        <Select :options="settingsService.phraseFilterTypes" optionLabel="label" optionValue="value" v-model="filterType" @change="onRefresh" />
        <FloatLabel>
          <InputText id="filter" type="text" v-model="filter" @keyup.enter="onRefresh" />
          <label for="filter">Filter</label>
        </FloatLabel>
        <Button @click.stop="showDetailDialog(0)"><font-awesome-icon icon="fa-plus"/>Add</Button>
        <Button @click="onRefresh()"><font-awesome-icon icon="fa-refresh"/>Refresh</Button>
      </template>
    </Toolbar>
    <Paginator :rows.sync="rows" :totalRecords="phrasesLangService.langPhraseCount" :rowsPerPageOptions="settingsService.USROWSPERPAGEOPTIONS" @page="onRefresh" />
    <DataTable
      :value="phrasesLangService.langPhrases"
    >
      <Column headerStyle="width: 80px" field="ID" header="ID" />
      <Column field="PHRASE" header="PHRASE" />
      <Column field="TRANSLATION" header="TRANSLATION" />
      <Column headerStyle="width: 30%" header="ACTIONS">
        <template #body="slotProps">
         <Button v-tooltip2.top="'Delete'" severity="danger" @click="deletePhrase(slotProps.data)"><font-awesome-icon icon="fa-trash"/></Button>
          <Button v-tooltip2.top="'Edit'" @click.stop="showDetailDialog(slotProps.data.ID)"><font-awesome-icon icon="fa-edit"/></Button>
          <Button v-tooltip2.top="'Speak'" @click="settingsService.speak(slotProps.data.PHRASE)"><font-awesome-icon icon="fa-volume-up"/></Button>
          <Button v-tooltip2.top="'Copy'" v-clipboard:copy="slotProps.data.PHRASE"><font-awesome-icon icon="fa-copy"/></Button>
          <Button v-tooltip2.top="'Google Phrase'" @click="googlePhrase(slotProps.data.PHRASE)"><font-awesome-icon icon="fa-brands fa-google"/></Button>
        </template>
      </Column>
    </DataTable>
    <Paginator :rows.sync="rows" :totalRecords="phrasesLangService.langPhraseCount" :rowsPerPageOptions="settingsService.USROWSPERPAGEOPTIONS" @page="onRefresh" />
    <PhrasesLangDetail5 v-if="showDetail" v-model="showDetail" :id="detailId"></PhrasesLangDetail5>
  </div>
</template>

<script setup lang="ts">
  import { PhrasesLangService } from '@/view-models/wpp/phrases-lang.service';
  import { googleString } from '@/common/common';
  import { SettingsService } from '@/view-models/misc/settings.service';
  import { AppService } from '@/view-models/misc/app.service';
  import { MLangPhrase } from '@/models/wpp/lang-phrase';
  import { container } from 'tsyringe';
  import { ref } from "vue";
  import PhrasesLangDetail5 from '@/components/primevue/PhrasesLangDetail5'

  const appService = ref(container.resolve(AppService));
  const phrasesLangService = ref(container.resolve(PhrasesLangService));
  const settingsService = ref(container.resolve(SettingsService));
  const showDetail = ref(false);
  const detailId = ref(0);

  const page = ref(1);
  const pageCount = ref(1);
  const rows = ref(0);
  const filter = ref('');
  const filterType = ref(0);

  const onRefresh = async () => {
    // https://stackoverflow.com/questions/4228356/integer-division-with-remainder-in-javascript
    await phrasesLangService.value.getData(page.value, rows.value, filter.value, filterType.value);
    pageCount.value = (phrasesLangService.value.langPhraseCount + rows.value - 1) / rows.value >> 0;
  };

  (() => {
    appService.value.initializeObject.subscribe(_ => {
      rows.value = settingsService.value.USROWSPERPAGE;
      onRefresh();
    });
  })();

  const rowsChange = (rows: number) => {
    page.value = 1;
    onRefresh();
  };

  const deletePhrase = (item: MLangPhrase) => {
    phrasesLangService.value.delete(item);
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
