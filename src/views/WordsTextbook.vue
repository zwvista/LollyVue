<template>
  <div>
    <v-toolbar>
      <v-btn color="info"><v-icon left>fa-refresh</v-icon>Refresh</v-btn>
      <router-link to="/words-dict/textbook/0">
        <v-btn color="info" @click="onRefresh(-1)"><v-icon left>fa-book</v-icon>Dictionary</v-btn>
      </router-link>
    </v-toolbar>
    <template>
      <div class="text-xs-center">
        <v-pagination
          v-model="page"
          :length="pageCount"
          @input="pageChange"
        ></v-pagination>
      </div>
    </template>
    <v-data-table
      :headers="headers"
      :items="wordsTextbookService.textbookWords"
      hide-actions
      class="elevation-1"
      ref="sortableTable"
      item-key="ID"
    >
      <template slot="items" slot-scope="props">
        <tr :key="props.item.ID" :style="props.item.colorStyle">
          <td>{{ props.item.ID }}</td>
          <td>{{ props.item.TEXTBOOKNAME }}</td>
          <td>{{ props.item.UNITSTR }}</td>
          <td>{{ props.item.PARTSTR }}</td>
          <td>{{ props.item.SEQNUM }}</td>
          <td>{{ props.item.WORDID }}</td>
          <td>{{ props.item.WORD }}</td>
          <td>{{ props.item.NOTE }}</td>
          <td>{{ props.item.LEVEL }}</td>
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
            <v-tooltip top v-show="settingsService.selectedVoice">
              <v-btn slot="activator" icon color="info" @click="speak(props.item.WORD)"><v-icon>fa-volume-up</v-icon></v-btn>
              <span>Speak</span>
            </v-tooltip>
            <v-tooltip top>
              <v-btn slot="activator" icon color="info" v-clipboard:copy="props.item.WORD"><v-icon>fa-copy</v-icon></v-btn>
              <span>Copy</span>
            </v-tooltip>
            <v-tooltip top>
              <v-btn slot="activator" icon color="info" @click="googleWord(props.item.WORD)"><v-icon>fa-google</v-icon></v-btn>
              <span>Google Word</span>
            </v-tooltip>
            <router-link :to="{ name: 'words-dict', params: { type: 'textbook', index: props.index }}">
              <v-tooltip top>
                <v-btn slot="activator" icon color="info"><v-icon>fa-book</v-icon></v-btn>
                <span>Dictionary</span>
              </v-tooltip>
            </router-link>
            <v-btn v-show="settingsService.selectedDictNote" color="info" @click="getNote(props.item.WORD)">Retrieve Note</v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { inject } from 'vue-typescript-inject';
  import { WordsTextbookService } from '@/view-models/words-textbook.service';
  import { SettingsService } from '@/view-models/settings.service';
  import { googleString } from '@/common/common';

  @Component
  export default class WordsTextbook extends Vue {
    @inject() wordsTextbookService!: WordsTextbookService;
    @inject() settingsService!: SettingsService;

    headers = [
      { text: 'ID', sortable: false, value: 'ID' },
      { text: 'TEXTBOOKNAME', sortable: false, value: 'TEXTBOOKNAME' },
      { text: 'UNIT', sortable: false, value: 'UNIT' },
      { text: 'PART', sortable: false, value: 'PART' },
      { text: 'SEQNUM', sortable: false, value: 'SEQNUM' },
      { text: 'WORDID', sortable: false, value: 'WORDID' },
      { text: 'WORD', sortable: false, value: 'WORD' },
      { text: 'NOTE', sortable: false, value: 'NOTE' },
      { text: 'LEVEL', sortable: false, value: 'LEVEL' },
      { text: 'ACTIONS', sortable: false },
    ];
    page = 1;
    pageCount = 1;
    rows = this.settingsService.USROWSPERPAGE;

    services = {};
    created() {
      this.$set(this.services, 'wordsTextbookService', this.wordsTextbookService);
      this.onRefresh(-1);
    }

    pageChange(page: number) {
      this.onRefresh(page);
    }

    onRefresh(page: number) {
      if (page === -1) page = this.page;
      // https://stackoverflow.com/questions/4228356/integer-division-with-remainder-in-javascript
      this.wordsTextbookService.getData(page, this.rows).subscribe(_ => {
        this.pageCount = (this.wordsTextbookService.textbookWordCount + this.rows - 1) / this.rows >> 0;
      });
    }

    deleteWord(index: number) {
      console.log(index);
    }

    getNote(index: number) {
      console.log(index);
      this.wordsTextbookService.getNote(index).subscribe();
    }

    googleWord(word: string) {
      googleString(word);
    }

    speak(word: string) {
      this.settingsService.speech.speak({
        text: word,
        queue: false,
      });
    }
  }
</script>

<style>
  @import '../assets/common.css';
</style>
