<template>
  <div>
    <v-toolbar>
      <v-flex xs6 md2>
        <v-select :items="settingsService.phraseFilterTypes" item-text="label" item-value="value" v-model="filterType" @change="onRefresh"></v-select>
      </v-flex>
      <v-flex xs6 md2>
        <v-text-field label="Filter" type="text" v-model="filter" @keyup.enter="onRefresh"></v-text-field>
      </v-flex>
      <router-link to="/phrases-lang-detail/0">
        <v-btn color="info"><v-icon left>fa-plus</v-icon>Add</v-btn>
      </router-link>
      <v-btn color="info" @click="onRefresh()"><v-icon left>fa-refresh</v-icon>Refresh</v-btn>
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
      :items="phrasesLangService.langPhrases"
      :items-per-page="-1"
      hide-default-footer
      class="elevation-1"
    >
      <template v-slot:body="{items}">
        <tbody>
        <tr v-for="(item, index) in items" :key="item.ID">
          <td>{{ item.ID }}</td>
          <td>{{ item.PHRASE }}</td>
          <td>{{ item.TRANSLATION }}</td>
          <td>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
               <v-btn v-bind="attrs" v-on="on" icon color="error" @click="deletePhrase(item)"><v-icon>fa-trash</v-icon></v-btn>
              </template>
              <span>Delete</span>
            </v-tooltip>
            <router-link :to="{ name: 'phrases-lang-detail', params: { id: item.ID }}">
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" v-on="on" icon color="info"><v-icon>fa-edit</v-icon></v-btn>
                </template>
                <span>Edit</span>
              </v-tooltip>
            </router-link>
            <v-tooltip v-show="settingsService.selectedVoice" top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" icon color="info" @click="settingsService.speak(item.PHRASE)"><v-icon>fa-volume-up</v-icon></v-btn>
              </template>
              <span>Speak</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" icon color="info" v-clipboard:copy="item.PHRASE"><v-icon>fa-copy</v-icon></v-btn>
              </template>
              <span>Copy</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" icon color="info" @click="googlePhrase(item.PHRASE)"><v-icon>fa-google</v-icon></v-btn>
              </template>
              <span>Google Phrase</span>
            </v-tooltip>
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
  import { PhrasesLangService } from '@/view-models/phrases-lang.service';
  import { googleString } from '@/common/common';
  import { SettingsService } from '@/view-models/settings.service';
  import { AppService } from '@/view-models/app.service';
  import { MLangPhrase } from '@/models/wpp/lang-phrase';

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

    rowsChange(rows: number) {
      this.page = 1;
      this.onRefresh();
    }

    onRefresh() {
      // https://stackoverflow.com/questions/4228356/integer-division-with-remainder-in-javascript
      this.phrasesLangService.getData(this.page, this.rows, this.filter, this.filterType).subscribe(_ => {
        this.pageCount = (this.phrasesLangService.langPhraseCount + this.rows - 1) / this.rows >> 0;
        this.$forceUpdate();
      });
    }

    deletePhrase(item: MLangPhrase) {
      this.phrasesLangService.delete(item);
    }

    googlePhrase(phrase: string) {
      googleString(phrase);
    }
  }
</script>

<style>
  @import '../assets/common.css';
</style>
