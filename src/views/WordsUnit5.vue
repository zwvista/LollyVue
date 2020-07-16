<template>
  <div>
    <Toolbar>
      <template slot="left">
        <span class="p-float-label">
          <InputText id="word" type="text" v-model="newWord" @keyup.enter="onEnterNewWord" />
          <label for="word">New Word</label>
        </span>
        <Button v-show="settingsService.selectedVoice" icon="fa fa-volume-up" @click="settingsService.speak(newWord)" />
        <DropDown :options="settingsService.wordFilterTypes" optionLabel="label" value="value" v-model="filterType" @change="onEnterFilter" />
        <span class="p-float-label">
          <InputText id="filter" type="text" v-model="filter" @keyup.enter="onEnterFilter" />
          <label for="filter">Filter</label>
        </span>
        <router-link to="/words-unit-detail/0">
          <Button icon="fa fa-plus" label="Add" />
        </router-link>
        <Button icon="fa fa-refresh" label="Refresh" @click="onRefresh()" />
        <Button v-show="settingsService.selectedDictNote" label="Retrieve All Notes" class="p-button-warning" />
        <Button v-show="settingsService.selectedDictNote" label="Retrieve Notes If Empty" class="p-button-warning" />
        <router-link to="/words-dict/unit/0">
          <Button icon="fa fa-book" label="Dictionary" />
        </router-link>
      </template>
    </Toolbar>
    <DataTable
      :value="wordsUnitService.unitWords"
    >
        <Column class="px-1" style="width: 0.1%">
          <template>
            <Button v-show="settingsService.isSingleUnitPart && !filter" style="cursor: move" icon class="sortHandle"><v-icon>fa-bars</v-icon></Button>
          </template>
        </Column>
        <Column field="ID" header="ID" />
        <Column field="UNITSTR" header="UNIT" />
        <Column field="PARTSTR" header="PART" />
        <Column field="SEQNUM" header="SEQNUM" />
        <Column field="WORDID" header="WORDID" />
        <Column field="WORD" header="WORD" />
        <Column field="NOTE" header="NOTE" />
        <Column field="LEVEL" header="LEVEL" />
        <Column field="ACCURACY" header="ACCURACY" />
        <Column>
          <template>
            <Button v-tooltip.top="'Delete'" icon="fa fa-trash" color="error" @click="deleteWord(item)" />
            <router-link :to="{ name: 'words-unit-detail', params: { id: item.ID }}">
              <Button v-tooltip.top="'Edit'" icon="fa fa-edit" color="info" />
            </router-link>
            <Button v-tooltip.top="'Speak'" icon="fa fa-volume-up" color="info" @click="settingsService.speak(item.WORD)" />
            <Button v-tooltip.top="'Copy'" icon="fa fa-copy" color="info" v-clipboard:copy="item.WORD" />
            <Button v-tooltip.top="'Level Up'" icon="fa fa-arrow-up" color="warning" @click="updateLevel(item, 1)" />
            <Button v-tooltip.top="'Level Down'"icon="fa fa-arrow-down" color="warning" @click="updateLevel(item, -1)" />
            <Button v-tooltip.top="'Google Word'" icon="fa fa-google" color="info" @click="googleWord(item.WORD)" />
            <router-link :to="{ name: 'words-dict', params: { type: 'unit', index: index }}">
              <Button v-tooltip.top="'Dictionary'" icon="fa fa-book" color="info" />
            </router-link>
            <Button v-show="settingsService.selectedDictNote" color="warning" @click="getNote(index)">Retrieve Note</Button>
          </template>
        </Column>
    </DataTable>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { inject } from 'vue-typescript-inject';
  import { WordsUnitService } from '@/view-models/words-unit.service';
  import Sortable from 'sortablejs';
  import { SettingsService } from '@/view-models/settings.service';
  import { googleString } from '@/common/common';
  import { MUnitWord } from '@/models/unit-word';
  import { AppService } from '@/view-models/app.service';

  @Component
  export default class WordsUnit5 extends Vue {
    @inject() appService!: AppService;
    @inject() wordsUnitService!: WordsUnitService;
    @inject() settingsService!: SettingsService;

    headers = [
      { sortable: false },
      { text: 'ID', sortable: false, value: 'ID' },
      { text: 'UNIT', sortable: false, value: 'UNIT' },
      { text: 'PART', sortable: false, value: 'PART' },
      { text: 'SEQNUM', sortable: false, value: 'SEQNUM' },
      { text: 'WORDID', sortable: false, value: 'WORDID' },
      { text: 'WORD', sortable: false, value: 'WORD' },
      { text: 'NOTE', sortable: false, value: 'NOTE' },
      { text: 'LEVEL', sortable: false, value: 'LEVEL' },
      { text: 'ACCURACY', sortable: false, value: 'ACCURACY' },
      { text: 'ACTIONS', sortable: false },
    ];
    newWord = '';
    filter = '';
    filterType = 0;

    services = {};
    created() {
      this.$set(this.services, 'wordsUnitService', this.wordsUnitService);
      this.appService.initializeObject.subscribe(_ => {
        this.onRefresh();
      });
    }

    expandRow = null;

    mounted() {
    }

    dragStart({item}: any) {
      const nextSib = item.nextSibling;
      if (nextSib &&
        nextSib.classList.contains('datatable__expand-row')) {
        this.expandRow = nextSib;
      } else {
        this.expandRow = null;
      }
    }

    dragReorder({item, oldIndex, newIndex}: any) {
      console.log('reorder', item, oldIndex, newIndex);
      const nextSib = item.nextSibling;
      if (nextSib &&
        nextSib.classList.contains('datatable__expand-row') &&
        nextSib !== this.expandRow) {
        item.parentNode.insertBefore(item, nextSib.nextSibling);
      }
      const movedItem = this.wordsUnitService.unitWords.splice(oldIndex, 1)[0];
      this.wordsUnitService.unitWords.splice(newIndex, 0, movedItem);
      this.wordsUnitService.reindex(index => {});
    }

    onEnterNewWord() {
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
      this.wordsUnitService.getDataInTextbook(this.filter, this.filterType).subscribe();
    }

    onEnterFilter() {
      if (this.filter && this.filterType === 0)
        this.filterType = 1;
      else if (!this.filter && this.filterType !== 0)
        this.filterType = 0;
      this.onRefresh();
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

<style>
  @import '../assets/common.css';
</style>
