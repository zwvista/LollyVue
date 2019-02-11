<template>
  <div>
    <v-toolbar>
      <router-link to="/words-lang-detail/0">
        <v-btn color="info"><v-icon left>fa-plus</v-icon>Add</v-btn>
      </router-link>
      <v-btn color="info"><v-icon left>fa-refresh</v-icon>Refresh</v-btn>
      <router-link to="/words-dict/0">
        <v-btn color="info">Dictionary</v-btn>
      </router-link>
    </v-toolbar>
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
          <td>{{ props.item.LEVEL }}</td>
          <td>{{ props.item.NOTE }}</td>
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
import { WordsLangService } from '../view-models/words-lang.service';
import { SettingsService } from '@/view-models/settings.service';

@Component
export default class WordsLang extends Vue {
  @inject() wordsLangService!: WordsLangService;
  @inject() settingsService!: SettingsService;

  headers = [
    { text: 'ID', sortable: false, value: 'ID' },
    { text: 'WORD', sortable: false, value: 'WORD' },
    { text: 'LEVEL', sortable: false, value: 'LEVEL' },
    { text: 'ACTIONS', sortable: false },
  ];
  newWord = '';

  services = {};
  created() {
    this.$set(this.services, 'wordsLangService', this.wordsLangService);
    this.wordsLangService.getData().subscribe();
  }

  onEnter() {
    if (!this.newWord) return;
    const o = this.wordsLangService.newLangWord();
    o.WORD = this.wordsLangService.settingsService.autoCorrectInput(this.newWord);
    this.wordsLangService.create(o).subscribe(id => {
      o.ID = id as number;
      this.wordsLangService.langWords.push(o);
      this.newWord = '';
    });
  }

  deleteWord(index: number) {
    console.log(index);
  }

  // https://stackoverflow.com/questions/42775017/angular-2-redirect-to-an-external-url-and-open-in-a-new-tab
  googleWord(WORD: string) {
    window.open('https://www.google.com/search?q=' + encodeURIComponent(WORD), '_blank');
  }
}
</script>

<style>
  @import '../assets/common.css';
</style>
