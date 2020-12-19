<template>
  <div>
    <Toolbar>
      <template slot="left">
        <DropDown :options="settingsService.phraseFilterTypes" optionLabel="label" optionValue="value" v-model="filterType" @change="onRefresh" />
        <span class="p-float-label">
          <InputText id="filter" type="text" v-model="filter" @keyup.enter="onRefresh" />
          <label for="filter">Filter</label>
        </span>
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
         <Button v-tooltip.top="'Delete'" icon="fa fa-trash" class="p-button-danger" @click="deletePhrase(slotProps.data)" />
          <router-link :to="{ name: 'phrases-lang-detail', params: { id: slotProps.data.ID }}">
            <Button v-tooltip.top="'Edit'" icon="fa fa-edit" />
          </router-link>
          <Button v-tooltip.top="'Speak'" icon="fa fa-volume-up" @click="settingsService.speak(slotProps.data.PHRASE)" />
          <Button v-tooltip.top="'Copy'" icon="fa fa-copy" v-clipboard:copy="slotProps.data.PHRASE" />
          <Button v-tooltip.top="'Google Phrase'" icon="fa fa-google" @click="googlePhrase(slotProps.data.PHRASE)" />
        </template>
      </Column>
    </DataTable>
    <Paginator :rows.sync="rows" :totalRecords="phrasesLangService.langPhraseCount" :rowsPerPageOptions="settingsService.USROWSPERPAGEOPTIONS" @page="onRefresh" />
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { inject } from 'vue-typescript-inject';
  import { PhrasesLangService } from '@/view-models/phrases-lang.service';
  import { googleString } from '@/common/common';
  import { SettingsService } from '@/view-models/settings.service';
  import { AppService } from '@/view-models/app.service';
  import { MLangPhrase } from '@/models/misc/lang-phrase';

  @Component
  export default class PhrasesLang5 extends Vue {
    @inject() appService!: AppService;
    @inject() phrasesLangService!: PhrasesLangService;
    @inject() settingsService!: SettingsService;

    page = 1;
    pageCount = 1;
    rows = 0;
    filter = '';
    filterType = 0;

    services = {};
    created() {
      this.$set(this.services, 'phrasesLangService', this.phrasesLangService);
      this.appService.initializeObject.subscribe(_ => {
        this.rows = this.settingsService.USROWSPERPAGE;
        this.onRefresh();
      });
    }

    rowsChange(rows: number) {
      this.page = 1;
      this.onRefresh();
    }

    onRefresh() {
      // https://stackoverflow.com/questions/4228356/integer-division-with-remainder-in-javascript
      this.phrasesLangService.getData(this.page, this.rows, this.filter, this.filterType).subscribe(_ => {
        this.pageCount = (this.phrasesLangService.langPhraseCount + this.rows - 1) / this.rows >> 0;
        this.$forceUpdate();
      });
    }

    deletePhrase(item: MLangPhrase) {
      this.phrasesLangService.delete(item);
    }

    googlePhrase(phrase: string) {
      googleString(phrase);
    }
  }
</script>

<style>
  @import '../assets/common.css';
</style>
