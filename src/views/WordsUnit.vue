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
    >
      <template slot="items" slot-scope="props">
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
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { inject } from 'vue-typescript-inject';
import { WordsUnitService } from '../view-models/words-unit.service';
import { interval, Subscription } from 'rxjs';

@Component
export default class WordsUnit extends Vue {
  @inject() wordsUnitService!: WordsUnitService;

  headers = [
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

  private reindex() {
    this.wordsUnitService.reindex(index => {});
  }

  onWordReorder(from: number, to: number) {
    console.log(`${from},${to}`);
    this.wordsUnitService.unitWords.move(from, to);
    this.reindex();
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
    let subscription: Subscription;
    // https://stackoverflow.com/questions/50200859/i-dont-get-rxjs-6-with-angular-6-with-interval-switchmap-and-map
    this.wordsUnitService.getNotes(ifEmpty, n => subscription = interval(n).subscribe(_ =>
      this.wordsUnitService.getNextNote(() => {}, () => {
        subscription.unsubscribe();
      }),
    ));
  }
}
</script>

<style>
  @import '../assets/common.css';
</style>
