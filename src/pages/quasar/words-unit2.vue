<template>
  <div>
    <q-toolbar :inverted="true">
      <q-input label="New Word" v-model="newWord" @keyup.enter="onEnterNewWord" />
      <q-btn v-show="settingsService.selectedVoice" round color="primary" icon="fa fa-volume-up"
             @click="settingsService.speak(newWord)">
        <q-tooltip>Speak</q-tooltip>
      </q-btn>
      <q-select map-options :options="settingsService.wordFilterTypes" v-model="filterType" @input="onRefresh" />
      <q-input label="Filter" v-model="filter" @keyup.enter="onRefresh" />
      <q-btn color="primary" icon="fa fa-plus" label="Add" @click.stop="showDetailDialog(0)" />
      <q-btn color="primary" icon="fa fa-refresh" label="Refresh" @click="onRefresh()" />
      <q-btn v-show="settingsService.selectedDictNote" color="secondary" label="Get All Notes" @click="getNotes(false)" />
      <q-btn v-show="settingsService.selectedDictNote" color="secondary" label="Get Notes If Empty" @click="getNotes(true)" />
      <q-btn v-show="settingsService.selectedDictNote" color="secondary" label="Clear All Notes" @click="clearNotes(false)" />
      <q-btn v-show="settingsService.selectedDictNote" color="secondary" label="Clear Notes If Empty" @click="clearNotes(true)" />
<!--      <router-link to="/words-dict/unit/0">-->
        <q-btn color="primary" icon="fa fa-book" label="Dictionary" />
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
<!--          <router-link :to="{ name: 'words-dict', params: { type: 'unit', index: wordsUnitService.unitWords.indexOf(props.row) }}">-->
            <q-btn round color="primary" icon="fa fa-book" size="xs">
              <q-tooltip>Dictionary</q-tooltip>
            </q-btn>
<!--          </router-link>-->
          <q-btn v-show="settingsService.selectedDictNote" color="secondary" label="Get Note"
                 @click="getNote(props.row)">
          </q-btn>
          <q-btn v-show="settingsService.selectedDictNote" color="secondary" label="Clear Note"
                 @click="clearNote(props.row)">
          </q-btn>
        </q-td>
      </template>
    </q-table>
    <WordsUnitDetail2 v-if="showDetail" v-model="showDetail" :id="detailId"></WordsUnitDetail2>
  </div>
</template>

<script setup lang="ts">
  import { WordsUnitService } from '@/shared/view-models/wpp/words-unit.service';
  import { SettingsService } from '@/shared/view-models/misc/settings.service';
  import { googleString } from '@/shared/common/common';
  import { MUnitWord } from '@/shared/models/wpp/unit-word';
  import { AppService } from '@/shared/view-models/misc/app.service';
  import { container } from 'tsyringe';
  import { ref } from "vue";
  import WordsUnitDetail2 from '@/components/quasar/WordsUnitDetail2.vue'

  const appService = ref(container.resolve(AppService));
  const wordsUnitService = ref(container.resolve(WordsUnitService));
  const settingsService = ref(container.resolve(SettingsService));
  const showDetail = ref(false);
  const detailId = ref(0);

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

  const onRefresh = async () => {
    await wordsUnitService.value.getDataInTextbook(filter.value, filterType.value);
  };

  (async () => {
    await appService.value.getData();
    await onRefresh();
  })();

  const onEnterNewWord = async () => {
    if (!newWord.value) return;
    const o = wordsUnitService.value.newUnitWord();
    o.WORD = settingsService.value.autoCorrectInput(newWord.value);
    newWord.value = '';
    const id = await wordsUnitService.value.create(o);
    o.ID = id as number;
    wordsUnitService.value.unitWords.push(o);
  };

  const deleteWord = async (item: MUnitWord) => {
    await wordsUnitService.value.delete(item);
  };

  const getNote = async (item: MUnitWord) => {
    await wordsUnitService.value.getNote(item);
  };

  const clearNote = async (item: MUnitWord) => {
    await wordsUnitService.value.clearNote(item);
  };

  const googleWord = (word: string) => {
    googleString(word);
  };

  const getNotes = (ifEmpty: boolean) => {
    wordsUnitService.value.getNotes(ifEmpty, () => {}, () => {});
  };

  const clearNotes = (ifEmpty: boolean) => {
    wordsUnitService.value.clearNotes(ifEmpty, () => {}, () => {});
  };

  const showDetailDialog = (id: number) => {
    detailId.value = id;
    showDetail.value = true;
  };
</script>

<style scoped>
</style>
