<template>
  <div>
    <v-toolbar>
      <v-flex xs6 md2>
        <v-select :items="settingsService.phraseFilterTypes" item-text="label" item-value="value" v-model="filterType" @change="onRefresh"></v-select>
      </v-flex>
      <v-flex xs6 md2>
        <v-text-field label="Filter" type="text" v-model="filter" @keyup.enter="onRefresh"></v-text-field>
      </v-flex>
      <v-flex xs6 md2>
        <v-select :items="settingsService.textbookFilters" item-text="label" item-value="value" v-model="textbookFilter" @change="onRefresh"></v-select>
      </v-flex>
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
      :items="phrasesUnitService.textbookPhrases"
      :items-per-page="-1"
      hide-default-footer
      class="elevation-1"
    >
      <template v-slot:body="{items}">
        <tbody>
        <tr v-for="(item, index) in items" :key="item.ID">
          <td>{{ item.ID }}</td>
          <td>{{ item.TEXTBOOKNAME }}</td>
          <td>{{ item.UNITSTR }}</td>
          <td>{{ item.PARTSTR }}</td>
          <td>{{ item.SEQNUM }}</td>
          <td>{{ item.PHRASEID }}</td>
          <td>{{ item.PHRASE }}</td>
          <td>{{ item.TRANSLATION }}</td>
          <td>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" icon color="error" @click="deletePhrase(item)"><v-icon>fa-trash</v-icon></v-btn>
              </template>
              <span>Delete</span>
            </v-tooltip>
            <router-link :to="{ name: 'phrases-textbook-detail', params: { id: item.ID }}">
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
  import { googleString } from '@/common/common';
  import { SettingsService } from '@/view-models/misc/settings.service';
  import { PhrasesUnitService } from '@/view-models/wpp/phrases-unit.service';
  import { MUnitPhrase } from '@/models/wpp/unit-phrase';
  import { AppService } from '@/view-models/misc/app.service';
  import { container } from 'tsyringe';

  @Component
  export default class PhrasesTextbook extends Vue {
    appService = container.resolve(AppService);
    phrasesUnitService = container.resolve(PhrasesUnitService);
    settingsService = container.resolve(SettingsService);

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
    rows = 0;
    filter = '';
    filterType = 0;
    textbookFilter = 0;

    services = {};
    created() {
      this.$set(this.services, 'phrasesUnitService', this.phrasesUnitService);
      this.appService.initializeObject.subscribe(_ => {
        this.rows = this.settingsService.USROWSPERPAGE;
        this.onRefresh();
      });
    }

    rowsChange(rows: number) {
      this.page = 1;
      this.onRefresh();
    }

    async onRefresh() {
      // https://stackoverflow.com/questions/4228356/integer-division-with-remainder-in-javascript
      await this.phrasesUnitService.getDataInLang(this.page, this.rows, this.filter, this.filterType, this.textbookFilter);
      this.pageCount = (this.phrasesUnitService.textbookPhraseCount + this.rows - 1) / this.rows >> 0;
      this.$forceUpdate();
    }

    deletePhrase(item: MUnitPhrase) {
      this.phrasesUnitService.delete(item);
    }

    googlePhrase(phrase: string) {
      googleString(phrase);
    }
  }
</script>

<style>
  @import '../../assets/common.css';
</style>
