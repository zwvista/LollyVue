<template>
  <div>
    <q-toolbar :inverted="true">
      <q-input float-label="New Word" v-model="newWord" @keyup.enter="onEnter"></q-input>
      <q-btn v-show="settingsService.selectedVoice" round color="primary" icon="fa fa-volume-up"
             @click="settingsService.speak(newWord)">
        <q-tooltip>Speak</q-tooltip>
      </q-btn>
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
        <q-td key="LEVEL" :props="props">{{props.row.LEVEL}}</q-td>
        <q-td key="ACTIONS" :props="props">
          <q-btn round color="red" icon="fa fa-trash" size="xs" @click="deleteWord(props.row)">
            <q-tooltip>Delete</q-tooltip>
          </q-btn>
          <router-link :to="{ name: 'words-unit-detail', params: { id: props.row.ID }}">
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
          <q-btn round color="secondary" icon="fa fa-arrow-up" size="xs" @click="updateLevel(props.row, 1)">
            <q-tooltip>Level Up</q-tooltip>
          </q-btn>
          <q-btn round color="secondary" icon="fa fa-arrow-down" size="xs" @click="updateLevel(props.row, -1)">
            <q-tooltip>Level Down</q-tooltip>
          </q-btn>
          <q-btn round color="primary" icon="fa fa-google" size="xs" @click="googleWord(props.row.WORD)">
            <q-tooltip>Google Word</q-tooltip>
          </q-btn>
          <router-link :to="{ name: 'words-dict', params: { type: 'unit', index: wordsLangService.langWords.indexOf(props.row) }}">
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
  import { SettingsService } from '@/view-models/settings.service';
  import { googleString } from '@/common/common';
  import { MUnitWord } from '@/models/unit-word';
  import { WordsLangService } from '@/view-models/words-lang.service';
  import { MLangWord } from '@/models/lang-word';

  @Component
  export default class WordsUnit2 extends Vue {
    @inject() wordsLangService!: WordsLangService;
    @inject() settingsService!: SettingsService;

    columns = [
      { name: 'ID', field: 'ID', label: 'ID' },
      { name: 'WORD', field: 'WORD', label: 'WORD' },
      { name: 'NOTE', field: 'NOTE', label: 'NOTE' },
      { name: 'LEVEL', field: 'LEVEL', label: 'LEVEL' },
      { name: 'ACTIONS', label: 'ACTIONS' },
    ];
    pagination = {
      page: 1,
      rowsPerPage: this.settingsService.USROWSPERPAGE,
      rowsNumber: 10,
    };
    newWord = '';

    services = {};
    created() {
      this.$set(this.services, 'wordsLangService', this.wordsLangService);
      this.onRefresh();
    }

    request({pagination}) {
      this.pagination.page = pagination.page;
      this.pagination.rowsPerPage = pagination.rowsPerPage;
      this.onRefresh();
    }

    onEnter() {
      if (!this.newWord) return;
      const o = this.wordsLangService.newLangWord();
      o.WORD = this.settingsService.autoCorrectInput(this.newWord);
      this.newWord = '';
      this.wordsLangService.create(o).subscribe(id => {
        o.ID = id as number;
        this.wordsLangService.langWords.push(o);
      });
    }

    onRefresh(page: number, rows: number) {
      this.wordsLangService.getData(this.pagination.page, this.pagination.rowsPerPage).subscribe(_ => {
        this.pagination.rowsNumber = this.wordsLangService.langWordsCount;
        this.$forceUpdate();
      });
    }

    deleteWord(id: number) {
      this.wordsLangService.delete(id);
    }

    getNote(index: number) {
      console.log(index);
      this.wordsLangService.getNote(index).subscribe();
    }

    googleWord(word: string) {
      googleString(word);
    }

    updateLevel(item: MLangWord, delta: number) {
      this.settingsService.updateLevel(item, item.ID, delta).subscribe();
    }
  }
</script>

<style scoped>
</style>
