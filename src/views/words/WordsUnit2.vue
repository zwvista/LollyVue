<template>
  <div>
    <q-toolbar :inverted="true">
      <q-input float-label="New Word" v-model="wordsUnitService.newWord" @keyup.enter="onEnterNewWord"></q-input>
      <q-btn v-show="settingsService.selectedVoice" round color="primary" icon="fa fa-volume-up"
             @click="settingsService.speak(newWord)">
        <q-tooltip>Speak</q-tooltip>
      </q-btn>
      <q-select :options="settingsService.wordFilterTypes" v-model="wordsUnitService.filterType" @input="onRefresh"></q-select>
      <q-input float-label="Filter" v-model="wordsUnitService.filter" @keyup.enter="onRefresh"></q-input>
      <router-link to="/words-unit-detail/0">
        <q-btn color="primary" icon="fa fa-plus" label="Add"></q-btn>
      </router-link>
      <q-btn color="primary" icon="fa fa-refresh" label="Refresh" @click="onRefresh()"></q-btn>
      <q-checkbox v-model="wordsUnitService.ifEmpty" label="If Empty" />
      <q-btn v-show="settingsService.selectedDictNote" color="secondary" label="Get Notes" @click="getNotes()"></q-btn>
      <q-btn v-show="settingsService.selectedDictNote" color="secondary" label="Clear Notes" @click="clearNotes()"></q-btn>
      <router-link to="/words-dict/unit/0">
        <q-btn color="primary" icon="fa fa-book" label="Dictionary"></q-btn>
      </router-link>
    </q-toolbar>
    <q-table
      :data="wordsUnitService.unitWords"
      :columns="columns"
      row-key="ID"
      :pagination.sync="pagination"
      :rows-per-page-options="[]"
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
          <q-btn round color="primary" icon="fa fa-google" size="xs" @click="googleWord(props.row.WORD)">
            <q-tooltip>Google Word</q-tooltip>
          </q-btn>
          <router-link :to="{ name: 'words-dict', params: { type: 'unit', index: wordsUnitService.unitWords.indexOf(props.row) }}">
            <q-btn round color="primary" icon="fa fa-book" size="xs">
              <q-tooltip>Dictionary</q-tooltip>
            </q-btn>
          </router-link>
          <q-btn v-show="settingsService.selectedDictNote" color="secondary" label="Get Note"
                 @click="getNote(props.row)">
          </q-btn>
          <q-btn v-show="settingsService.selectedDictNote" color="secondary" label="Clear Note"
                 @click="clearNote(props.row)">
          </q-btn>
        </q-td>
      </q-tr>
    </q-table>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { WordsUnitService } from '@/shared/view-models/wpp/words-unit.service';
  import { SettingsService } from '@/shared/view-models/misc/settings.service';
  import { googleString } from '@/shared/common/common';
  import { MUnitWord } from '@/shared/models/wpp/unit-word';
  import { AppService } from '@/shared/view-models/misc/app.service';
  import { container } from 'tsyringe';

  @Component
  export default class WordsUnit2 extends Vue {
    appService = container.resolve(AppService);
    wordsUnitService = container.resolve(WordsUnitService);
    settingsService = container.resolve(SettingsService);

    columns = [
      { name: 'ID', field: 'ID', label: 'ID' },
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
      rowsPerPage: 0, // current rows per page being displayed
    };

    services = {};
    async created() {
      this.$set(this.services, 'wordsUnitService', this.wordsUnitService);
      await this.appService.getData();
      await this.onRefresh();
    }

    async onEnterNewWord() {
      await this.wordsUnitService.createWithNewWord();
    }

    async onRefresh() {
      await this.wordsUnitService.getDataInTextbook();
    }

    async deleteWord(item: MUnitWord) {
      await this.wordsUnitService.delete(item);
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

    getNotes() {
      this.wordsUnitService.getNotes(() => {}, () => {});
    }

    clearNotes() {
      this.wordsUnitService.clearNotes(() => {}, () => {});
    }
  }
</script>

<style scoped>
</style>
