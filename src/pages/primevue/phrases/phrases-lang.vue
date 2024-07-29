<template>
  <div>
    <Toolbar>
      <template #start>
        <DropDown :options="settingsService.phraseFilterTypes" optionLabel="label" optionValue="value" v-model="filterType" @change="onRefresh" />
        <FloatLabel>
          <InputText id="filter" type="text" v-model="filter" @keyup.enter="onRefresh" />
          <label for="filter">Filter</label>
        </FloatLabel>
        <router-link to="/phrases-lang-detail/0">
          <Button icon="fa fa-plus" label="Add" />
        </router-link>
        <Button icon="fa fa-refresh" label="Refresh" @click="onRefresh()" />
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
         <Button v-tooltip2.top="'Delete'" icon="fa fa-trash" class="p-button-danger" @click="deletePhrase(slotProps.data)" />
          <router-link :to="{ name: 'phrases-lang-detail', params: { id: slotProps.data.ID }}">
            <Button v-tooltip2.top="'Edit'" icon="fa fa-edit" />
          </router-link>
          <Button v-tooltip2.top="'Speak'" icon="fa fa-volume-up" @click="settingsService.speak(slotProps.data.PHRASE)" />
          <Button v-tooltip2.top="'Copy'" icon="fa fa-copy" v-clipboard:copy="slotProps.data.PHRASE" />
          <Button v-tooltip2.top="'Google Phrase'" icon="fa fa-google" @click="googlePhrase(slotProps.data.PHRASE)" />
        </template>
      </Column>
    </DataTable>
    <Paginator :rows.sync="rows" :totalRecords="phrasesLangService.langPhraseCount" :rowsPerPageOptions="settingsService.USROWSPERPAGEOPTIONS" @page="onRefresh" />
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

  appService = container.resolve(AppService);
  phrasesLangService = container.resolve(PhrasesLangService);
  settingsService = container.resolve(SettingsService);

  page = 1;
  pageCount = 1;
  rows = 0;
  filter = '';
  filterType = 0;

  services = {};
  created() {
    appService.initializeObject.subscribe(_ => {
      rows = settingsService.USROWSPERPAGE;
      onRefresh();
    });
  }

  rowsChange(rows: number) {
    page = 1;
    onRefresh();
  }

  async onRefresh() {
    // https://stackoverflow.com/questions/4228356/integer-division-with-remainder-in-javascript
    await phrasesLangService.getData(page, rows, filter, filterType);
    pageCount = (phrasesLangService.langPhraseCount + rows - 1) / rows >> 0;
    $forceUpdate();
  }

  deletePhrase(item: MLangPhrase) {
    phrasesLangService.delete(item);
  }

  googlePhrase(phrase: string) {
    googleString(phrase);
  }
</script>

<style>
  @import '../../assets/common.css';
</style>
