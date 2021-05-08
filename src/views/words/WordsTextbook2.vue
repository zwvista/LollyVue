<template>
  <div>
    <q-toolbar :inverted="true">
      <q-select :options="settingsService.wordFilterTypes" v-model="filterType" @input="onRefresh"></q-select>
      <q-input float-label="Filter" v-model="filter" @keyup.enter="onRefresh"></q-input>
      <q-select :options="settingsService.textbookFilters" v-model="textbookFilter" @input="onRefresh"></q-select>
      <q-btn color="primary" icon="fa fa-refresh" label="Refresh" @click="onRefresh()"></q-btn>
      <router-link to="/words-dict/textbook/0">
        <q-btn color="primary" icon="fa fa-book" label="Dictionary"></q-btn>
      </router-link>
    </q-toolbar>
    <q-table
      :data="wordsUnitService.textbookWords"
      :columns="columns"
      row-key="ID"
      :pagination.sync="pagination"
      :rows-per-page-options="settingsService.USROWSPERPAGEOPTIONS"
      @request="request"
    >
      <q-tr slot="body" slot-scope="props" :props="props" :style="props.row.colorStyle">
        <q-td key="ID" :props="props">{{props.row.ID}}</q-td>
        <q-td key="TEXTBOOKNAME" :props="props">{{props.row.TEXTBOOKNAME}}</q-td>
        <q-td key="UNIT" :props="props">{{props.row.UNITSTR}}</q-td>
        <q-td key="PART" :props="props">{{props.row.PARTSTR}}</q-td>
        <q-td key="SEQNUM" :props="props">{{props.row.SEQNUM}}</q-td>
        <q-td key="WORDID" :props="props">{{props.row.WORDID}}</q-td>
        <q-td key="WORD" :props="props">{{props.row.WORD}}</q-td>
        <q-td key="NOTE" :props="props">{{props.row.NOTE}}</q-td>
        <q-td key="ACCURACY" :props="props">{{props.row.ACCURACY}}</q-td>
        <q-td key="ACTIONS" :props="props">
          <q-btn round color="red" icon="fa fa-trash" size="xs" @click="deleteWord(props.row)">
            <q-tooltip>Delete</q-tooltip>
          </q-btn>
          <router-link :to="{ name: 'words-textbook-detail', params: { id: props.row.ID }}">
            <q-btn round color="primary" icon="fa fa-edit" size="xs">
              <q-tooltip>Edit</q-tooltip>
            </q-btn>
          </router-link>
          <q-btn v-show="settingsService.selectedVoice" round color="primary" icon="fa fa-volume-up" size="xs"
                 @click="settingsService.speak(props.row.WORD)">
            <q-tooltip>Speak</q-tooltip>
          </q-btn>
          <q-btn round color="primary" icon="fa fa-copy" size="xs" v-clipboard:copy="props.row.WORD">
            <q-tooltip>Copy</q-tooltip>
          </q-btn>
          <q-btn round color="primary" icon="fa fa-google" size="xs" @click="googleWord(props.row.WORD)">
            <q-tooltip>Google Word</q-tooltip>
          </q-btn>
          <router-link :to="{ name: 'words-dict', params: { type: 'textbook', index: wordsUnitService.textbookWords.indexOf(props.row) }}">
            <q-btn round color="primary" icon="fa fa-book" size="xs">
              <q-tooltip>Dictionary</q-tooltip>
            </q-btn>
          </router-link>
          <q-btn v-show="settingsService.selectedDictNote" color="secondary" label="Retrieve Note"
                 @click="getNote(wordsUnitService.textbookWords.indexOf(props.row))">
          </q-btn>
        </q-td>
      </q-tr>
    </q-table>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { inject } from 'vue-typescript-inject';
  import { WordsUnitService } from '@/view-models/wpp/words-unit.service';
  import { SettingsService } from '@/view-models/misc/settings.service';
  import { googleString } from '@/common/common';
  import { MUnitWord } from '@/models/wpp/unit-word';
  import { AppService } from '@/view-models/misc/app.service';

  @Component
  export default class WordsTextbook2 extends Vue {
    @inject() appService!: AppService;
    @inject() wordsUnitService!: WordsUnitService;
    @inject() settingsService!: SettingsService;

    columns = [
      { name: 'ID', field: 'ID', label: 'ID' },
      { name: 'TEXTBOOKNAME', field: 'TEXTBOOKNAME', label: 'TEXTBOOKNAME' },
      { name: 'UNIT', field: 'UNITSTR', label: 'UNIT' },
      { name: 'PART', field: 'PARTSTR', label: 'PART' },
      { name: 'SEQNUM', field: 'SEQNUM', label: 'SEQNUM' },
      { name: 'WORDID', field: 'WORDID', label: 'WORDID' },
      { name: 'WORD', field: 'WORD', label: 'WORD' },
      { name: 'NOTE', field: 'NOTE', label: 'NOTE' },
      { name: 'ACCURACY', field: 'ACCURACY', label: 'ACCURACY' },
      { name: 'ACTIONS', label: 'ACTIONS' },
    ];
    pagination = {
      page: 1,
      rowsPerPage: 0,
      rowsNumber: 10,
    };
    filter = '';
    filterType = 0;
    textbookFilter = 0;

    services = {};
    created() {
      this.$set(this.services, 'wordsUnitService', this.wordsUnitService);
      this.appService.initializeObject.subscribe(_ => {
        this.pagination.rowsPerPage = this.settingsService.USROWSPERPAGE;
        this.onRefresh();
      });
    }

    request({pagination}) {
      this.pagination.page = pagination.page;
      this.pagination.rowsPerPage = pagination.rowsPerPage;
      this.onRefresh();
    }

    onRefresh() {
      this.wordsUnitService.getDataInLang(this.pagination.page, this.pagination.rowsPerPage, this.filter, this.filterType, this.textbookFilter).subscribe(_ => {
        this.pagination.rowsNumber = this.wordsUnitService.textbookWordCount;
        this.$forceUpdate();
      });
    }

    deleteWord(item: MUnitWord) {
      this.wordsUnitService.delete(item);
    }

    getNote(index: number) {
      console.log(index);
      this.wordsUnitService.getNote(index).subscribe();
    }

    googleWord(word: string) {
      googleString(word);
    }
  }
</script>

<style scoped>
</style>
