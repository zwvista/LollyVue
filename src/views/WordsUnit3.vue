<template>
  <div>
    <md-table v-model="wordsUnitService.unitWords">
      <md-table-toolbar>
        <div class="md-layout md-gutter">
          <div class="md-layout-item">
            <md-field>
              <label>New Word</label>
              <md-input v-model="newWord"></md-input>
            </md-field>
          </div>
        </div>
        <md-button class="md-raised md-icon-button md-primary">
          <md-icon class="fa fa-volume-up"></md-icon>
        </md-button>
        <md-button class="md-raised md-primary">
          <span><md-icon class="fa fa-plus"></md-icon>Add</span>
        </md-button>
        <md-button class="md-raised md-primary">
          <span><md-icon class="fa fa-refresh"></md-icon>Refresh</span>
        </md-button>
        <md-button v-show="settingsService.selectedDictNote" class="md-raised">
          Retrieve All Notes
        </md-button>
        <md-button v-show="settingsService.selectedDictNote" class="md-raised">
          Retrieve Notes If Empty
        </md-button>
        <md-button class="md-raised md-primary">
          <span><md-icon class="fa fa-book"></md-icon>Dictionary</span>
        </md-button>
      </md-table-toolbar>
      <md-table-row slot="md-table-row" slot-scope="{item}" :style="item.colorStyle">
        <md-table-cell md-label="ID">{{item.ID}}</md-table-cell>
        <md-table-cell md-label="UNIT">{{item.UNIT}}</md-table-cell>
        <md-table-cell md-label="PART">{{item.PART}}</md-table-cell>
        <md-table-cell md-label="SEQNUM">{{item.SEQNUM}}</md-table-cell>
        <md-table-cell md-label="WORDID">{{item.WORDID}}</md-table-cell>
        <md-table-cell md-label="WORD">{{item.WORD}}</md-table-cell>
        <md-table-cell md-label="NOTE">{{item.NOTE}}</md-table-cell>
        <md-table-cell md-label="LEVEL">{{item.LEVEL}}</md-table-cell>
        <md-table-cell md-label="ACTIONS">
          <md-button class="md-raised md-icon-button md-accent">
            <md-icon class="fa fa-trash"></md-icon>
          </md-button>
          <md-button class="md-raised md-icon-button md-primary">
            <md-icon class="fa fa-edit"></md-icon>
          </md-button>
          <md-button class="md-raised md-icon-button md-primary">
            <md-icon class="fa fa-volume-up"></md-icon>
          </md-button>
          <md-button class="md-raised md-icon-button md-primary">
            <md-icon class="fa fa-copy"></md-icon>
          </md-button>
          <md-button class="md-raised md-icon-button">
            <md-icon class="fa fa-arrow-up"></md-icon>
          </md-button>
          <md-button class="md-raised md-icon-button">
            <md-icon class="fa fa-arrow-down"></md-icon>
          </md-button>
          <md-button class="md-raised md-icon-button md-primary">
            <md-icon class="fa fa-google"></md-icon>
          </md-button>
          <md-button class="md-raised md-icon-button md-primary">
            <md-icon class="fa fa-book"></md-icon>
          </md-button>
          <md-button v-show="settingsService.selectedDictNote" class="md-raised">
            Retrieve Note
          </md-button>
        </md-table-cell>
      </md-table-row>
    </md-table>
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
  export default class WordsUnit3 extends Vue {
    @inject() wordsUnitService!: WordsUnitService;
    @inject() settingsService!: SettingsService;

    columns = [
      { name: 'ID', field: 'ID', label: 'ID' },
      { name: 'UNIT', field: 'UNIT', label: 'UNIT' },
      { name: 'PART', field: 'PART', label: 'PART' },
      { name: 'SEQNUM', field: 'SEQNUM', label: 'SEQNUM' },
      { name: 'WORDID', field: 'WORDID', label: 'WORDID' },
      { name: 'WORD', field: 'WORD', label: 'WORD' },
      { name: 'NOTE', field: 'NOTE', label: 'NOTE' },
      { name: 'LEVEL', field: 'LEVEL', label: 'LEVEL' },
      { name: 'ACTIONS', label: 'ACTIONS' },
    ];
    pagination = {
      page: 1,
      rowsPerPage: 0 // current rows per page being displayed
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

    updateLevel(index: number, delta: number) {
      const o = this.wordsUnitService.unitWords[index];
      this.settingsService.updateLevel(o, o.WORDID, delta).subscribe();
    }
  }
</script>

<style scoped>
</style>
