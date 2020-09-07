<template>
  <div>
    <div class="text-xs-center">
      <v-pagination
        v-model="page"
        :length="pageCount"
        @input="pageChange"
      ></v-pagination>
    </div>
    <md-table v-model="wordsUnitService.textbookWords">
      <md-table-toolbar>
        <div class="md-layout md-gutter">
          <div class="md-layout-item">
            <md-field>
              <md-select v-model="filterType" @md-selected="onRefresh">
                <md-option v-for="o in settingsService.wordFilterTypes" :value="o.value">{{o.label}}</md-option>
              </md-select>
            </md-field>
          </div>
        </div>
        <div class="md-layout md-gutter">
          <div class="md-layout-item">
            <md-field>
              <label>Filter</label>
              <md-input v-model="filter" @keyup.enter="onRefresh"></md-input>
            </md-field>
          </div>
        </div>
        <div class="md-layout md-gutter">
          <div class="md-layout-item">
            <md-field>
              <md-select v-model="textbookFilter" @md-selected="onRefresh">
                <md-option v-for="o in settingsService.textbookFilters" :value="o.value">{{o.label}}</md-option>
              </md-select>
            </md-field>
          </div>
        </div>
        <md-button class="md-raised md-primary" @click="onRefresh()">
          <span><md-icon class="fa fa-refresh"></md-icon>Refresh</span>
        </md-button>
        <router-link to="/words-dict/textbook/0">
          <md-button class="md-raised md-primary">
            <span><md-icon class="fa fa-book"></md-icon>Dictionary</span>
          </md-button>
        </router-link>
      </md-table-toolbar>
      <md-table-row slot="md-table-row" slot-scope="{item}" :style="item.colorStyle">
        <md-table-cell md-label="ID">{{item.ID}}</md-table-cell>
        <md-table-cell md-label="TEXTBOOKNAME">{{item.TEXTBOOKNAME}}</md-table-cell>
        <md-table-cell md-label="UNIT">{{item.UNITSTR}}</md-table-cell>
        <md-table-cell md-label="PART">{{item.PARTSTR}}</md-table-cell>
        <md-table-cell md-label="SEQNUM">{{item.SEQNUM}}</md-table-cell>
        <md-table-cell md-label="WORDID">{{item.WORDID}}</md-table-cell>
        <md-table-cell md-label="WORD">{{item.WORD}}</md-table-cell>
        <md-table-cell md-label="NOTE">{{item.NOTE}}</md-table-cell>
        <md-table-cell md-label="ACCURACY">{{item.ACCURACY}}</md-table-cell>
        <md-table-cell md-label="ACTIONS">
          <md-button class="md-raised md-icon-button md-accent" @click="deleteWord(item)">
            <md-icon class="fa fa-trash"></md-icon>
            <md-tooltip>Delete</md-tooltip>
          </md-button>
          <router-link :to="{ name: 'words-textbook-detail', params: { id: item.ID }}">
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
          <md-button class="md-raised md-icon-button md-primary" @click="googleWord(item.WORD)">
            <md-icon class="fa fa-google"></md-icon>
            <md-tooltip>Google Word</md-tooltip>
          </md-button>
          <router-link :to="{ name: 'words-dict', params: { type: 'textbook', index: wordsUnitService.textbookWords.indexOf(item) }}">
            <md-button class="md-raised md-icon-button md-primary">
              <md-icon class="fa fa-book"></md-icon>
              <md-tooltip>Dictionary</md-tooltip>
            </md-button>
          </router-link>
          <md-button v-show="settingsService.selectedDictNote" class="md-raised"
                     @click="getNote(wordsUnitService.textbookWords.indexOf(item))">
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
  import { WordsUnitService } from '@/view-models/words-unit.service';
  import { SettingsService } from '@/view-models/settings.service';
  import { googleString } from '@/common/common';
  import { MUnitWord } from '@/models/unit-word';
  import { AppService } from '@/view-models/app.service';

  @Component
  export default class WordsTextbook3 extends Vue {
    @inject() appService!: AppService;
    @inject() wordsUnitService!: WordsUnitService;
    @inject() settingsService!: SettingsService;

    page = 1;
    pageCount = 1;
    rows = 0;
    filter = '';
    filterType = 0;
    textbookFilter = 0;

    services = {};
    created() {
      this.$set(this.services, 'wordsUnitService', this.wordsUnitService);
      this.appService.initializeObject.subscribe(_ => {
        this.rows = this.settingsService.USROWSPERPAGE;
        this.onRefresh();
      });
    }

    pageChange(page: number) {
      this.page = page;
      this.onRefresh();
    }

    onRefresh() {
      // https://stackoverflow.com/questions/4228356/integer-division-with-remainder-in-javascript
      this.wordsUnitService.getDataInLang(this.page, this.rows, this.filter, this.filterType, this.textbookFilter).subscribe(_ => {
        this.pageCount = (this.wordsUnitService.textbookWordCount + this.rows - 1) / this.rows >> 0;
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
