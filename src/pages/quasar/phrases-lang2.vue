<template>
  <div>
    <q-toolbar :inverted="true">
      <q-select map-options :options="settingsService.phraseFilterTypes" v-model="phrasesLangService.filterType" @input="onRefresh" />
      <q-input label="Filter" v-model="phrasesLangService.filter" @keyup.enter="onRefresh" />
      <q-btn color="primary" icon="fa fa-plus" label="Add" @click.stop="showDetailDialog(0)" />
      <q-btn color="primary" icon="fa fa-refresh" label="Refresh" @click="onRefresh()" />
    </q-toolbar>
    <q-table
      :rows="phrasesLangService.langPhrases"
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
    <PhrasesLangDetail2 v-if="showDetail" v-model="showDetail" :id="detailId"></PhrasesLangDetail2>
  </div>
</template>

<script setup lang="ts">
  import { SettingsService } from '@/shared/view-models/misc/settings.service';
  import { googleString } from '@/shared/common/common';
  import { PhrasesLangService } from '@/shared/view-models/wpp/phrases-lang.service';
  import { AppService } from '@/shared/view-models/misc/app.service';
  import { MLangPhrase } from '@/shared/models/wpp/lang-phrase';
  import { container } from 'tsyringe';
  import { ref } from "vue";
  import PhrasesLangDetail2 from '@/components/quasar/PhrasesLangDetail2.vue'

  const appService = ref(container.resolve(AppService));
  const phrasesLangService = ref(container.resolve(PhrasesLangService));
  const settingsService = ref(container.resolve(SettingsService));
  const showDetail = ref(false);
  const detailId = ref(0);

  const columns = ref([
    { name: 'ID', field: 'ID', label: 'ID' },
    { name: 'PHRASE', field: 'PHRASE', label: 'PHRASE' },
    { name: 'TRANSLATION', field: 'TRANSLATION', label: 'TRANSLATION' },
    { name: 'ACTIONS', label: 'ACTIONS' },
  ]);
  const pagination = ref({
    page: 1,
    rowsPerPage: 0,
    rowsNumber: 10,
  });

  const onRefresh = async () => {
    await phrasesLangService.value.getData();
    pagination.value.rowsNumber = phrasesLangService.value.langPhraseCount;
  };

  (async () => {
    await appService.value.getData();
    pagination.value.rowsPerPage = phrasesLangService.value.rows = settingsService.value.USROWSPERPAGE;
    await onRefresh();
  })();

  const request = async (props) => {
    pagination.value.page = phrasesLangService.value.page = props.pagination.page;
    pagination.value.rowsPerPage = phrasesLangService.value.rows = props.pagination.rowsPerPage;
    await onRefresh();
  };

  const deletePhrase = async (item: MLangPhrase) => {
    await phrasesLangService.value.delete(item);
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
