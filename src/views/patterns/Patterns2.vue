<template>
  <div>
    <q-toolbar :inverted="true">
      <q-select :options="settingsService.patternFilterTypes" v-model="patternsService.filterType" @input="onRefresh"></q-select>
      <q-input float-label="Filter" v-model="patternsService.filter" @keyup.enter="onRefresh"></q-input>
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
        <q-td key="TAGS" :props="props">{{props.row.TAGS}}</q-td>
        <q-td key="TITLE" :props="props">{{props.row.TITLE}}</q-td>
        <q-td key="URL" :props="props">{{props.row.URL}}</q-td>
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
  import { SettingsService } from '@/shared/view-models/misc/settings.service';
  import { googleString } from '@/shared/common/common';
  import { AppService } from '@/shared/view-models/misc/app.service';
  import { PatternsService } from '@/shared/view-models/wpp/patterns.service';
  import { container } from 'tsyringe';

  @Component
  export default class Patterns2 extends Vue {
    appService = container.resolve(AppService);
    patternsService = container.resolve(PatternsService);
    settingsService = container.resolve(SettingsService);

    columns = [
      { name: 'ID', field: 'ID', label: 'ID' },
      { name: 'PATTERN', field: 'PATTERN', label: 'PATTERN' },
      { name: 'TAGS', field: 'TAGS', label: 'TAGS' },
      { name: 'TITLE', field: 'TITLE', label: 'TITLE' },
      { name: 'URL', field: 'URL', label: 'URL' },
      { name: 'ACTIONS', label: 'ACTIONS' },
    ];
    pagination = {
      page: 1,
      rowsPerPage: 0,
      rowsNumber: 10,
    };

    services = {};
    async created() {
      this.$set(this.services, 'patternsService', this.patternsService);
      await this.appService.getData();
      this.pagination.rowsPerPage = this.patternsService.rows = this.settingsService.USROWSPERPAGE;
      await this.onRefresh();
    }

    async request({pagination}) {
      this.pagination.page = this.patternsService.page = pagination.page;
      this.pagination.rowsPerPage = this.patternsService.rows = pagination.rowsPerPage;
      await this.onRefresh();
    }

    async onRefresh() {
      await this.patternsService.getData();
      this.pagination.rowsNumber = this.patternsService.patternCount;
      this.$forceUpdate();
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
