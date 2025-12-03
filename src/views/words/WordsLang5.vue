<template>
  <div>
    <Toolbar>
      <template #start>
        <DropDown :options="settingsService.wordFilterTypes" optionLabel="label" optionValue="value" v-model="wordsLangService.filterType" @change="onRefresh" />
        <span class="p-float-label">
          <InputText id="filter" type="text" v-model="wordsLangService.filter" @keyup.enter="onRefresh" />
          <label for="filter">Filter</label>
        </span>
        <router-link to="/words-lang-detail/0">
          <Button icon="fa fa-plus" label="Add" />
        </router-link>
        <Button icon="fa fa-refresh" label="Refresh" @click="onRefresh()" />
        <router-link to="/words-dict/lang/0">
          <Button icon="fa fa-book" label="Dictionary" />
        </router-link>
      </template>
    </Toolbar>
    <Paginator :rows.sync="rows" :totalRecords="wordsLangService.langWordsCount" :rowsPerPageOptions="settingsService.USROWSPERPAGEOPTIONS" @page="onRefresh" />
    <DataTable
      :value="wordsLangService.langWords"
    >
      <Column headerStyle="width: 80px" field="ID" header="ID" />
      <Column field="WORD" header="WORD" />
      <Column field="NOTE" header="NOTE" />
      <Column headerStyle="width: 80px" field="ACCURACY" header="ACCURACY" />
      <Column headerStyle="width: 30%" header="ACTIONS">
        <template #body="slotProps">
          <Button v-tooltip.top="'Delete'" icon="fa fa-trash" class="p-button-danger" @click="deleteWord(slotProps.data)" />
          <router-link :to="{ name: 'words-lang-detail', params: { id: slotProps.data.ID }}">
            <Button v-tooltip.top="'Edit'" icon="fa fa-edit" />
          </router-link>
          <Button v-tooltip.top="'Speak'" icon="fa fa-volume-up" @click="settingsService.speak(slotProps.data.WORD)" />
          <Button v-tooltip.top="'Copy'" icon="fa fa-copy" v-clipboard:copy="slotProps.data.WORD" />
          <Button v-tooltip.top="'Google Word'" icon="fa fa-google" @click="googleWord(slotProps.data.WORD)" />
          <router-link :to="{ name: 'words-dict', params: { type: 'lang', index: slotProps.index }}">
            <Button v-tooltip.top="'Dictionary'" icon="fa fa-book" />
          </router-link>
          <Button v-show="settingsService.selectedDictNote" label="Get Note" class="p-button-warning" @click="getNote(slotProps.data)" />
          <Button v-show="settingsService.selectedDictNote" label="Clear Note" class="p-button-warning" @click="clearNote(slotProps.data)" />
        </template>
      </Column>
    </DataTable>
    <Paginator :rows.sync="rows" :totalRecords="wordsLangService.langWordsCount" :rowsPerPageOptions="settingsService.USROWSPERPAGEOPTIONS" @page="onRefresh" />
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { WordsLangService } from '@/shared/view-models/wpp/words-lang.service';
  import { SettingsService } from '@/shared/view-models/misc/settings.service';
  import { googleString } from '@/shared/common/common';
  import { MLangWord } from '@/shared/models/wpp/lang-word';
  import { AppService } from '@/shared/view-models/misc/app.service';
  import { container } from 'tsyringe';

  @Component
  export default class WordsLang5 extends Vue {
    appService = container.resolve(AppService);
    wordsLangService = container.resolve(WordsLangService);
    settingsService = container.resolve(SettingsService);

    page = 1;
    pageCount = 1;
    rows = 0;

    services = {};
    async created() {
      this.$set(this.services, 'wordsLangService', this.wordsLangService);
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
      await this.wordsLangService.getData(this.page, this.rows);
      this.pageCount = (this.wordsLangService.langWordsCount + this.rows - 1) / this.rows >> 0;
      this.$forceUpdate();
    }

    deleteWord(item: MLangWord) {
      this.wordsLangService.delete(item);
    }

    async getNote(index: MLangWord) {
      await this.wordsLangService.getNote(index);
    }

    async clearNote(index: MLangWord) {
      await this.wordsLangService.clearNote(index);
    }

    googleWord(word: string) {
      googleString(word);
    }
  }
</script>

<style>
  @import '../../assets/common.css';
</style>
