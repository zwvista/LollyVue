<template>
  <div>
    <Toolbar>
      <template #start>
        <DropDown :options="settingsService.phraseFilterTypes" optionLabel="label" optionValue="value" v-model="filterType" @change="onRefresh" />
        <span class="p-float-label">
          <InputText id="filter" type="text" v-model="filter" @keyup.enter="onRefresh" />
          <label for="filter">Filter</label>
        </span>
        <DropDown :options="settingsService.textbookFilters" optionLabel="label" optionValue="value" v-model="textbookFilter" @change="onRefresh" />
        <Button icon="fa fa-refresh" label="Refresh" @click="onRefresh()" />
      </template>
    </Toolbar>
    <Paginator :rows.sync="rows" :totalRecords="phrasesUnitService.textbookPhraseCount" :rowsPerPageOptions="settingsService.USROWSPERPAGEOPTIONS" @page="onRefresh" />
    <DataTable
      :value="phrasesUnitService.textbookPhrases"
    >
      <Column headerStyle="width: 80px" field="ID" header="ID" />
      <Column headerStyle="width: 150px" field="TEXTBOOKNAME" header="TEXTBOOKNAME" />
      <Column headerStyle="width: 80px" field="UNITSTR" header="UNIT" />
      <Column headerStyle="width: 80px" field="PARTSTR" header="PART" />
      <Column headerStyle="width: 80px" field="SEQNUM" header="SEQNUM" />
      <Column headerStyle="width: 80px" field="PHRASEID" header="PHRASEID" />
      <Column field="PHRASE" header="PHRASE" />
      <Column field="TRANSLATION" header="TRANSLATION" />
      <Column headerStyle="width: 30%" header="ACTIONS">
        <template #body="slotProps">
          <Button v-tooltip.top="'Delete'" icon="fa fa-trash" class="p-button-danger" @click="deletePhrase(slotProps.data)" />
          <router-link :to="{ name: 'phrases-textbook-detail', params: { id: slotProps.data.ID }}">
            <Button v-tooltip.top="'Edit'" icon="fa fa-edit" />
          </router-link>
          <Button v-tooltip.top="'Speak'" icon="fa fa-volume-up" @click="settingsService.speak(slotProps.data.PHRASE)" />
          <Button v-tooltip.top="'Copy'" icon="fa fa-copy" v-clipboard:copy="slotProps.data.PHRASE" />
          <Button v-tooltip.top="'Google Phrase'" icon="fa fa-google" @click="googlePhrase(slotProps.data.PHRASE)" />
        </template>
      </Column>
    </DataTable>
    <Paginator :rows.sync="rows" :totalRecords="phrasesUnitService.textbookPhraseCount" :rowsPerPageOptions="settingsService.USROWSPERPAGEOPTIONS" @page="onRefresh" />
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { googleString } from '@/common/common';
  import { SettingsService } from '@/view-models/misc/settings.service';
  import { PhrasesUnitService } from '@/view-models/wpp/phrases-unit.service';
  import { MUnitPhrase } from '@/models/wpp/unit-phrase';
  import { AppService } from '@/view-models/misc/app.service';
  import { container } from 'tsyringe';

  @Component
  export default class PhrasesTextbook5 extends Vue {
    appService = container.resolve(AppService);
    phrasesUnitService = container.resolve(PhrasesUnitService);
    settingsService = container.resolve(SettingsService);

    page = 1;
    pageCount = 1;
    rows = 0;
    filter = '';
    filterType = 0;
    textbookFilter = 0;

    services = {};
    created() {
      this.$set(this.services, 'phrasesUnitService', this.phrasesUnitService);
      this.appService.initializeObject.subscribe(_ => {
        this.rows = this.settingsService.USROWSPERPAGE;
        this.onRefresh();
      });
    }

    rowsChange(rows: number) {
      this.page = 1;
      this.onRefresh();
    }

    async onRefresh() {
      // https://stackoverflow.com/questions/4228356/integer-division-with-remainder-in-javascript
      await this.phrasesUnitService.getDataInLang(this.page, this.rows, this.filter, this.filterType, this.textbookFilter);
      this.pageCount = (this.phrasesUnitService.textbookPhraseCount + this.rows - 1) / this.rows >> 0;
      this.$forceUpdate();
    }

    deletePhrase(item: MUnitPhrase) {
      this.phrasesUnitService.delete(item);
    }

    googlePhrase(phrase: string) {
      googleString(phrase);
    }
  }
</script>

<style>
  @import '../../assets/common.css';
</style>
