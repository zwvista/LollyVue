<template>
  <div>
    <v-toolbar>
      <v-flex xs6 md2>
        <v-select :items="settingsService.phraseFilterTypes" item-text="label" item-value="value" v-model="filterType" @change="onEnterFilter"></v-select>
      </v-flex>
      <v-flex xs6 md2>
        <v-text-field label="Filter" type="text" v-model="filter" @keyup.enter="onEnterFilter"></v-text-field>
      </v-flex>
      <router-link to="/phrases-lang-detail/0">
        <v-btn color="info"><v-icon left>fa-plus</v-icon>Add</v-btn>
      </router-link>
      <v-btn color="info" @click="onRefresh()"><v-icon left>fa-refresh</v-icon>Refresh</v-btn>
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
      :items="phrasesLangService.langPhrases"
      hide-default-footer
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <tr :key="props.item.ID">
          <td>{{ props.item.ID }}</td>
          <td>{{ props.item.PHRASE }}</td>
          <td>{{ props.item.TRANSLATION }}</td>
          <td>
            <v-tooltip top>
              <v-btn slot="activator" icon color="error" @click="deletePhrase(props.item.ID)"><v-icon>fa-trash</v-icon></v-btn>
              <span>Delete</span>
            </v-tooltip>
            <router-link :to="{ name: 'phrases-lang-detail', params: { id: props.item.ID }}">
              <v-tooltip top>
                <v-btn slot="activator" icon color="info"><v-icon>fa-edit</v-icon></v-btn>
                <span>Edit</span>
              </v-tooltip>
            </router-link>
            <v-tooltip v-show="settingsService.selectedVoice" top>
              <v-btn slot="activator" icon color="info" @click="settingsService.speak(props.item.PHRASE)"><v-icon>fa-volume-up</v-icon></v-btn>
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
  import { PhrasesLangService } from '@/view-models/phrases-lang.service';
  import { googleString } from '@/common/common';
  import { SettingsService } from '@/view-models/settings.service';
  import { AppService } from '@/view-models/app.service';

  @Component
  export default class PhrasesLang extends Vue {
    @inject() appService!: AppService;
    @inject() phrasesLangService!: PhrasesLangService;
    @inject() settingsService!: SettingsService;

    headers = [
      { text: 'ID', sortable: false, value: 'ID' },
      { text: 'PHRASE', sortable: false, value: 'PHRASE' },
      { text: 'TRANSLATION', sortable: false, value: 'TRANSLATION' },
      { text: 'ACTIONS', sortable: false },
    ];
    page = 1;
    pageCount = 1;
    rows = 0;
    filter = '';
    filterType = 0;

    services = {};
    created() {
      this.$set(this.services, 'phrasesLangService', this.phrasesLangService);
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
      this.phrasesLangService.getData(this.page, this.rows, this.filter, this.filterType).subscribe(_ => {
        this.pageCount = (this.phrasesLangService.langPhraseCount + this.rows - 1) / this.rows >> 0;
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

    deletePhrase(id: number) {
      this.phrasesLangService.delete(id);
    }

    googlePhrase(phrase: string) {
      googleString(phrase);
    }
  }
</script>

<style>
  @import '../assets/common.css';
</style>
