<template>
  <div>
    <v-toolbar>
      <v-btn color="info" @click="onRefresh(-1)"><v-icon left>fa-refresh</v-icon>Refresh</v-btn>
    </v-toolbar>
    <template>
      <div class="text-xs-center">
        <v-pagination
          v-model="page"
          :length="pageCount"
          @input="pageChange"
        ></v-pagination>
      </div>
    </template>
    <v-data-table
      :headers="headers"
      :items="phrasesTextbookService.textbookPhrases"
      hide-actions
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <tr :key="props.item.ID">
          <td>{{ props.item.ID }}</td>
          <td>{{ props.item.TEXTBOOKNAME }}</td>
          <td>{{ props.item.UNITSTR }}</td>
          <td>{{ props.item.PARTSTR }}</td>
          <td>{{ props.item.SEQNUM }}</td>
          <td>{{ props.item.PHRASEID }}</td>
          <td>{{ props.item.PHRASE }}</td>
          <td>{{ props.item.TRANSLATION }}</td>
          <td>
            <v-tooltip top>
              <v-btn slot="activator" icon color="error"><v-icon>fa-trash</v-icon></v-btn>
              <span>Delete</span>
            </v-tooltip>
            <router-link :to="{ name: 'phrases-textbook-detail', params: { id: props.item.ID }}">
              <v-tooltip top>
                <v-btn slot="activator" icon color="info"><v-icon>fa-edit</v-icon></v-btn>
                <span>Edit</span>
              </v-tooltip>
            </router-link>
            <v-tooltip v-show="settingsService.selectedVoice" top>
              <v-btn slot="activator" icon color="info" @click="speak(props.item.PHRASE)"><v-icon>fa-volume-up</v-icon></v-btn>
              <span>Speak</span>
            </v-tooltip>
            <v-tooltip top>
              <v-btn slot="activator" icon color="info" v-clipboard:copy="props.item.PHRASE"><v-icon>fa-copy</v-icon></v-btn>
              <span>Copy</span>
            </v-tooltip>
            <v-tooltip top>
              <v-btn slot="activator" icon color="info" @click="googlePhrase(props.item.PHRASE)"><v-icon>fa-google</v-icon></v-btn>
              <span>Google Phrase</span>
            </v-tooltip>
          </td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { inject } from 'vue-typescript-inject';
  import { PhrasesTextbookService } from '@/view-models/phrases-textbook.service';
  import { googleString } from '@/common/common';
  import { SettingsService } from '@/view-models/settings.service';

  @Component
  export default class PhrasesTextbook extends Vue {
    @inject() phrasesTextbookService!: PhrasesTextbookService;
    @inject() settingsService!: SettingsService;

    headers = [
      { text: 'ID', sortable: false, value: 'ID' },
      { text: 'TEXTBOOKNAME', sortable: false, value: 'TEXTBOOKNAME' },
      { text: 'UNIT', sortable: false, value: 'UNIT' },
      { text: 'PART', sortable: false, value: 'PART' },
      { text: 'SEQNUM', sortable: false, value: 'SEQNUM' },
      { text: 'PHRASEID', sortable: false, value: 'PHRASEID' },
      { text: 'PHRASE', sortable: false, value: 'PHRASE' },
      { text: 'TRANSLATION', sortable: false, value: 'TRANSLATION' },
      { text: 'ACTIONS', sortable: false },
    ];
    page = 1;
    pageCount = 1;
    rows = this.settingsService.USROWSPERPAGE;

    services = {};
    created() {
      this.$set(this.services, 'phrasesTextbookService', this.phrasesTextbookService);
      this.onRefresh(-1);
    }

    pageChange(page: number) {
      this.onRefresh(page);
    }

    onRefresh(page: number) {
      if (page === -1) page = this.page;
      // https://stackoverflow.com/questions/4228356/integer-division-with-remainder-in-javascript
      this.phrasesTextbookService.getData(this.page, this.rows).subscribe(_ => {
        this.pageCount = (this.phrasesTextbookService.textbookPhraseCount + this.rows - 1) / this.rows >> 0;
      });
    }

    googlePhrase(phrase: string) {
      googleString(phrase);
    }

    speak(phrase: string) {
      this.settingsService.speech.speak({
        text: phrase,
        queue: false,
      });
    }
  }
</script>

<style>
  @import '../assets/common.css';
</style>
