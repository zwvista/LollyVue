<template>
  <div>
    <Toolbar>
      <template #start>
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
  import { PhrasesLangService } from '@/view-models/wpp/phrases-lang.service';
  import { googleString } from '@/common/common';
  import { SettingsService } from '@/view-models/misc/settings.service';
  import { AppService } from '@/view-models/misc/app.service';
  import { MLangPhrase } from '@/models/wpp/lang-phrase';
  import { container } from 'tsyringe';

  @Component
  export default class PhrasesLang5 extends Vue {
    appService = container.resolve(AppService);
    phrasesLangService = container.resolve(PhrasesLangService);
    settingsService = container.resolve(SettingsService);

    page = 1;
    pageCount = 1;
    rows = 0;
    filter = '';
    filterType = 0;

    services = {};
    async created() {
      this.$set(this.services, 'phrasesLangService', this.phrasesLangService);
      await this.appService.getData();
      this.rows = this.settingsService.USROWSPERPAGE;
      await this.onRefresh();
    }

    async rowsChange(rows: number) {
      this.page = 1;
      await this.onRefresh();
    }

    async onRefresh() {
      // https://stackoverflow.com/questions/4228356/integer-division-with-remainder-in-javascript
      await this.phrasesLangService.getData(this.page, this.rows, this.filter, this.filterType);
      this.pageCount = (this.phrasesLangService.langPhraseCount + this.rows - 1) / this.rows >> 0;
      this.$forceUpdate();
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
  @import '../../assets/common.css';
</style>
