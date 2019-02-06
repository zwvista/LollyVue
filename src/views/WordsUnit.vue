<template>
  <div>
    <v-toolbar>
      <router-link to="/words-unit-detail/0">
        <v-btn color="info"><v-icon left>fa-plus</v-icon>Add</v-btn>
      </router-link>
      <v-btn color="info"><v-icon left>fa-refresh</v-icon>Refresh</v-btn>
      <v-btn color="info">Retrieve All Notes</v-btn>
      <v-btn color="info">Retrieve Notes If Empty</v-btn>
      <router-link to="/words-dict/0">
        <v-btn color="info">Dictionary</v-btn>
      </router-link>
    </v-toolbar>
    <v-data-table
      :headers="headers"
      :items="wordsUnitService.unitWords"
      hide-actions
      class="elevation-1"
      ref="sortableTable"
      item-key="ID"
    >
      <template slot="items" slot-scope="props">
        <tr class="sortableRow" :key="props.item.ID">
          <td class="px-1" style="width: 0.1%">
            <v-btn style="cursor: move" icon class="sortHandle"><v-icon>fa-bars</v-icon></v-btn>
          </td>
          <td>{{ props.item.ID }}</td>
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
            <router-link :to="{ name: 'words-unit-detail', params: { id: props.item.ID }}">
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
            <v-btn color="info">Google Word</v-btn>
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
import { WordsUnitService } from '../view-models/words-unit.service';
import { interval, Subscription } from 'rxjs';
import Sortable from 'sortablejs';

@Component
export default class WordsUnit extends Vue {
  @inject() wordsUnitService!: WordsUnitService;

  headers = [
    { sortable: false },
    { text: 'ID', sortable: false, value: 'ID' },
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
    this.$set(this.services, 'wordsUnitService', this.wordsUnitService);
    this.wordsUnitService.getData().subscribe();
  }

  expandRow = null;

  mounted() {
    /* eslint-disable no-new */
    new Sortable(
      (this.$refs.sortableTable as any).$el.getElementsByTagName('tbody')[0],
      {
        draggable: '.sortableRow',
        handle: '.sortHandle',
        onStart: this.dragStart,
        onEnd: this.dragReorder,
      },
    );
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

  onEnter() {
    if (!this.newWord) return;
    const o = this.wordsUnitService.newUnitWord();
    o.WORD = this.newWord;
    this.wordsUnitService.create(o).subscribe(id => {
      o.ID = id as number;
      this.wordsUnitService.unitWords.push(o);
      this.newWord = '';
    });
  }

  deleteWord(index: number) {
    console.log(index);
  }

  getNote(index: number) {
    console.log(index);
    this.wordsUnitService.getNote(index).subscribe();
  }

  // https://stackoverflow.com/questions/42775017/angular-2-redirect-to-an-external-url-and-open-in-a-new-tab
  googleWord(WORD: string) {
    window.open('https://www.google.com/search?q=' + encodeURIComponent(WORD), '_blank');
  }

  getNotes(ifEmpty: boolean) {
    this.wordsUnitService.getNotes(ifEmpty, () => {}, () => {});
  }
}
</script>

<style>
  @import '../assets/common.css';
</style>
