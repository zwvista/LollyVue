<template>
  <div>
    <v-toolbar>
      <v-flex xs6 md2>
        <v-text-field label="New Word" type="text" v-model="newWord" @keyup.enter="onEnter"></v-text-field>
      </v-flex>
      <v-tooltip top v-show="settingsService.selectedVoice">
        <v-btn slot="activator" icon color="info" @click="settingsService.speak(newWord)"><v-icon>fa-volume-up</v-icon></v-btn>
        <span>Speak</span>
      </v-tooltip>
      <router-link to="/words-lang-detail/0">
        <v-btn color="info"><v-icon left>fa-plus</v-icon>Add</v-btn>
      </router-link>
      <v-btn color="info" @click="onRefresh()"><v-icon left>fa-refresh</v-icon>Refresh</v-btn>
      <router-link to="/words-dict/lang/0">
        <v-btn color="info"><v-icon left>fa-book</v-icon>Dictionary</v-btn>
      </router-link>
    </v-toolbar>
    <div class="text-xs-center">
      <v-pagination
        v-model="page"
        :length="pageCount"
        @input="pageChange"
      ></v-pagination>
    </div>
    <v-data-table
      :headers="headers"
      :items="wordsLangService.langWords"
      hide-actions
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <tr :key="props.item.ID" :style="props.item.colorStyle">
          <td>{{ props.item.ID }}</td>
          <td>{{ props.item.WORD }}</td>
          <td>{{ props.item.NOTE }}</td>
          <td>{{ props.item.LEVEL }}</td>
          <td>
            <v-tooltip top>
              <v-btn slot="activator" icon color="error" @click="deleteWord(props.item.ID)"><v-icon>fa-trash</v-icon></v-btn>
              <span>Delete</span>
            </v-tooltip>
            <router-link :to="{ name: 'words-lang-detail', params: { id: props.item.ID }}">
              <v-tooltip top>
                <v-btn slot="activator" icon color="info"><v-icon>fa-edit</v-icon></v-btn>
                <span>Edit</span>
              </v-tooltip>
            </router-link>
            <v-tooltip top v-show="settingsService.selectedVoice">
              <v-btn slot="activator" icon color="info" @click="settingsService.speak(props.item.WORD)"><v-icon>fa-volume-up</v-icon></v-btn>
              <span>Speak</span>
            </v-tooltip>
            <v-tooltip top>
              <v-btn slot="activator" icon color="info" v-clipboard:copy="props.item.WORD"><v-icon>fa-copy</v-icon></v-btn>
              <span>Copy</span>
            </v-tooltip>
            <v-tooltip top>
              <v-btn slot="activator" icon color="warning" @click="updateLevel(props.item, 1)"><v-icon>fa-arrow-up</v-icon></v-btn>
              <span>Level Up</span>
            </v-tooltip>
            <v-tooltip top>
              <v-btn slot="activator" icon color="warning" @click="updateLevel(props.item, -1)"><v-icon>fa-arrow-down</v-icon></v-btn>
              <span>Level Down</span>
            </v-tooltip>
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
            <v-btn v-show="settingsService.selectedDictNote" color="warning" @click="getNote(props.index)">Retrieve Note</v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>
    <div class="text-xs-center">
      <v-pagination
        v-model="page"
        :length="pageCount"
        @input="pageChange"
      ></v-pagination>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { inject } from 'vue-typescript-inject';
  import { WordsLangService } from '@/view-models/words-lang.service';
  import { SettingsService } from '@/view-models/settings.service';
  import { googleString } from '@/common/common';
  import { MLangWord } from "@/models/lang-word";

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
      this.page = page;
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
      this.wordsLangService.getData(this.page, this.rows).subscribe(_ => {
        this.pageCount = (this.wordsLangService.langWordsCount + this.rows - 1) / this.rows >> 0;
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

<style>
  @import '../assets/common.css';
</style>
