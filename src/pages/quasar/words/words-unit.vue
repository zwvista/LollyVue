<template>
  <div>
    <q-toolbar :inverted="true">
      <q-input label="New Word" v-model="newWord" @keyup.enter="onEnterNewWord"></q-input>
      <q-btn v-show="settingsService.selectedVoice" round color="primary" icon="fa fa-volume-up"
             @click="settingsService.speak(newWord)">
        <q-tooltip>Speak</q-tooltip>
      </q-btn>
      <q-select map-options :options="settingsService.wordFilterTypes" v-model="filterType" @input="onRefresh"></q-select>
      <q-input label="Filter" v-model="filter" @keyup.enter="onRefresh"></q-input>
<!--      <router-link to="/words-unit-detail/0">-->
        <q-btn color="primary" icon="fa fa-plus" label="Add"></q-btn>
<!--      </router-link>-->
      <q-btn color="primary" icon="fa fa-refresh" label="Refresh" @click="onRefresh()"></q-btn>
      <q-btn v-show="settingsService.selectedDictNote" color="secondary" label="Retrieve All Notes"></q-btn>
      <q-btn v-show="settingsService.selectedDictNote" color="secondary" label="Retrieve Notes If Empty"></q-btn>
<!--      <router-link to="/words-dict/unit/0">-->
        <q-btn color="primary" icon="fa fa-book" label="Dictionary"></q-btn>
<!--      </router-link>-->
    </q-toolbar>
    <q-table
      :rows="wordsUnitService.unitWords"
      :columns="columns"
      row-key="ID"
      v-model:pagination="pagination"
      :rows-per-page-options="[]"
    >
      <template v-slot:body-cell-ACTIONS="props">
        <q-td key="ACTIONS" :props="props">
          <q-btn round color="red" icon="fa fa-trash" size="xs" @click="deleteWord(props.row)">
            <q-tooltip>Delete</q-tooltip>
          </q-btn>
<!--          <router-link :to="{ name: 'words-unit-detail', params: { id: props.row.ID }}">-->
            <q-btn round color="primary" icon="fa fa-edit" size="xs">
              <q-tooltip>Edit</q-tooltip>
            </q-btn>
<!--          </router-link>-->
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
<!--          <router-link :to="{ name: 'words-dict', params: { type: 'unit', index: wordsUnitService.unitWords.indexOf(props.row) }}">-->
            <q-btn round color="primary" icon="fa fa-book" size="xs">
              <q-tooltip>Dictionary</q-tooltip>
            </q-btn>
<!--          </router-link>-->
          <q-btn v-show="settingsService.selectedDictNote" color="secondary" label="Retrieve Note"
                 @click="getNote(wordsUnitService.unitWords.indexOf(props.row))">
          </q-btn>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
  import { WordsUnitService } from '@/view-models/wpp/words-unit.service';
  import { SettingsService } from '@/view-models/misc/settings.service';
  import { googleString } from '@/common/common';
  import { MUnitWord } from '@/models/wpp/unit-word';
  import { AppService } from '@/view-models/misc/app.service';
  import { container } from 'tsyringe';
  import { ref } from "vue";

  const appService = ref(container.resolve(AppService));
  const wordsUnitService = ref(container.resolve(WordsUnitService));
  const settingsService = ref(container.resolve(SettingsService));

  const columns = ref([
    { name: 'ID', field: 'ID', label: 'ID' },
    { name: 'UNIT', field: 'UNITSTR', label: 'UNIT' },
    { name: 'PART', field: 'PARTSTR', label: 'PART' },
    { name: 'SEQNUM', field: 'SEQNUM', label: 'SEQNUM' },
    { name: 'WORDID', field: 'WORDID', label: 'WORDID' },
    { name: 'WORD', field: 'WORD', label: 'WORD' },
    { name: 'NOTE', field: 'NOTE', label: 'NOTE' },
    { name: 'ACCURACY', field: 'ACCURACY', label: 'ACCURACY' },
    { name: 'ACTIONS', label: 'ACTIONS' },
  ]);
  const pagination = ref({
    page: 1,
    rowsPerPage: 0, // current rows per page being displayed
  });
  const newWord = ref('');
  const filter = ref('');
  const filterType = ref(0);

  (() => {
    appService.value.initializeObject.subscribe(_ => {
      onRefresh();
    });
  })();

  async function onEnterNewWord() {
    if (!newWord.value) return;
    const o = wordsUnitService.value.newUnitWord();
    o.WORD = settingsService.value.autoCorrectInput(newWord.value);
    newWord.value = '';
    const id = await wordsUnitService.value.create(o);
    o.ID = id as number;
    wordsUnitService.value.unitWords.push(o);
  }

  async function onRefresh() {
    await wordsUnitService.value.getDataInTextbook(filter.value, filterType.value);
  }

  async function deleteWord(item: MUnitWord) {
    await wordsUnitService.value.delete(item);
  }

  async function getNote(index: number) {
    console.log(index);
    await wordsUnitService.value.getNote(index);
  }

  function googleWord(word: string) {
    googleString(word);
  }

  function getNotes(ifEmpty: boolean) {
    wordsUnitService.value.getNotes(ifEmpty, () => {}, () => {});
  }
</script>

<style scoped>
</style>
