<template>
  <div>
    <v-toolbar>
      <v-flex xs6 md2>
        <v-text-field label="New Word" type="text" v-model="newWord" @keyup.enter="onEnterNewWord"></v-text-field>
      </v-flex>
      <v-tooltip top v-show="settingsService.selectedVoice">
        <v-btn v-bind="attrs" v-on="on" icon color="info" @click="settingsService.speak(newWord)"><v-icon>fa-volume-up</v-icon></v-btn>
        <span>Speak</span>
      </v-tooltip>
      <v-flex xs6 md2>
        <v-select :items="settingsService.wordFilterTypes" item-text="label" item-value="value" v-model="filterType" @change="onRefresh"></v-select>
      </v-flex>
      <v-flex xs6 md2>
        <v-text-field label="Filter" type="text" v-model="filter" @keyup.enter="onRefresh"></v-text-field>
      </v-flex>
      <router-link to="/words-lang-detail/0">
        <v-btn color="info"><v-icon left>fa-plus</v-icon>Add</v-btn>
      </router-link>
      <v-btn color="info" @click="onRefresh()"><v-icon left>fa-refresh</v-icon>Refresh</v-btn>
      <router-link to="/words-dict/lang/0">
        <v-btn color="info"><v-icon left>fa-book</v-icon>Dictionary</v-btn>
      </router-link>
    </v-toolbar>
    <div class="text-xs-center">
      <v-row justify="center" align="center">
        <v-col cols="12" md="3">
          <v-select
            :items="settingsService.USROWSPERPAGEOPTIONS"
            v-model="rows"
            label="Rows per page"
            style="width: 125px"
            @change="rowsChange"
          ></v-select>
        </v-col>
        <v-pagination
          v-model="page"
          :length="pageCount"
          :total-visible="20"
          @input="onRefresh"
        ></v-pagination>
      </v-row>
    </div>
    <v-data-table
      :headers="headers"
      :items="wordsLangService.langWords"
      :items-per-page="-1"
      hide-default-footer
      class="elevation-1"
    >
      <template v-slot:body="{items}">
        <tbody>
        <tr v-for="(item, index) in items" :key="item.ID" :style="item.colorStyle">
          <td>{{ item.ID }}</td>
          <td>{{ item.WORD }}</td>
          <td>{{ item.NOTE }}</td>
          <td>{{ item.ACCURACY }}</td>
          <td>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" icon color="error" @click="deleteWord(item)"><v-icon>fa-trash</v-icon></v-btn>
              </template>
              <span>Delete</span>
            </v-tooltip>
            <router-link :to="{ name: 'words-lang-detail', params: { id: item.ID }}">
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" v-on="on" icon color="info"><v-icon>fa-edit</v-icon></v-btn>
                </template>
                <span>Edit</span>
              </v-tooltip>
            </router-link>
            <v-tooltip top v-show="settingsService.selectedVoice">
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" icon color="info" @click="settingsService.speak(item.WORD)"><v-icon>fa-volume-up</v-icon></v-btn>
              </template>
              <span>Speak</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" icon color="info" v-clipboard:copy="item.WORD"><v-icon>fa-copy</v-icon></v-btn>
              </template>
              <span>Copy</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" icon color="info" @click="googleWord(item.WORD)"><v-icon>fa-google</v-icon></v-btn>
              </template>
              <span>Google Word</span>
            </v-tooltip>
            <router-link :to="{ name: 'words-dict', params: { type: 'lang', index: index }}">
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" v-on="on" icon color="info"><v-icon>fa-book</v-icon></v-btn>
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
      <v-row justify="center" align="center">
        <v-col cols="12" md="3">
          <v-select
            :items="settingsService.USROWSPERPAGEOPTIONS"
            v-model="rows"
            label="Rows per page"
            style="width: 125px"
            @change="rowsChange"
          ></v-select>
        </v-col>
        <v-pagination
          v-model="page"
          :length="pageCount"
          :total-visible="20"
          @input="onRefresh"
        ></v-pagination>
      </v-row>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { inject } from 'vue-typescript-inject';
  import { WordsLangService } from '@/view-models/wpp/words-lang.service';
  import { SettingsService } from '@/view-models/misc/settings.service';
  import { googleString } from '@/common/common';
  import { MLangWord } from '@/models/wpp/lang-word';
  import { AppService } from '@/view-models/misc/app.service';

  @Component
  export default class WordsLang extends Vue {
    @inject() appService!: AppService;
    @inject() wordsLangService!: WordsLangService;
    @inject() settingsService!: SettingsService;

    headers = [
      { text: 'ID', sortable: false, value: 'ID' },
      { text: 'WORD', sortable: false, value: 'WORD' },
      { text: 'NOTE', sortable: false, value: 'NOTE' },
      { text: 'ACCURACY', sortable: false, value: 'ACCURACY' },
      { text: 'ACTIONS', sortable: false },
    ];
    newWord = '';
    page = 1;
    pageCount = 1;
    rows = 0;
    filter = '';
    filterType = 0;

    services = {};
    created() {
      this.$set(this.services, 'wordsLangService', this.wordsLangService);
      this.appService.initializeObject.subscribe(_ => {
        this.rows = this.settingsService.USROWSPERPAGE;
        this.onRefresh();
      });
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

    rowsChange(rows: number) {
      this.page = 1;
      this.onRefresh();
    }

    async onRefresh() {
      // https://stackoverflow.com/questions/4228356/integer-division-with-remainder-in-javascript
      await this.wordsLangService.getData(this.page, this.rows, this.filter, this.filterType);
      this.pageCount = (this.wordsLangService.langWordsCount + this.rows - 1) / this.rows >> 0;
      this.$forceUpdate();
    }

    deleteWord(item: MLangWord) {
      this.wordsLangService.delete(item);
    }

    async getNote(index: number) {
      console.log(index);
      await this.wordsLangService.getNote(index);
    }

    googleWord(word: string) {
      googleString(word);
    }
  }
</script>

<style>
  @import '../../assets/common.css';
</style>
