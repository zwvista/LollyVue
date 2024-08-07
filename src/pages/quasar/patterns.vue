<template>
  <div>
    <q-toolbar :inverted="true">
      <q-select map-options :options="settingsService.patternFilterTypes" v-model="filterType" @input="onRefresh"></q-select>
      <q-input float-label="Filter" v-model="filter" @keyup.enter="onRefresh"></q-input>
<!--      <router-link to="/patterns-detail/0">-->
        <q-btn color="primary" icon="fa fa-plus" label="Add"></q-btn>
<!--      </router-link>-->
      <q-btn color="primary" icon="fa fa-refresh" label="Refresh" @click="onRefresh()"></q-btn>
    </q-toolbar>
    <q-table
      :rows="patternsService.patterns"
      :columns="columns"
      row-key="ID"
      v-model:pagination="pagination"
      :rows-per-page-options="settingsService.USROWSPERPAGEOPTIONS"
      @request="request"
    >
      <template v-slot:body-cell-ACTIONS="props">
        <q-btn round color="red" icon="fa fa-trash" size="xs" @click="deletePattern(props.row.ID)">
          <q-tooltip>Delete</q-tooltip>
        </q-btn>
<!--        <router-link :to="{ name: 'patterns-detail', params: { id: props.row.ID }}">-->
          <q-btn round color="primary" icon="fa fa-edit" size="xs">
            <q-tooltip>Edit</q-tooltip>
          </q-btn>
<!--        </router-link>-->
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
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
  import { SettingsService } from '@/view-models/misc/settings.service';
  import { googleString } from '@/common/common';
  import { AppService } from '@/view-models/misc/app.service';
  import { PatternsService } from '@/view-models/wpp/patterns.service';
  import { container } from 'tsyringe';
  import { ref } from "vue";

  const appService = ref(container.resolve(AppService));
  const patternsService = ref(container.resolve(PatternsService));
  const settingsService = ref(container.resolve(SettingsService));

  const columns = ref([
    { name: 'ID', field: 'ID', label: 'ID' },
    { name: 'PATTERN', field: 'PATTERN', label: 'PATTERN' },
    { name: 'NOTE', field: 'NOTE', label: 'NOTE' },
    { name: 'TAGS', field: 'TAGS', label: 'TAGS' },
    { name: 'ACTIONS', label: 'ACTIONS' },
  ]);
  const pagination = ref({
    page: 1,
    rowsPerPage: 0,
    rowsNumber: 10,
  });
  const filter = ref('');
  const filterType = ref(0);

  (() => {
    appService.value.initializeObject.subscribe(_ => {
      pagination.value.rowsPerPage = settingsService.value.USROWSPERPAGE;
      onRefresh();
    });
  })();

  function request(props) {
    pagination.value.page = props.pagination.page;
    pagination.value.rowsPerPage = props.pagination.rowsPerPage;
    onRefresh();
  }

  async function onRefresh() {
    await patternsService.value.getData(pagination.value.page, pagination.value.rowsPerPage, filter.value, filterType.value);
    pagination.value.rowsNumber = patternsService.value.patternCount;
  }

  function deletePattern(id: number) {
    patternsService.value.delete(id);
  }

  function googlePattern(pattern: string) {
    googleString(pattern);
  }
</script>

<style scoped>
</style>
