<template>
  <div>
    <q-toolbar :inverted="true">
      <q-select map-options :options="settingsService.wordFilterTypes" v-model="filterType" @input="onRefresh"></q-select>
      <q-input label="Filter" v-model="filter" @keyup.enter="onRefresh"></q-input>
<!--      <router-link to="/words-lang-detail/0">-->
        <q-btn color="primary" icon="fa fa-plus" label="Add"></q-btn>
<!--      </router-link>-->
      <q-btn color="primary" icon="fa fa-refresh" label="Refresh" @click="onRefresh()"></q-btn>
<!--      <router-link to="/words-dict/lang/0">-->
        <q-btn color="primary" icon="fa fa-book" label="Dictionary"></q-btn>
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
<!--        <router-link :to="{ name: 'words-lang-detail', params: { id: props.row.ID }}">-->
          <q-btn round color="primary" icon="fa fa-edit" size="xs">
            <q-tooltip>Edit</q-tooltip>
          </q-btn>
<!--        </router-link>-->
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
        <q-btn v-show="settingsService.selectedDictNote" color="secondary" label="Retrieve Note"
               @click="getNote(wordsLangService.langWords.indexOf(props.row))">
        </q-btn>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
  import { SettingsService } from '@/view-models/misc/settings.service';
  import { googleString } from '@/common/common';
  import { WordsLangService } from '@/view-models/wpp/words-lang.service';
  import { MLangWord } from '@/models/wpp/lang-word';
  import { AppService } from '@/view-models/misc/app.service';
  import { container } from 'tsyringe';
  import { ref } from "vue";

  const appService = ref(container.resolve(AppService));
  const wordsLangService = ref(container.resolve(WordsLangService));
  const settingsService = ref(container.resolve(SettingsService));

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
    await wordsLangService.value.getData(pagination.value.page, pagination.value.rowsPerPage, filter.value, filterType.value);
    pagination.value.rowsNumber = wordsLangService.value.langWordsCount;
  }

  function deleteWord(item: MLangWord) {
    wordsLangService.value.delete(item);
  }

  async function getNote(index: number) {
    console.log(index);
    await wordsLangService.value.getNote(index);
  }

  function googleWord(word: string) {
    googleString(word);
  }
</script>

<style scoped>
</style>
