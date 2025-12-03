<template>
  <div>
    <q-toolbar :inverted="true">
      <q-select map-options :options="settingsService.wordFilterTypes" v-model="wordsLangService.filterType" @input="onRefresh" />
      <q-input label="Filter" v-model="wordsLangService.filter" @keyup.enter="onRefresh" />
      <q-btn color="primary" icon="fa fa-plus" label="Add" @click.stop="showDetailDialog(0)" />
      <q-btn color="primary" icon="fa fa-refresh" label="Refresh" @click="onRefresh()" />
<!--      <router-link to="/words-dict/lang/0">-->
        <q-btn color="primary" icon="fa fa-book" label="Dictionary" />
<!--      </router-link>-->
    </q-toolbar>
    <q-table
      :rows="wordsLangService.langWords"
      :columns="columns"
      row-key="ID"
      v-model:pagination="pagination"
      :rows-per-page-options="settingsService.USROWSPERPAGEOPTIONS"
      @request="request"
    >
      <template v-slot:body-cell-ACTIONS="props">
        <q-btn round color="red" icon="fa fa-trash" size="xs" @click="deleteWord(props.row)">
          <q-tooltip>Delete</q-tooltip>
        </q-btn>
        <q-btn round color="primary" icon="fa fa-edit" size="xs" @click.stop="showDetailDialog(props.row.ID)">
          <q-tooltip>Edit</q-tooltip>
        </q-btn>
        <q-btn v-show="settingsService.selectedVoice" round color="primary" icon="fa fa-volume-up" size="xs"
               @click="settingsService.speak(props.row.WORD)">
          <q-tooltip>Speak</q-tooltip>
        </q-btn>
        <q-btn round color="primary" icon="fa fa-copy" size="xs" v-clipboard:copy="props.row.WORD">
          <q-tooltip>Copy</q-tooltip>
        </q-btn>
        <q-btn round color="primary" icon="fa fa-google" size="xs" @click="googleWord(props.row.WORD)">
          <q-tooltip>Google Word</q-tooltip>
        </q-btn>
<!--        <router-link :to="{ name: 'words-dict', params: { type: 'lang', index: wordsLangService.langWords.indexOf(props.row) }}">-->
          <q-btn round color="primary" icon="fa fa-book" size="xs">
            <q-tooltip>Dictionary</q-tooltip>
          </q-btn>
<!--        </router-link>-->
        <q-btn v-show="settingsService.selectedDictNote" color="secondary" label="Get Note"
               @click="getNote(props.row)">
        </q-btn>
        <q-btn v-show="settingsService.selectedDictNote" color="secondary" label="Clear Note"
               @click="clearNote(props.row)">
        </q-btn>
      </template>
    </q-table>
    <WordsLangDetail2 v-if="showDetail" v-model="showDetail" :id="detailId"></WordsLangDetail2>
  </div>
</template>

<script setup lang="ts">
  import { SettingsService } from '@/shared/view-models/misc/settings.service';
  import { googleString } from '@/shared/common/common';
  import { WordsLangService } from '@/shared/view-models/wpp/words-lang.service';
  import { MLangWord } from '@/shared/models/wpp/lang-word';
  import { AppService } from '@/shared/view-models/misc/app.service';
  import { container } from 'tsyringe';
  import { ref } from "vue";
  import WordsLangDetail2 from '@/components/quasar/WordsLangDetail2.vue'

  const appService = ref(container.resolve(AppService));
  const wordsLangService = ref(container.resolve(WordsLangService));
  const settingsService = ref(container.resolve(SettingsService));
  const showDetail = ref(false);
  const detailId = ref(0);

  const columns = ref([
    { name: 'ID', field: 'ID', label: 'ID' },
    { name: 'WORD', field: 'WORD', label: 'WORD' },
    { name: 'NOTE', field: 'NOTE', label: 'NOTE' },
    { name: 'ACCURACY', field: 'ACCURACY', label: 'ACCURACY' },
    { name: 'ACTIONS', label: 'ACTIONS' },
  ]);
  const pagination = ref({
    page: 1,
    rowsPerPage: 0,
    rowsNumber: 10,
  });

  const onRefresh = async () => {
    await wordsLangService.value.getData();
    pagination.value.rowsNumber = wordsLangService.value.langWordsCount;
  };

  (async () => {
    await appService.value.getData();
    pagination.value.rowsPerPage = wordsLangService.value.rows = settingsService.value.USROWSPERPAGE;
    await onRefresh();
  })();

  const request = async (props) => {
    pagination.value.page = wordsLangService.value.page = props.pagination.page;
    pagination.value.rowsPerPage = wordsLangService.value.rows = props.pagination.rowsPerPage;
    await onRefresh();
  };

  const deleteWord = async (item: MLangWord) => {
    await wordsLangService.value.delete(item);
  };

  const getNote = async (item: MLangWord) => {
    await wordsLangService.value.getNote(item);
  };

  const clearNote = async (item: MLangWord) => {
    await wordsLangService.value.clearNote(item);
  };

  const googleWord = (word: string) => {
    googleString(word);
  };

  const showDetailDialog = (id: number) => {
    detailId.value = id;
    showDetail.value = true;
  };
</script>

<style scoped>
</style>
