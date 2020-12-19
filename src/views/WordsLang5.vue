<template>
  <div>
    <Toolbar>
      <template slot="left">
        <span class="p-float-label">
          <InputText id="word" type="text" v-model="newWord" @keyup.enter="onEnterNewWord" />
          <label for="word">New Word</label>
        </span>
        <Button v-tooltip.top="'Speak'" v-show="settingsService.selectedVoice" icon="fa fa-volume-up" @click="settingsService.speak(newWord)" />
        <DropDown :options="settingsService.wordFilterTypes" optionLabel="label" optionValue="value" v-model="filterType" @change="onRefresh" />
        <span class="p-float-label">
          <InputText id="filter" type="text" v-model="filter" @keyup.enter="onRefresh" />
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
          <Button v-show="settingsService.selectedDictNote" label="Retrieve Note" class="p-button-warning" @click="getNote(slotProps.index)" />
        </template>
      </Column>
    </DataTable>
    <Paginator :rows.sync="rows" :totalRecords="wordsLangService.langWordsCount" :rowsPerPageOptions="settingsService.USROWSPERPAGEOPTIONS" @page="onRefresh" />
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { inject } from 'vue-typescript-inject';
  import { WordsLangService } from '@/view-models/words-lang.service';
  import { SettingsService } from '@/view-models/settings.service';
  import { googleString } from '@/common/common';
  import { MLangWord } from '@/models/wpp/lang-word';
  import { AppService } from '@/view-models/app.service';

  @Component
  export default class WordsLang5 extends Vue {
    @inject() appService!: AppService;
    @inject() wordsLangService!: WordsLangService;
    @inject() settingsService!: SettingsService;

    newWord = '';
    page = 1;
    pageCount = 1;
    rows = 0;
    filter = '';
    filterType = 0;

    services = {};
    created() {
      this.$set(this.services, 'wordsLangService', this.wordsLangService);
      this.appService.initializeObject.subscribe(_ => {
        this.rows = this.settingsService.USROWSPERPAGE;
        this.onRefresh();
      });
    }

    onEnterNewWord() {
      if (!this.newWord) return;
      const o = this.wordsLangService.newLangWord();
      o.WORD = this.settingsService.autoCorrectInput(this.newWord);
      this.newWord = '';
      this.wordsLangService.create(o).subscribe(id => {
        o.ID = id as number;
        this.wordsLangService.langWords.push(o);
      });
    }

    rowsChange(rows: number) {
      this.page = 1;
      this.onRefresh();
    }

    onRefresh() {
      // https://stackoverflow.com/questions/4228356/integer-division-with-remainder-in-javascript
      this.wordsLangService.getData(this.page, this.rows, this.filter, this.filterType).subscribe(_ => {
        this.pageCount = (this.wordsLangService.langWordsCount + this.rows - 1) / this.rows >> 0;
        this.$forceUpdate();
      });
    }

    deleteWord(item: MLangWord) {
      this.wordsLangService.delete(item);
    }

    getNote(index: number) {
      console.log(index);
      this.wordsLangService.getNote(index).subscribe();
    }

    googleWord(word: string) {
      googleString(word);
    }
  }
</script>

<style>
  @import '../assets/common.css';
</style>
