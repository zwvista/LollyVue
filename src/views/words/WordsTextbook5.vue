<template>
  <div>
    <Toolbar>
      <template #start>
        <DropDown :options="settingsService.wordFilterTypes" optionLabel="label" optionValue="value" v-model="filterType" @change="onRefresh" />
        <span class="p-float-label">
          <InputText id="filter" type="text" v-model="filter" @keyup.enter="onRefresh" />
          <label for="filter">Filter</label>
        </span>
        <DropDown :options="settingsService.textbookFilters" optionLabel="label" optionValue="value" v-model="textbookFilter" @change="onRefresh" />
        <Button icon="fa fa-refresh" label="Refresh" @click="onRefresh()" />
        <router-link to="/words-dict/textbook/0">
          <Button icon="fa fa-book" label="Dictionary" />
        </router-link>
      </template>
    </Toolbar>
    <Paginator :rows.sync="rows" :totalRecords="wordsUnitService.textbookWordCount" :rowsPerPageOptions="settingsService.USROWSPERPAGEOPTIONS" @page="onRefresh" />
    <DataTable
      :value="wordsUnitService.textbookWords"
    >
      <Column headerStyle="width: 80px" field="ID" header="ID" />
      <Column headerStyle="width: 150px" field="TEXTBOOKNAME" header="TEXTBOOKNAME" />
      <Column headerStyle="width: 80px" field="UNITSTR" header="UNIT" />
      <Column headerStyle="width: 80px" field="PARTSTR" header="PART" />
      <Column headerStyle="width: 80px" field="SEQNUM" header="SEQNUM" />
      <Column headerStyle="width: 80px" field="WORDID" header="WORDID" />
      <Column field="WORD" header="WORD" />
      <Column field="NOTE" header="NOTE" />
      <Column headerStyle="width: 80px" field="ACCURACY" header="ACCURACY" />
      <Column headerStyle="width: 30%" header="ACTIONS">
        <template #body="slotProps">
          <Button v-tooltip.top="'Delete'" icon="fa fa-trash" class="p-button-danger" @click="deleteWord(slotProps.data)" />
          <router-link :to="{ name: 'words-textbook-detail', params: { id: slotProps.data.ID }}">
            <Button v-tooltip.top="'Edit'" icon="fa fa-edit" />
          </router-link>
          <Button v-tooltip.top="'Speak'" icon="fa fa-volume-up" @click="settingsService.speak(slotProps.data.WORD)" />
          <Button v-tooltip.top="'Copy'" icon="fa fa-copy" v-clipboard:copy="slotProps.data.WORD" />
          <Button v-tooltip.top="'Google Word'" icon="fa fa-google" @click="googleWord(slotProps.data.WORD)" />
          <router-link :to="{ name: 'words-dict', params: { type: 'textbook', index: slotProps.index }}">
            <Button v-tooltip.top="'Dictionary'" icon="fa fa-book" />
          </router-link>
          <Button v-show="settingsService.selectedDictNote" label="Get Note" class="p-button-warning" @click="getNote(slotProps.data)" />
          <Button v-show="settingsService.selectedDictNote" label="Clear Note" class="p-button-warning" @click="clearNote(slotProps.data)" />
        </template>
      </Column>
    </DataTable>
    <Paginator :rows.sync="rows" :totalRecords="wordsUnitService.textbookWordCount" :rowsPerPageOptions="settingsService.USROWSPERPAGEOPTIONS" @page="onRefresh" />
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { SettingsService } from '@/shared/view-models/misc/settings.service';
  import { googleString } from '@/shared/common/common';
  import { WordsUnitService } from '@/shared/view-models/wpp/words-unit.service';
  import { MUnitWord } from '@/shared/models/wpp/unit-word';
  import { AppService } from '@/shared/view-models/misc/app.service';
  import { container } from 'tsyringe';

  @Component
  export default class WordsTextbook5 extends Vue {
    appService = container.resolve(AppService);
    wordsUnitService = container.resolve(WordsUnitService);
    settingsService = container.resolve(SettingsService);

    page = 1;
    pageCount = 1;
    rows = 0;
    filter = '';
    filterType = 0;
    textbookFilter = 0;

    services = {};
    async created() {
      this.$set(this.services, 'wordsUnitService', this.wordsUnitService);
      await this.appService.getData();
      this.rows = this.settingsService.USROWSPERPAGE;
      await this.onRefresh();
    }

    async onRefresh() {
      // https://stackoverflow.com/questions/4228356/integer-division-with-remainder-in-javascript
      await this.wordsUnitService.getDataInLang(this.page, this.rows, this.filter, this.filterType, this.textbookFilter);
      this.pageCount = (this.wordsUnitService.textbookWordCount + this.rows - 1) / this.rows >> 0;
      this.$forceUpdate();
    }

    deleteWord(item: MUnitWord) {
      this.wordsUnitService.delete(item);
    }

    async getNote(item: MUnitWord) {
      await this.wordsUnitService.getNote(item);
    }

    async clearNote(item: MUnitWord) {
      await this.wordsUnitService.clearNote(item);
    }

    googleWord(word: string) {
      googleString(word);
    }
  }
</script>

<style>
  @import '../../assets/common.css';
</style>
