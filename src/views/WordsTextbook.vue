<template>
  <div>
    <v-toolbar>
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
      hide-actions
      class="elevation-1"
      ref="sortableTable"
      item-key="ID"
    >
      <template slot="items" slot-scope="props">
        <tr :key="props.item.ID" :style="props.item.colorStyle">
          <td>{{ props.item.ID }}</td>
          <td>{{ props.item.TEXTBOOKNAME }}</td>
          <td>{{ props.item.UNITSTR }}</td>
          <td>{{ props.item.PARTSTR }}</td>
          <td>{{ props.item.SEQNUM }}</td>
          <td>{{ props.item.WORDID }}</td>
          <td>{{ props.item.WORD }}</td>
          <td>{{ props.item.NOTE }}</td>
          <td>{{ props.item.LEVEL }}</td>
          <td>
            <v-tooltip top>
              <v-btn slot="activator" icon color="error" @click="deleteWord(props.item)"><v-icon>fa-trash</v-icon></v-btn>
              <span>Delete</span>
            </v-tooltip>
            <router-link :to="{ name: 'words-textbook-detail', params: { id: props.item.ID }}">
              <v-tooltip top>
                <v-btn slot="activator" icon color="info"><v-icon>fa-edit</v-icon></v-btn>
                <span>Edit</span>
              </v-tooltip>
            </router-link>
            <v-tooltip top v-show="settingsService.selectedVoice">
              <v-btn slot="activator" icon color="info" @click="settingsService.speak(props.item.WORD)"><v-icon>fa-volume-up</v-icon></v-btn>
              <span>Speak</span>
            </v-tooltip>
            <v-tooltip top>
              <v-btn slot="activator" icon color="info" v-clipboard:copy="props.item.WORD"><v-icon>fa-copy</v-icon></v-btn>
              <span>Copy</span>
            </v-tooltip>
            <v-tooltip top>
              <v-btn slot="activator" icon color="warning" @click="updateLevel(props.item, 1)"><v-icon>fa-arrow-up</v-icon></v-btn>
              <span>Level Up</span>
            </v-tooltip>
            <v-tooltip top>
              <v-btn slot="activator" icon color="warning" @click="updateLevel(props.item, -1)"><v-icon>fa-arrow-down</v-icon></v-btn>
              <span>Level Down</span>
            </v-tooltip>
            <v-tooltip top>
              <v-btn slot="activator" icon color="info" @click="googleWord(props.item.WORD)"><v-icon>fa-google</v-icon></v-btn>
              <span>Google Word</span>
            </v-tooltip>
            <router-link :to="{ name: 'words-dict', params: { type: 'textbook', index: props.index }}">
              <v-tooltip top>
                <v-btn slot="activator" icon color="info"><v-icon>fa-book</v-icon></v-btn>
                <span>Dictionary</span>
              </v-tooltip>
            </router-link>
            <v-btn v-show="settingsService.selectedDictNote" color="warning" @click="getNote(props.index)">Retrieve Note</v-btn>
          </td>
        </tr>
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
  import { MUnitWord } from "@/models/unit-word";

  @Component
  export default class WordsTextbook extends Vue {
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
      { text: 'ACTIONS', sortable: false },
    ];
    page = 1;
    pageCount = 1;
    rows = this.settingsService.USROWSPERPAGE;

    services = {};
    created() {
      this.$set(this.services, 'wordsUnitService', this.wordsUnitService);
      this.onRefresh();
    }

    pageChange(page: number) {
      this.page = page;
      this.onRefresh();
    }

    onRefresh() {
      // https://stackoverflow.com/questions/4228356/integer-division-with-remainder-in-javascript
      this.wordsUnitService.getDataInLang(this.page, this.rows).subscribe(_ => {
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

    updateLevel(item: MUnitWord, delta: number) {
      this.settingsService.updateLevel(item, item.WORDID, delta).subscribe();
    }
  }
</script>

<style>
  @import '../assets/common.css';
</style>
