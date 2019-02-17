<template>
  <div>
    <v-toolbar>
      <v-btn color="info"><v-icon left>fa-refresh</v-icon>Refresh</v-btn>
    </v-toolbar>
    <v-data-table
      :headers="headers"
      :items="phrasesTextbookService.textbookPhrases"
      hide-actions
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <tr :key="props.item.ID">
          <td>{{ props.item.TEXTBOOKNAME }}</td>
          <td>{{ props.item.UNIT }}</td>
          <td>{{ props.item.PART }}</td>
          <td>{{ props.item.SEQNUM }}</td>
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
            <v-tooltip top>
              <v-btn slot="activator" icon color="info" v-clipboard:copy="props.item.PHRASE"><v-icon>fa-copy</v-icon></v-btn>
              <span>Copy</span>
            </v-tooltip>
            <v-btn color="info" @click="googlePhrase(props.item.PHRASE)">Google Phrase</v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { inject } from 'vue-typescript-inject';
import { PhrasesTextbookService } from '../view-models/phrases-textbook.service';
import Sortable from 'sortablejs';
import { googleString } from '@/common/common';

@Component
export default class PhrasesTextbook extends Vue {
  @inject() phrasesTextbookService!: PhrasesTextbookService;

  headers = [
    { text: 'TEXTBOOKNAME', sortable: false, value: 'TEXTBOOKNAME' },
    { text: 'UNIT', sortable: false, value: 'UNIT' },
    { text: 'PART', sortable: false, value: 'PART' },
    { text: 'SEQNUM', sortable: false, value: 'SEQNUM' },
    { text: 'PHRASE', sortable: false, value: 'PHRASE' },
    { text: 'TRANSLATION', sortable: false, value: 'TRANSLATION' },
    { text: 'ACTIONS', sortable: false },
  ];

  services = {};
  created() {
    this.$set(this.services, 'phrasesTextbookService', this.phrasesTextbookService);
    this.phrasesTextbookService.getData().subscribe();
  }

  expandRow = null;

  googlePhrase(phrase: string) {
    googleString(phrase);
  }

}
</script>

<style>
  @import '../assets/common.css';
</style>
