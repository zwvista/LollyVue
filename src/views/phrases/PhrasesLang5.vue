<template>
  <div>
    <Toolbar>
      <template #start>
        <DropDown :options="settingsService.phraseFilterTypes" optionLabel="label" optionValue="value" v-model="phrasesLangService.filterType" @change="onRefresh" />
        <span class="p-float-label">
          <InputText id="filter" type="text" v-model="phrasesLangService.filter" @keyup.enter="onRefresh" />
          <label for="filter">Filter</label>
        </span>
        <router-link to="/phrases-lang-detail/0">
          <Button icon="fa fa-plus" label="Add" />
        </router-link>
        <Button icon="fa fa-refresh" label="Refresh" @click="onRefresh()" />
      </template>
    </Toolbar>
    <Paginator :rows.sync="phrasesLangService.rows" :totalRecords="phrasesLangService.langPhraseCount" :rowsPerPageOptions="settingsService.USROWSPERPAGEOPTIONS" @page="onRefresh" />
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
    <Paginator :rows.sync="phrasesLangService.rows" :totalRecords="phrasesLangService.langPhraseCount" :rowsPerPageOptions="settingsService.USROWSPERPAGEOPTIONS" @page="onRefresh" />
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { PhrasesLangService } from '@/shared/view-models/wpp/phrases-lang.service';
  import { googleString } from '@/shared/common/common';
  import { SettingsService } from '@/shared/view-models/misc/settings.service';
  import { AppService } from '@/shared/view-models/misc/app.service';
  import { MLangPhrase } from '@/shared/models/wpp/lang-phrase';
  import { container } from 'tsyringe';

  @Component
  export default class PhrasesLang5 extends Vue {
    appService = container.resolve(AppService);
    phrasesLangService = container.resolve(PhrasesLangService);
    settingsService = container.resolve(SettingsService);

    pageCount = 1;

    services = {};
    async created() {
      this.$set(this.services, 'phrasesLangService', this.phrasesLangService);
      await this.appService.getData();
      this.phrasesLangService.rows = this.settingsService.USROWSPERPAGE;
      await this.onRefresh();
    }

    async rowsChange(rows: number) {
      this.phrasesLangService.page = 1;
      await this.onRefresh();
    }

    async onRefresh() {
      // https://stackoverflow.com/questions/4228356/integer-division-with-remainder-in-javascript
      await this.phrasesLangService.getData();
      this.pageCount = (this.phrasesLangService.langPhraseCount + this.phrasesLangService.rows - 1) / this.phrasesLangService.rows >> 0;
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
