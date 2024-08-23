<template>
  <div>
    <q-toolbar :inverted="true">
      <q-select map-options :options="settingsService.patternFilterTypes" v-model="filterType" @input="onRefresh" />
      <q-input float-label="Filter" v-model="filter" @keyup.enter="onRefresh" />
      <q-btn color="primary" icon="fa fa-plus" label="Add" @click.stop="showDetailDialog(0)" />
      <q-btn color="primary" icon="fa fa-refresh" label="Refresh" @click="onRefresh()" />
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
        <q-btn round color="primary" icon="fa fa-edit" size="xs" @click.stop="showDetailDialog(props.row.ID)">
          <q-tooltip>Edit</q-tooltip>
        </q-btn>
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
    <PatternsDetail2 v-if="showDetail" v-model="showDetail" :id="detailId"></PatternsDetail2>
  </div>
</template>

<script setup lang="ts">
  import { SettingsService } from '@/view-models/misc/settings.service';
  import { googleString } from '@/common/common';
  import { AppService } from '@/view-models/misc/app.service';
  import { PatternsService } from '@/view-models/wpp/patterns.service';
  import { container } from 'tsyringe';
  import { ref } from "vue";
  import PatternsDetail2 from '@/components/quasar/PatternsDetail2.vue'

  const appService = ref(container.resolve(AppService));
  const patternsService = ref(container.resolve(PatternsService));
  const settingsService = ref(container.resolve(SettingsService));
  const showDetail = ref(false);
  const detailId = ref(0);

  const columns = ref([
    { name: 'ID', field: 'ID', label: 'ID' },
    { name: 'PATTERN', field: 'PATTERN', label: 'PATTERN' },
    { name: 'TAGS', field: 'TAGS', label: 'TAGS' },
    { name: 'TITLE', field: 'TITLE', label: 'TITLE' },
    { name: 'URL', field: 'URL', label: 'URL' },
    { name: 'ACTIONS', label: 'ACTIONS' },
  ]);
  const pagination = ref({
    page: 1,
    rowsPerPage: 0,
    rowsNumber: 10,
  });
  const filter = ref('');
  const filterType = ref(0);

  const onRefresh = async () => {
    await patternsService.value.getData(pagination.value.page, pagination.value.rowsPerPage, filter.value, filterType.value);
    pagination.value.rowsNumber = patternsService.value.patternCount;
  };

  (async () => {
    await appService.value.getData();
    pagination.value.rowsPerPage = settingsService.value.USROWSPERPAGE;
    await onRefresh();
  })();

  const request = async (props) => {
    pagination.value.page = props.pagination.page;
    pagination.value.rowsPerPage = props.pagination.rowsPerPage;
    await onRefresh();
  };

  const deletePattern = async (id: number) => {
    await patternsService.value.delete(id);
  };

  const googlePattern = (pattern: string) => {
    googleString(pattern);
  };

  const showDetailDialog = (id: number) => {
    detailId.value = id;
    showDetail.value = true;
  };
</script>

<style scoped>
</style>
