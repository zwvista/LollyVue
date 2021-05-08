<template>
  <div>
    <q-toolbar :inverted="true">
      <q-select :options="settingsService.phraseFilterTypes" v-model="filterType" @input="onRefresh"></q-select>
      <q-input float-label="Filter" v-model="filter" @keyup.enter="onRefresh"></q-input>
      <router-link to="/phrases-unit-detail/0">
        <q-btn color="primary" icon="fa fa-plus" label="Add"></q-btn>
      </router-link>
      <q-btn color="primary" icon="fa fa-refresh" label="Refresh" @click="onRefresh()"></q-btn>
    </q-toolbar>
    <q-table
      :data="phrasesUnitService.unitPhrases"
      :columns="columns"
      row-key="ID"
      :pagination.sync="pagination"
      :rows-per-page-options="[]"
    >
      <q-tr slot="body" slot-scope="props" :props="props" :style="props.row.colorStyle">
        <q-td key="ID" :props="props">{{props.row.ID}}</q-td>
        <q-td key="UNIT" :props="props">{{props.row.UNITSTR}}</q-td>
        <q-td key="PART" :props="props">{{props.row.PARTSTR}}</q-td>
        <q-td key="SEQNUM" :props="props">{{props.row.SEQNUM}}</q-td>
        <q-td key="PHRASEID" :props="props">{{props.row.PHRASEID}}</q-td>
        <q-td key="PHRASE" :props="props">{{props.row.PHRASE}}</q-td>
        <q-td key="TRANSLATION" :props="props">{{props.row.TRANSLATION}}</q-td>
        <q-td key="ACTIONS" :props="props">
          <q-btn round color="red" icon="fa fa-trash" size="xs" @click="deletePhrase(props.row)">
            <q-tooltip>Delete</q-tooltip>
          </q-btn>
          <router-link :to="{ name: 'phrases-unit-detail', params: { id: props.row.ID }}">
            <q-btn round color="primary" icon="fa fa-edit" size="xs">
              <q-tooltip>Edit</q-tooltip>
            </q-btn>
          </router-link>
          <q-btn v-show="settingsService.selectedVoice" round color="primary" icon="fa fa-volume-up" size="xs"
                 @click="settingsService.speak(props.row.WORD)">
            <q-tooltip>Speak</q-tooltip>
          </q-btn>
          <q-btn round color="primary" icon="fa fa-copy" size="xs" v-clipboard:copy="props.row.PHRASE">
            <q-tooltip>Copy</q-tooltip>
          </q-btn>
          <q-btn round color="primary" icon="fa fa-google" size="xs" @click="googleWord(props.row.PHRASE)">
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
  import { SettingsService } from '@/view-models/misc/settings.service';
  import { googleString } from '@/common/common';
  import { MUnitWord } from '@/models/wpp/unit-word';
  import { PhrasesUnitService } from '@/view-models/wpp/phrases-unit.service';
  import { MUnitPhrase } from '@/models/wpp/unit-phrase';
  import { AppService } from '@/view-models/misc/app.service';

  @Component
  export default class PhrasesUnit2 extends Vue {
    @inject() appService!: AppService;
    @inject() phrasesUnitService!: PhrasesUnitService;
    @inject() settingsService!: SettingsService;

    columns = [
      { name: 'ID', field: 'ID', label: 'ID' },
      { name: 'UNIT', field: 'UNITSTR', label: 'UNIT' },
      { name: 'PART', field: 'PARTSTR', label: 'PART' },
      { name: 'SEQNUM', field: 'SEQNUM', label: 'SEQNUM' },
      { name: 'PHRASEID', field: 'PHRASEID', label: 'PHRASEID' },
      { name: 'PHRASE', field: 'PHRASE', label: 'PHRASE' },
      { name: 'TRANSLATION', field: 'TRANSLATION', label: 'TRANSLATION' },
      { name: 'ACTIONS', label: 'ACTIONS' },
    ];
    pagination = {
      page: 1,
      rowsPerPage: 0, // current rows per page being displayed
    };
    filter = '';
    filterType = 0;

    services = {};
    created() {
      this.$set(this.services, 'phrasesUnitService', this.phrasesUnitService);
      this.appService.initializeObject.subscribe(_ => {
        this.onRefresh();
      });
    }

    onRefresh() {
      this.phrasesUnitService.getDataInTextbook(this.filter, this.filterType).subscribe();
    }

    deletePhrase(item: MUnitPhrase) {
      this.phrasesUnitService.delete(item);
    }

    googlePhrase(phrase: string) {
      googleString(phrase);
    }
  }
</script>

<style scoped>
</style>
