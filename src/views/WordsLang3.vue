<template>
  <div>
    <div class="text-xs-center">
      <v-pagination
        v-model="page"
        :length="pageCount"
        @input="pageChange"
      ></v-pagination>
    </div>
    <md-table v-model="wordsLangService.langWords">
      <md-table-toolbar>
        <div class="md-layout md-gutter">
          <div class="md-layout-item">
            <md-field>
              <label>New Word</label>
              <md-input v-model="newWord" @keyup.enter="onEnterNewWord"></md-input>
            </md-field>
          </div>
        </div>
        <md-button class="md-raised md-icon-button md-primary" @click="settingsService.speak(newWord)">
          <md-icon class="fa fa-volume-up"></md-icon>
        </md-button>
        <div class="md-layout md-gutter">
          <div class="md-layout-item">
            <md-field>
              <md-select v-model="filterType" @md-selected="onEnterFilter">
                <md-option v-for="o in settingsService.wordFilterTypes" :value="o.value">{{o.label}}</md-option>
              </md-select>
            </md-field>
          </div>
        </div>
        <div class="md-layout md-gutter">
          <div class="md-layout-item">
            <md-field>
              <label>Filter</label>
              <md-input v-model="filter" @keyup.enter="onEnterFilter"></md-input>
            </md-field>
          </div>
        </div>
        <md-button class="md-raised md-icon-button md-primary" @click="settingsService.speak(newWord)">
          <md-icon class="fa fa-volume-up"></md-icon>
        </md-button>
        <router-link to="/words-lang-detail/0">
          <md-button class="md-raised md-primary">
            <span><md-icon class="fa fa-plus"></md-icon>Add</span>
          </md-button>
        </router-link>
        <md-button class="md-raised md-primary" @click="onRefresh()">
          <span><md-icon class="fa fa-refresh"></md-icon>Refresh</span>
        </md-button>
        <md-button v-show="settingsService.selectedDictNote" class="md-raised">
          Retrieve All Notes
        </md-button>
        <md-button v-show="settingsService.selectedDictNote" class="md-raised">
          Retrieve Notes If Empty
        </md-button>
        <router-link to="/words-dict/lang/0">
          <md-button class="md-raised md-primary">
            <span><md-icon class="fa fa-book"></md-icon>Dictionary</span>
          </md-button>
        </router-link>
      </md-table-toolbar>
      <md-table-row slot="md-table-row" slot-scope="{item}" :style="item.colorStyle">
        <md-table-cell md-label="ID">{{item.ID}}</md-table-cell>
        <md-table-cell md-label="WORD">{{item.WORD}}</md-table-cell>
        <md-table-cell md-label="NOTE">{{item.NOTE}}</md-table-cell>
        <md-table-cell md-label="LEVEL">{{item.LEVEL}}</md-table-cell>
        <md-table-cell md-label="ACCURACY">{{item.ACCURACY}}</md-table-cell>
        <md-table-cell md-label="ACTIONS">
          <md-button class="md-raised md-icon-button md-accent" @click="deleteWord(item)">
            <md-icon class="fa fa-trash"></md-icon>
            <md-tooltip>Delete</md-tooltip>
          </md-button>
          <router-link :to="{ name: 'words-lang-detail', params: { id: item.ID }}">
            <md-button class="md-raised md-icon-button md-primary">
              <md-icon class="fa fa-edit"></md-icon>
              <md-tooltip>Edit</md-tooltip>
            </md-button>
          </router-link>
          <md-button class="md-raised md-icon-button md-primary" @click="settingsService.speak(item.WORD)">
            <md-icon class="fa fa-volume-up"></md-icon>
            <md-tooltip>Speak</md-tooltip>
          </md-button>
          <md-button class="md-raised md-icon-button md-primary" v-clipboard:copy="item.WORD">
            <md-icon class="fa fa-copy"></md-icon>
            <md-tooltip>Copy</md-tooltip>
          </md-button>
          <md-button class="md-raised md-icon-button" @click="updateLevel(item, 1)">
            <md-icon class="fa fa-arrow-up"></md-icon>
            <md-tooltip>Level Up</md-tooltip>
          </md-button>
          <md-button class="md-raised md-icon-button" @click="updateLevel(item, -1)">
            <md-icon class="fa fa-arrow-down"></md-icon>
            <md-tooltip>Level Down</md-tooltip>
          </md-button>
          <md-button class="md-raised md-icon-button md-primary" @click="googleWord(item.WORD)">
            <md-icon class="fa fa-google"></md-icon>
            <md-tooltip>Google Word</md-tooltip>
          </md-button>
          <router-link :to="{ name: 'words-dict', params: { type: 'lang', index: wordsLangService.langWords.indexOf(item) }}">
            <md-button class="md-raised md-icon-button md-primary">
              <md-icon class="fa fa-book"></md-icon>
              <md-tooltip>Dictionary</md-tooltip>
            </md-button>
          </router-link>
          <md-button v-show="settingsService.selectedDictNote" class="md-raised"
                     @click="getNote(wordsLangService.langWords.indexOf(item))">
            Retrieve Note
          </md-button>
        </md-table-cell>
      </md-table-row>
    </md-table>
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
  import { SettingsService } from '@/view-models/settings.service';
  import { googleString } from '@/common/common';
  import { WordsLangService } from '@/view-models/words-lang.service';
  import { MLangWord } from '@/models/lang-word';
  import { AppService } from '@/view-models/app.service';

  @Component
  export default class WordsLang3 extends Vue {
    @inject() appService!: AppService;
    @inject() wordsLangService!: WordsLangService;
    @inject() settingsService!: SettingsService;

    newWord = '';
    page = 1;
    pageCount = 1;
    rows = this.settingsService.USROWSPERPAGE;
    filter = '';
    filterType = 0;

    services = {};
    created() {
      this.$set(this.services, 'wordsLangService', this.wordsLangService);
      this.appService.initializeComplete.subscribe(_ => {
        this.onRefresh();
      });
    }

    mounted() {
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
      this.wordsLangService.getData(this.page, this.rows, this.filter, this.filterType).subscribe(_ => {
        this.pageCount = (this.wordsLangService.langWordsCount + this.rows - 1) / this.rows >> 0;
        this.$forceUpdate();
      });
    }

    onEnterFilter() {
      if (this.filter && this.filterType === 0)
        this.filterType = 1;
      else if (!this.filter && this.filterType !== 0)
        this.filterType = 0;
      this.onRefresh();
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

    updateLevel(item: MLangWord, delta: number) {
      this.settingsService.updateLevel(item, item.ID, delta).subscribe();
    }
  }
</script>

<style scoped>
</style>
