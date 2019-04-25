<template>
  <div>
    <q-toolbar :inverted="true">
      <q-input float-label="New Word" v-model="newWord" @keyup.enter="onEnter"></q-input>
      <q-btn v-show="settingsService.selectedVoice" round color="primary" icon="fa fa-volume-up"
             @click="settingsService.speak(newWord)">
        <q-tooltip>Speak</q-tooltip>
      </q-btn>
      <router-link to="/words-unit-detail/0">
        <q-btn color="primary" icon="fa fa-plus" label="Add"></q-btn>
      </router-link>
      <q-btn color="primary" icon="fa fa-refresh" label="Refresh" @click="onRefresh()"></q-btn>
      <q-btn v-show="settingsService.selectedDictNote" color="secondary" label="Retrieve All Notes"></q-btn>
      <q-btn v-show="settingsService.selectedDictNote" color="secondary" label="Retrieve Notes If Empty"></q-btn>
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
          <router-link :to="{ name: 'words-dict', params: { type: 'unit', index: wordsUnitService.unitWords.indexOf(props.row) }}">
            <q-btn round color="primary" icon="fa fa-book" size="xs">
              <q-tooltip>Dictionary</q-tooltip>
            </q-btn>
          </router-link>
          <q-btn v-show="settingsService.selectedDictNote" color="secondary" label="Retrieve Note"
                 @click="getNote(props.item.WORD)">
          </q-btn>
        </q-td>
      </q-tr>
    </q-table>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { inject } from 'vue-typescript-inject';
  import { WordsUnitService } from '@/view-models/words-unit.service';
  import { SettingsService } from '@/view-models/settings.service';
  import { googleString } from '@/common/common';
  import { MUnitWord } from '@/models/unit-word';

  @Component
  export default class WordsUnit2 extends Vue {
    @inject() wordsUnitService!: WordsUnitService;
    @inject() settingsService!: SettingsService;

    columns = [
      { name: 'ID', field: 'ID', label: 'ID' },
      { name: 'UNIT', field: 'UNITSTR', label: 'UNIT' },
      { name: 'PART', field: 'PARTSTR', label: 'PART' },
      { name: 'SEQNUM', field: 'SEQNUM', label: 'SEQNUM' },
      { name: 'WORDID', field: 'WORDID', label: 'WORDID' },
      { name: 'WORD', field: 'WORD', label: 'WORD' },
      { name: 'NOTE', field: 'NOTE', label: 'NOTE' },
      { name: 'LEVEL', field: 'LEVEL', label: 'LEVEL' },
      { name: 'ACTIONS', label: 'ACTIONS' },
    ];
    pagination = {
      page: 1,
      rowsPerPage: 0, // current rows per page being displayed
    };
    newWord = '';

    services = {};
    created() {
      this.$set(this.services, 'wordsUnitService', this.wordsUnitService);
      this.onRefresh();
    }

    mounted() {
    }

    onEnter() {
      if (!this.newWord) return;
      const o = this.wordsUnitService.newUnitWord();
      o.WORD = this.settingsService.autoCorrectInput(this.newWord);
      this.newWord = '';
      this.wordsUnitService.create(o).subscribe(id => {
        o.ID = id as number;
        this.wordsUnitService.unitWords.push(o);
      });
    }

    onRefresh() {
      this.wordsUnitService.getDataInTextbook().subscribe();
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

    getNotes(ifEmpty: boolean) {
      this.wordsUnitService.getNotes(ifEmpty, () => {}, () => {});
    }

    updateLevel(item: MUnitWord, delta: number) {
      this.settingsService.updateLevel(item, item.WORDID, delta).subscribe();
    }
  }
</script>

<style scoped>
</style>
