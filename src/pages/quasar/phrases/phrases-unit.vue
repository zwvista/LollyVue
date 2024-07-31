<template>
  <div>
    <q-toolbar :inverted="true">
      <q-select map-options :options="settingsService.phraseFilterTypes" v-model="filterType" @input="onRefresh"></q-select>
      <q-input label="Filter" v-model="filter" @keyup.enter="onRefresh"></q-input>
<!--      <router-link to="/phrases-unit-detail/0">-->
        <q-btn color="primary" icon="fa fa-plus" label="Add"></q-btn>
<!--      </router-link>-->
      <q-btn color="primary" icon="fa fa-refresh" label="Refresh" @click="onRefresh()"></q-btn>
    </q-toolbar>
    <q-table
      :rows="phrasesUnitService.unitPhrases"
      :columns="columns"
      row-key="ID"
      v-model:pagination="pagination"
      :rows-per-page-options="[]"
    >
      <template v-slot:body-cell-ACTIONS="props">
        <q-btn round color="red" icon="fa fa-trash" size="xs" @click="deletePhrase(props.row)">
          <q-tooltip>Delete</q-tooltip>
        </q-btn>
<!--        <router-link :to="{ name: 'phrases-unit-detail', params: { id: props.row.ID }}">-->
          <q-btn round color="primary" icon="fa fa-edit" size="xs">
            <q-tooltip>Edit</q-tooltip>
          </q-btn>
<!--        </router-link>-->
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
      </template>
    </q-table>
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

  const appService = ref(container.resolve(AppService));
  const phrasesUnitService = ref(container.resolve(PhrasesUnitService));
  const settingsService = ref(container.resolve(SettingsService));

  const columns = ref([
    { name: 'ID', field: 'ID', label: 'ID' },
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
    rowsPerPage: 0, // current rows per page being displayed
  });
  const filter = ref('');
  const filterType = ref(0);

  (() => {
    appService.value.initializeObject.subscribe(_ => {
      onRefresh();
    });
  })();

  async function onRefresh() {
    await phrasesUnitService.value.getDataInTextbook(filter.value, filterType.value);
  }

  function deletePhrase(item: MUnitPhrase) {
    phrasesUnitService.value.delete(item);
  }

  function googlePhrase(phrase: string) {
    googleString(phrase);
  }
</script>

<style scoped>
</style>
