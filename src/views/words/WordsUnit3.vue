<template>
  <div>
    <md-table v-model="wordsUnitService.unitWords">
      <md-table-toolbar>
        <div class="md-layout md-gutter">
          <div class="md-layout-item">
            <md-field>
              <label>New Word</label>
              <md-input v-model="wordsUnitService.newWord" @keyup.enter="onEnterNewWord"></md-input>
            </md-field>
          </div>
        </div>
        <md-button class="md-raised md-icon-button md-primary" @click="settingsService.speak(newWord)">
          <md-icon class="fa fa-volume-up"></md-icon>
        </md-button>
        <div class="md-layout md-gutter">
          <div class="md-layout-item">
            <md-field>
              <md-select v-model="wordsUnitService.filterType" @md-selected="onRefresh">
                <md-option v-for="o in settingsService.wordFilterTypes" :value="o.value">{{o.label}}</md-option>
              </md-select>
            </md-field>
          </div>
        </div>
        <div class="md-layout md-gutter">
          <div class="md-layout-item">
            <md-field>
              <label>Filter</label>
              <md-input v-model="wordsUnitService.filter" @keyup.enter="onRefresh"></md-input>
            </md-field>
          </div>
        </div>
        <router-link to="/words-unit-detail/0">
          <md-button class="md-raised md-primary">
            <span><md-icon class="fa fa-plus"></md-icon>Add</span>
          </md-button>
        </router-link>
        <md-button class="md-raised md-primary" @click="onRefresh()">
          <span><md-icon class="fa fa-refresh"></md-icon>Refresh</span>
        </md-button>
        <md-checkbox v-model="wordsUnitService.ifEmpty">If Empty</md-checkbox>
        <md-button v-show="settingsService.selectedDictNote" class="md-raised" @click="getNotes()">
          Get Notes
        </md-button>
        <md-button v-show="settingsService.selectedDictNote" class="md-raised" @click="clearNotes()">
          Clear Notes
        </md-button>
        <router-link to="/words-dict/unit/0">
          <md-button class="md-raised md-primary">
            <span><md-icon class="fa fa-book"></md-icon>Dictionary</span>
          </md-button>
        </router-link>
      </md-table-toolbar>
      <md-table-row slot="md-table-row" slot-scope="{item}" :style="item.colorStyle">
        <md-table-cell md-label="ID">{{item.ID}}</md-table-cell>
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
          <router-link :to="{ name: 'words-unit-detail', params: { id: item.ID }}">
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
          <router-link :to="{ name: 'words-dict', params: { type: 'unit', index: wordsUnitService.unitWords.indexOf(item) }}">
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
  export default class WordsUnit3 extends Vue {
    appService = container.resolve(AppService);
    wordsUnitService = container.resolve(WordsUnitService);
    settingsService = container.resolve(SettingsService);

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
