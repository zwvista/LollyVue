<template>
  <div>
    <q-toolbar :inverted="true">
      <q-input float-label="New Word" v-model="newWord" @keyup.enter="onEnterNewWord"></q-input>
      <q-btn v-show="settingsService.selectedVoice" round color="primary" icon="fa fa-volume-up"
             @click="settingsService.speak(newWord)">
        <q-tooltip>Speak</q-tooltip>
      </q-btn>
      <q-select :options="settingsService.wordFilterTypes" v-model="filterType" @input="onRefresh"></q-select>
      <q-input float-label="Filter" v-model="filter" @keyup.enter="onRefresh"></q-input>
      <router-link to="/words-lang-detail/0">
        <q-btn color="primary" icon="fa fa-plus" label="Add"></q-btn>
      </router-link>
      <q-btn color="primary" icon="fa fa-refresh" label="Refresh" @click="onRefresh()"></q-btn>
      <router-link to="/words-dict/lang/0">
        <q-btn color="primary" icon="fa fa-book" label="Dictionary"></q-btn>
      </router-link>
    </q-toolbar>
    <q-table
      :data="wordsLangService.langWords"
      :columns="columns"
      row-key="ID"
      :pagination.sync="pagination"
      :rows-per-page-options="settingsService.USROWSPERPAGEOPTIONS"
      @request="request"
    >
      <q-tr slot="body" slot-scope="props" :props="props" :style="props.row.colorStyle">
        <q-td key="ID" :props="props">{{props.row.ID}}</q-td>
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
          <router-link :to="{ name: 'words-lang-detail', params: { id: props.row.ID }}">
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
          <router-link :to="{ name: 'words-dict', params: { type: 'lang', index: wordsLangService.langWords.indexOf(props.row) }}">
            <q-btn round color="primary" icon="fa fa-book" size="xs">
              <q-tooltip>Dictionary</q-tooltip>
            </q-btn>
          </router-link>
          <q-btn v-show="settingsService.selectedDictNote" color="secondary" label="Retrieve Note"
                 @click="getNote(wordsLangService.langWords.indexOf(props.row))">
          </q-btn>
        </q-td>
      </q-tr>
    </q-table>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { inject } from 'vue-typescript-inject';
  import { SettingsService } from '@/view-models/misc/settings.service';
  import { googleString } from '@/common/common';
  import { MUnitWord } from '@/models/wpp/unit-word';
  import { WordsLangService } from '@/view-models/wpp/words-lang.service';
  import { MLangWord } from '@/models/wpp/lang-word';
  import { AppService } from '@/view-models/misc/app.service';

  @Component
  export default class WordsLang2 extends Vue {
    @inject() appService!: AppService;
    @inject() wordsLangService!: WordsLangService;
    @inject() settingsService!: SettingsService;

    columns = [
      { name: 'ID', field: 'ID', label: 'ID' },
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
    newWord = '';
    filter = '';
    filterType = 0;

    services = {};
    created() {
      this.$set(this.services, 'wordsLangService', this.wordsLangService);
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

    onRefresh() {
      this.wordsLangService.getData(this.pagination.page, this.pagination.rowsPerPage, this.filter, this.filterType).subscribe(_ => {
        this.pagination.rowsNumber = this.wordsLangService.langWordsCount;
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

<style scoped>
</style>
