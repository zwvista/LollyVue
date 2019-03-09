<template>
  <div>
    <v-toolbar>
      <router-link to="/words-lang-detail/0">
        <v-btn color="info"><v-icon left>fa-plus</v-icon>Add</v-btn>
      </router-link>
      <v-btn color="info" @click="onRefresh()"><v-icon left>fa-refresh</v-icon>Refresh</v-btn>
      <router-link to="/words-dict/lang/0">
        <v-btn color="info"><v-icon left>fa-book</v-icon>Dictionary</v-btn>
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
      :items="wordsLangService.langWords"
      hide-actions
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <tr :key="props.item.ID">
          <td>{{ props.item.ID }}</td>
          <td>{{ props.item.WORD }}</td>
          <td>{{ props.item.NOTE }}</td>
          <td>{{ props.item.LEVEL }}</td>
          <td>
            <v-tooltip top>
              <v-btn slot="activator" icon color="error"><v-icon>fa-trash</v-icon></v-btn>
              <span>Delete</span>
            </v-tooltip>
            <router-link :to="{ name: 'words-lang-detail', params: { id: props.item.ID }}">
              <v-tooltip top>
                <v-btn slot="activator" icon color="info"><v-icon>fa-edit</v-icon></v-btn>
                <span>Edit</span>
              </v-tooltip>
            </router-link>
            <v-tooltip top>
              <v-btn slot="activator" icon color="info" v-clipboard:copy="props.item.WORD"><v-icon>fa-copy</v-icon></v-btn>
              <span>Copy</span>
            </v-tooltip>
            <v-btn v-show="settingsService.hasNote" color="info" @click="getNote(props.item.WORD)">Retrieve Note</v-btn>
            <v-tooltip top>
              <v-btn slot="activator" icon color="info" @click="googleWord(props.item.WORD)"><v-icon>fa-google</v-icon></v-btn>
              <span>Google Word</span>
            </v-tooltip>
            <router-link :to="{ name: 'words-dict', params: { type: 'lang', index: props.index }}">
              <v-tooltip top>
                <v-btn slot="activator" icon color="info"><v-icon>fa-book</v-icon></v-btn>
                <span>Dictionary</span>
              </v-tooltip>
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
  import { WordsLangService } from '@/view-models/words-lang.service';
  import { SettingsService } from '@/view-models/settings.service';
  import { googleString } from '@/common/common';

  @Component
  export default class WordsLang extends Vue {
    @inject() wordsLangService!: WordsLangService;
    @inject() settingsService!: SettingsService;

    headers = [
      { text: 'ID', sortable: false, value: 'ID' },
      { text: 'WORD', sortable: false, value: 'WORD' },
      { text: 'NOTE', sortable: false, value: 'NOTE' },
      { text: 'LEVEL', sortable: false, value: 'LEVEL' },
      { text: 'ACTIONS', sortable: false },
    ];
    newWord = '';
    page = 1;
    pageCount = 1;
    rows = this.settingsService.USROWSPERPAGE;

    services = {};
    created() {
      this.$set(this.services, 'wordsLangService', this.wordsLangService);
      this.onRefresh();
    }

    pageChange(page: number) {
      this.wordsLangService.getData(page, this.rows).subscribe();
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

    onRefresh() {
      // https://stackoverflow.com/questions/4228356/integer-division-with-remainder-in-javascript
      this.wordsLangService.getData(1, this.rows).subscribe(_ =>
        this.pageCount = (this.wordsLangService.langWordsCount + this.rows - 1) / this.rows >> 0
      );
    }

    deleteWord(index: number) {
      console.log(index);
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
