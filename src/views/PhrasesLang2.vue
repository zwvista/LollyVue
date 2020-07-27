<template>
  <div>
    <q-toolbar :inverted="true">
      <q-select :options="settingsService.phraseFilterTypes" v-model="filterType" @input="onRefresh"></q-select>
      <q-input float-label="Filter" v-model="filter" @keyup.enter="onRefresh"></q-input>
      <router-link to="/phrases-lang-detail/0">
        <q-btn color="primary" icon="fa fa-plus" label="Add"></q-btn>
      </router-link>
      <q-btn color="primary" icon="fa fa-refresh" label="Refresh" @click="onRefresh()"></q-btn>
    </q-toolbar>
    <q-table
      :data="phrasesLangService.langPhrases"
      :columns="columns"
      row-key="ID"
      :pagination.sync="pagination"
      :rows-per-page-options="settingsService.USROWSPERPAGEOPTIONS"
      @request="request"
    >
      <q-tr slot="body" slot-scope="props" :props="props" :style="props.row.colorStyle">
        <q-td key="ID" :props="props">{{props.row.ID}}</q-td>
        <q-td key="PHRASE" :props="props">{{props.row.PHRASE}}</q-td>
        <q-td key="TRANSLATION" :props="props">{{props.row.TRANSLATION}}</q-td>
        <q-td key="ACTIONS" :props="props">
          <q-btn round color="red" icon="fa fa-trash" size="xs" @click="deletePhrase(props.row)">
            <q-tooltip>Delete</q-tooltip>
          </q-btn>
          <router-link :to="{ name: 'phrases-lang-detail', params: { id: props.row.ID }}">
            <q-btn round color="primary" icon="fa fa-edit" size="xs">
              <q-tooltip>Edit</q-tooltip>
            </q-btn>
          </router-link>
          <q-btn v-show="settingsService.selectedVoice" round color="primary" icon="fa fa-volume-up" size="xs"
                 @click="settingsService.speak(props.row.PHRASE)">
            <q-tooltip>Speak</q-tooltip>
          </q-btn>
          <q-btn round color="primary" icon="fa fa-copy" size="xs" v-clipboard:copy="props.row.PHRASE">
            <q-tooltip>Copy</q-tooltip>
          </q-btn>
          <q-btn round color="primary" icon="fa fa-google" size="xs" @click="googlePhrase(props.row.PHRASE)">
            <q-tooltip>Google Phrase</q-tooltip>
          </q-btn>
        </q-td>
      </q-tr>
    </q-table>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { inject } from 'vue-typescript-inject';
  import { SettingsService } from '@/view-models/settings.service';
  import { googleString } from '@/common/common';
  import { MUnitPhrase } from '@/models/unit-phrase';
  import { PhrasesLangService } from '@/view-models/phrases-lang.service';
  import { AppService } from '@/view-models/app.service';
  import { MLangPhrase } from '@/models/lang-phrase';

  @Component
  export default class PhrasesLang2 extends Vue {
    @inject() appService!: AppService;
    @inject() phrasesLangService!: PhrasesLangService;
    @inject() settingsService!: SettingsService;

    columns = [
      { name: 'ID', field: 'ID', label: 'ID' },
      { name: 'PHRASE', field: 'PHRASE', label: 'PHRASE' },
      { name: 'TRANSLATION', field: 'TRANSLATION', label: 'TRANSLATION' },
      { name: 'ACTIONS', label: 'ACTIONS' },
    ];
    pagination = {
      page: 1,
      rowsPerPage: 0,
      rowsNumber: 10,
    };
    filter = '';
    filterType = 0;

    services = {};
    created() {
      this.$set(this.services, 'phrasesLangService', this.phrasesLangService);
      this.appService.initializeObject.subscribe(_ => {
        this.pagination.rowsPerPage = this.settingsService.USROWSPERPAGE;
        this.onRefresh();
      });
    }

    request({pagination}) {
      this.pagination.page = pagination.page;
      this.pagination.rowsPerPage = pagination.rowsPerPage;
      this.onRefresh();
    }

    onRefresh() {
      this.phrasesLangService.getData(this.pagination.page, this.pagination.rowsPerPage, this.filter, this.filterType).subscribe(_ => {
        this.pagination.rowsNumber = this.phrasesLangService.langPhraseCount;
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

<style scoped>
</style>
