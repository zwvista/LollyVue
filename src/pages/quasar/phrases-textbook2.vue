<template>
  <div>
    <q-toolbar :inverted="true">
      <q-select map-options :options="settingsService.phraseFilterTypes" v-model="filterType" @input="onRefresh" />
      <q-input label="Filter" v-model="filter" @keyup.enter="onRefresh" />
      <q-select map-options :options="settingsService.textbookFilters" v-model="textbookFilter" @input="onRefresh" />
      <q-btn color="primary" icon="fa fa-refresh" label="Refresh" @click="onRefresh()" />
    </q-toolbar>
    <q-table
      :rows="phrasesUnitService.textbookPhrases"
      :columns="columns"
      row-key="ID"
      v-model:pagination="pagination"
      :rows-per-page-options="settingsService.USROWSPERPAGEOPTIONS"
      @request="request"
    >
      <template v-slot:body-cell-ACTIONS="props">
        <q-btn round color="red" icon="fa fa-trash" size="xs" @click="deletePhrase(props.row)">
          <q-tooltip>Delete</q-tooltip>
        </q-btn>
        <q-btn round color="primary" icon="fa fa-edit" size="xs" @click.stop="showDetailDialog(props.row.ID)">
          <q-tooltip>Edit</q-tooltip>
        </q-btn>
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
      </template>
    </q-table>
    <PhrasesTextbookDetail2 v-if="showDetail" v-model="showDetail" :id="detailId"></PhrasesTextbookDetail2>
  </div>
</template>

<script setup lang="ts">
  import { SettingsService } from '@/view-models/misc/settings.service';
  import { googleString } from '@/common/common';
  import { PhrasesUnitService } from '@/view-models/wpp/phrases-unit.service';
  import { MUnitPhrase } from '@/models/wpp/unit-phrase';
  import { AppService } from '@/view-models/misc/app.service';
  import { container } from 'tsyringe';
  import { ref } from "vue";
  import PhrasesTextbookDetail2 from '@/components/quasar/PhrasesTextbookDetail2'

  const appService = ref(container.resolve(AppService));
  const phrasesUnitService = ref(container.resolve(PhrasesUnitService));
  const settingsService = ref(container.resolve(SettingsService));
  const showDetail = ref(false);
  const detailId = ref(0);

  const columns = ref([
    { name: 'ID', field: 'ID', label: 'ID' },
    { name: 'TEXTBOOKNAME', field: 'TEXTBOOKNAME', label: 'TEXTBOOKNAME' },
    { name: 'UNIT', field: 'UNITSTR', label: 'UNIT' },
    { name: 'PART', field: 'PARTSTR', label: 'PART' },
    { name: 'SEQNUM', field: 'SEQNUM', label: 'SEQNUM' },
    { name: 'PHRASEID', field: 'PHRASEID', label: 'PHRASEID' },
    { name: 'PHRASE', field: 'PHRASE', label: 'PHRASE' },
    { name: 'TRANSLATION', field: 'TRANSLATION', label: 'TRANSLATION' },
    { name: 'ACTIONS', label: 'ACTIONS' },
  ]);
  const pagination = ref({
    page: 1,
    rowsPerPage: 0,
    rowsNumber: 10,
  });
  const filter = ref('');
  const filterType = ref(0);
  const textbookFilter = ref(0);

  const onRefresh = async () => {
    await phrasesUnitService.value.getDataInLang(pagination.value.page, pagination.value.rowsPerPage, filter.value, filterType.value, textbookFilter.value);
    pagination.value.rowsNumber = phrasesUnitService.value.textbookPhraseCount;
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

  const deletePhrase = async (item: MUnitPhrase) => {
    await phrasesUnitService.value.delete(item);
  };

  const googlePhrase = (phrase: string) => {
    googleString(phrase);
  };

  const showDetailDialog = (id: number) => {
    detailId.value = id;
    showDetail.value = true;
  };
</script>

<style scoped>
</style>
