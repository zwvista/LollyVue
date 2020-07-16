<template>
  <div>
    <v-toolbar>
      <v-flex xs6 md2>
        <v-select :items="settingsService.wordFilterTypes" item-text="label" item-value="value" v-model="filterType" @change="onEnterFilter"></v-select>
      </v-flex>
      <v-flex xs6 md2>
        <v-text-field label="Filter" type="text" v-model="filter" @keyup.enter="onEnterFilter"></v-text-field>
      </v-flex>
      <v-flex xs6 md2>
        <v-select :items="settingsService.textbookFilters" item-text="label" item-value="value" v-model="textbookFilter" @change="onRefresh"></v-select>
      </v-flex>
      <v-btn color="info"><v-icon left>fa-refresh</v-icon>Refresh</v-btn>
      <router-link to="/words-dict/textbook/0">
        <v-btn color="info" @click="onRefresh()"><v-icon left>fa-book</v-icon>Dictionary</v-btn>
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
      :items="wordsUnitService.textbookWords"
      hide-default-footer
      class="elevation-1"
      ref="sortableTable"
      item-key="ID"
    >
      <template v-slot:body="{items}">
        <tbody>
        <tr v-for="(item, index) in items" :key="item.ID" :style="item.colorStyle">
          <td>{{ item.ID }}</td>
          <td>{{ item.TEXTBOOKNAME }}</td>
          <td>{{ item.UNITSTR }}</td>
          <td>{{ item.PARTSTR }}</td>
          <td>{{ item.SEQNUM }}</td>
          <td>{{ item.WORDID }}</td>
          <td>{{ item.WORD }}</td>
          <td>{{ item.NOTE }}</td>
          <td>{{ item.LEVEL }}</td>
          <td>{{ item.ACCURACY }}</td>
          <td>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn slot="activator" icon color="error" @click="deleteWord(item)"><v-icon>fa-trash</v-icon></v-btn>
              </template>
              <span>Delete</span>
            </v-tooltip>
            <router-link :to="{ name: 'words-textbook-detail', params: { id: item.ID }}">
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn slot="activator" icon color="info"><v-icon>fa-edit</v-icon></v-btn>
                </template>
                <span>Edit</span>
              </v-tooltip>
            </router-link>
            <v-tooltip top v-show="settingsService.selectedVoice">
              <template v-slot:activator="{ on, attrs }">
                <v-btn slot="activator" icon color="info" @click="settingsService.speak(item.WORD)"><v-icon>fa-volume-up</v-icon></v-btn>
              </template>
              <span>Speak</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn slot="activator" icon color="info" v-clipboard:copy="item.WORD"><v-icon>fa-copy</v-icon></v-btn>
              </template>
              <span>Copy</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn slot="activator" icon color="warning" @click="updateLevel(item, 1)"><v-icon>fa-arrow-up</v-icon></v-btn>
              </template>
              <span>Level Up</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn slot="activator" icon color="warning" @click="updateLevel(item, -1)"><v-icon>fa-arrow-down</v-icon></v-btn>
              </template>
              <span>Level Down</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn slot="activator" icon color="info" @click="googleWord(item.WORD)"><v-icon>fa-google</v-icon></v-btn>
              </template>
              <span>Google Word</span>
            </v-tooltip>
            <router-link :to="{ name: 'words-dict', params: { type: 'textbook', index: index }}">
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn slot="activator" icon color="info"><v-icon>fa-book</v-icon></v-btn>
                </template>
                <span>Dictionary</span>
              </v-tooltip>
            </router-link>
            <v-btn v-show="settingsService.selectedDictNote" color="warning" @click="getNote(index)">Retrieve Note</v-btn>
          </td>
        </tr>
        </tbody>
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
  import { SettingsService } from '@/view-models/settings.service';
  import { googleString } from '@/common/common';
  import { WordsUnitService } from '@/view-models/words-unit.service';
  import { MUnitWord } from '@/models/unit-word';
  import { AppService } from '@/view-models/app.service';

  @Component
  export default class WordsTextbook extends Vue {
    @inject() appService!: AppService;
    @inject() wordsUnitService!: WordsUnitService;
    @inject() settingsService!: SettingsService;

    headers = [
      { text: 'ID', sortable: false, value: 'ID' },
      { text: 'TEXTBOOKNAME', sortable: false, value: 'TEXTBOOKNAME' },
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

    updateLevel(item: MUnitWord, delta: number) {
      this.settingsService.updateLevel(item, item.WORDID, delta).subscribe();
    }
  }
</script>

<style>
  @import '../assets/common.css';
</style>
