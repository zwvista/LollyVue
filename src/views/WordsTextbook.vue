<template>
  <div>
    <v-toolbar>
      <v-btn color="info"><v-icon left>fa-refresh</v-icon>Refresh</v-btn>
      <router-link to="/words-dict/0">
        <v-btn color="info">Dictionary</v-btn>
      </router-link>
    </v-toolbar>
    <v-data-table
      :headers="headers"
      :items="wordsTextbookService.textbookWords"
      hide-actions
      class="elevation-1"
      ref="sortableTable"
      item-key="ID"
    >
      <template slot="items" slot-scope="props">
        <tr class="sortableRow" :key="props.item.ENTRYID">
          <td class="px-1" style="width: 0.1%">
            <v-btn style="cursor: move" icon class="sortHandle"><v-icon>fa-bars</v-icon></v-btn>
          </td>
          <td>{{ props.item.TEXTBOOKNAME }}</td>
          <td>{{ props.item.UNIT }}</td>
          <td>{{ props.item.PART }}</td>
          <td>{{ props.item.SEQNUM }}</td>
          <td>{{ props.item.WORD }}</td>
          <td>{{ props.item.NOTE }}</td>
          <td>
            <v-tooltip top>
              <v-btn slot="activator" icon color="error"><v-icon>fa-trash</v-icon></v-btn>
              <span>Delete</span>
            </v-tooltip>
            <router-link :to="{ name: 'words-textbook-detail', params: { id: props.item.ID }}">
              <v-tooltip top>
                <v-btn slot="activator" icon color="info"><v-icon>fa-edit</v-icon></v-btn>
                <span>Edit</span>
              </v-tooltip>
            </router-link>
            <v-tooltip top>
              <v-btn slot="activator" icon color="info" v-clipboard:copy="props.item.WORD"><v-icon>fa-copy</v-icon></v-btn>
              <span>Copy</span>
            </v-tooltip>
            <v-btn color="info">Retrieve Note</v-btn>
            <v-btn color="info" @click="getNote(props.item.WORD)">Retrieve Note</v-btn>
            <v-btn color="info" @click="googleWord(props.item.WORD)">Google Word</v-btn>
            <router-link :to="{ name: 'words-dict', params: { index: props.index }}">
              <v-btn color="info">Dictionary</v-btn>
            </router-link>
          </td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { inject } from 'vue-typescript-inject';
import { WordsTextbookService } from '../view-models/words-textbook.service';
import Sortable from 'sortablejs';
import { SettingsService } from '@/view-models/settings.service';
import { googleString } from '@/common/common';

@Component
export default class WordsTextbook extends Vue {
  @inject() wordsTextbookService!: WordsTextbookService;
  @inject() settingsService!: SettingsService;

  headers = [
    { text: 'TEXTBOOKNAME', sortable: false, value: 'TEXTBOOKNAME' },
    { text: 'UNIT', sortable: false, value: 'UNIT' },
    { text: 'PART', sortable: false, value: 'PART' },
    { text: 'SEQNUM', sortable: false, value: 'SEQNUM' },
    { text: 'WORD', sortable: false, value: 'WORD' },
    { text: 'NOTE', sortable: false, value: 'NOTE' },
    { text: 'ACTIONS', sortable: false },
  ];
  newWord = '';

  services = {};
  created() {
    this.$set(this.services, 'wordsTextbookService', this.wordsTextbookService);
    this.wordsTextbookService.getData().subscribe();
  }

  expandRow = null;

  deleteWord(index: number) {
    console.log(index);
  }

  getNote(index: number) {
    console.log(index);
    this.wordsTextbookService.getNote(index).subscribe();
  }

  getNote(index: number) {
    console.log(index);
    this.wordsTextbookService.getNote(index).subscribe();
  }

  googleWord(word: string) {
    googleString(word);
  }

  getNotes(ifEmpty: boolean) {
    this.wordsTextbookService.getNotes(ifEmpty, () => {}, () => {});
  }
}
</script>

<style>
  @import '../assets/common.css';
</style>
