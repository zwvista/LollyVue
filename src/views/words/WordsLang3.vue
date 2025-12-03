<template>
  <div>
    <div class="text-xs-center">
      <md-table-pagination
        v-model="wordsLangService.page"
        :length="pageCount"
        @input="pageChange"
      ></md-table-pagination>
    </div>
    <md-table v-model="wordsLangService.langWords">
      <md-table-toolbar>
        <div class="md-layout md-gutter">
          <div class="md-layout-item">
            <md-field>
              <md-select v-model="wordsLangService.filterType" @md-selected="onRefresh">
                <md-option v-for="o in settingsService.wordFilterTypes" :value="o.value">{{o.label}}</md-option>
              </md-select>
            </md-field>
          </div>
        </div>
        <div class="md-layout md-gutter">
          <div class="md-layout-item">
            <md-field>
              <label>Filter</label>
              <md-input v-model="wordsLangService.filter" @keyup.enter="onRefresh"></md-input>
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
          Get All Notes
        </md-button>
        <md-button v-show="settingsService.selectedDictNote" class="md-raised">
          Get Notes If Empty
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
                     @click="getNote(item)">
            Get Note
          </md-button>
          <md-button v-show="settingsService.selectedDictNote" class="md-raised"
                     @click="clearNote(item)">
            Clear Note
          </md-button>
        </md-table-cell>
      </md-table-row>
    </md-table>
    <div class="text-xs-center">
      <md-table-pagination
        v-model="wordsLangService.page"
        :length="pageCount"
        @input="pageChange"
      ></md-table-pagination>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { SettingsService } from '@/shared/view-models/misc/settings.service';
  import { googleString } from '@/shared/common/common';
  import { WordsLangService } from '@/shared/view-models/wpp/words-lang.service';
  import { MLangWord } from '@/shared/models/wpp/lang-word';
  import { AppService } from '@/shared/view-models/misc/app.service';
  import { container } from 'tsyringe';

  @Component
  export default class WordsLang3 extends Vue {
    appService = container.resolve(AppService);
    wordsLangService = container.resolve(WordsLangService);
    settingsService = container.resolve(SettingsService);

    pageCount = 1;

    services = {};
    async created() {
      this.$set(this.services, 'wordsLangService', this.wordsLangService);
      await this.appService.getData();
      this.wordsLangService.rows = this.settingsService.USROWSPERPAGE;
      await this.onRefresh();
    }

    mounted() {
    }

    async onRefresh() {
      await this.wordsLangService.getData();
      this.pageCount = (this.wordsLangService.langWordsCount + this.wordsLangService.rows - 1) / this.wordsLangService.rows >> 0;
      this.$forceUpdate();
    }

    deleteWord(item: MLangWord) {
      this.wordsLangService.delete(item);
    }

    async getNote(index: MLangWord) {
      await this.wordsLangService.getNote(index);
    }

    async clearNote(index: MLangWord) {
      await this.wordsLangService.clearNote(index);
    }

    googleWord(word: string) {
      googleString(word);
    }
  }
</script>

<style scoped>
</style>
