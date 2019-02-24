<template>
  <div>
    <v-toolbar>
      <router-link to="/phrases-lang-detail/0">
        <v-btn color="info"><v-icon left>fa-plus</v-icon>Add</v-btn>
      </router-link>
      <v-btn color="info"><v-icon left>fa-refresh</v-icon>Refresh</v-btn>
    </v-toolbar>
    <v-data-table
      :headers="headers"
      :items="phrasesLangService.langPhrases"
      hide-actions
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <tr :key="props.item.ID">
          <td>{{ props.item.ID }}</td>
          <td>{{ props.item.PHRASE }}</td>
          <td>{{ props.item.TRANSLATION }}</td>
          <td>
            <v-tooltip top>
              <v-btn slot="activator" icon color="error"><v-icon>fa-trash</v-icon></v-btn>
              <span>Delete</span>
            </v-tooltip>
            <router-link :to="{ name: 'phrases-lang-detail', params: { id: props.item.ID }}">
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
  import { PhrasesLangService } from '../view-models/phrases-lang.service';
  import { googleString } from '@/common/common';
  import { SettingsService } from '@/view-models/settings.service';

  @Component
  export default class PhrasesLang extends Vue {
    @inject() phrasesLangService!: PhrasesLangService;
    @inject() settingsService!: SettingsService;

    headers = [
      { text: 'ID', sortable: false, value: 'ID' },
      { text: 'PHRASE', sortable: false, value: 'PHRASE' },
      { text: 'TRANSLATION', sortable: false, value: 'TRANSLATION' },
      { text: 'ACTIONS', sortable: false },
    ];
    newWord!: string;

    services = {};
    created() {
      this.$set(this.services, 'phrasesLangService', this.phrasesLangService);
      this.phrasesLangService.getData().subscribe();
    }

    googlePhrase(phrase: string) {
      googleString(phrase);
    }

  }
</script>

<style>
  @import '../assets/common.css';
</style>
