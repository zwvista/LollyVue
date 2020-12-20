<template>
  <div>
    <q-toolbar :inverted="true">
      <q-select :options="settingsService.patternFilterTypes" v-model="filterType" @input="onRefresh"></q-select>
      <q-input float-label="Filter" v-model="filter" @keyup.enter="onRefresh"></q-input>
      <router-link to="/patterns-detail/0">
        <q-btn color="primary" icon="fa fa-plus" label="Add"></q-btn>
      </router-link>
      <q-btn color="primary" icon="fa fa-refresh" label="Refresh" @click="onRefresh()"></q-btn>
    </q-toolbar>
    <q-table
      :data="patternsService.patterns"
      :columns="columns"
      row-key="ID"
      :pagination.sync="pagination"
      :rows-per-page-options="settingsService.USROWSPERPAGEOPTIONS"
      @request="request"
    >
      <q-tr slot="body" slot-scope="props" :props="props" :style="props.row.colorStyle">
        <q-td key="ID" :props="props">{{props.row.ID}}</q-td>
        <q-td key="PATTERN" :props="props">{{props.row.PATTERN}}</q-td>
        <q-td key="TRANSLATION" :props="props">{{props.row.TRANSLATION}}</q-td>
        <q-td key="ACTIONS" :props="props">
          <q-btn round color="red" icon="fa fa-trash" size="xs" @click="deletePattern(props.row.ID)">
            <q-tooltip>Delete</q-tooltip>
          </q-btn>
          <router-link :to="{ name: 'patterns-detail', params: { id: props.row.ID }}">
            <q-btn round color="primary" icon="fa fa-edit" size="xs">
              <q-tooltip>Edit</q-tooltip>
            </q-btn>
          </router-link>
          <q-btn v-show="settingsService.selectedVoice" round color="primary" icon="fa fa-volume-up" size="xs"
                 @click="settingsService.speak(props.row.PATTERN)">
            <q-tooltip>Speak</q-tooltip>
          </q-btn>
          <q-btn round color="primary" icon="fa fa-copy" size="xs" v-clipboard:copy="props.row.PATTERN">
            <q-tooltip>Copy</q-tooltip>
          </q-btn>
          <q-btn round color="primary" icon="fa fa-google" size="xs" @click="googlePattern(props.row.PATTERN)">
            <q-tooltip>Google Pattern</q-tooltip>
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
  import { AppService } from '@/view-models/app.service';
  import { PatternsService } from '@/view-models/patterns.service';
  import { MPattern } from '@/models/wpp/pattern';

  @Component
  export default class Patterns2 extends Vue {
    @inject() appService!: AppService;
    @inject() patternsService!: PatternsService;
    @inject() settingsService!: SettingsService;

    columns = [
      { name: 'ID', field: 'ID', label: 'ID' },
      { name: 'PATTERN', field: 'PATTERN', label: 'PATTERN' },
      { name: 'NOTE', field: 'NOTE', label: 'NOTE' },
      { name: 'TAGS', field: 'TAGS', label: 'TAGS' },
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
      this.$set(this.services, 'patternsService', this.patternsService);
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
      this.patternsService.getData(this.pagination.page, this.pagination.rowsPerPage, this.filter, this.filterType).subscribe(_ => {
        this.pagination.rowsNumber = this.patternsService.patternCount;
        this.$forceUpdate();
      });
    }

    deletePattern(id: number) {
      this.patternsService.delete(id);
    }

    googlePattern(pattern: string) {
      googleString(pattern);
    }
  }
</script>

<style scoped>
</style>
