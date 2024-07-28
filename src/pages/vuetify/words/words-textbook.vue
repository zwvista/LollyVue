<template>
  <div>
    <v-toolbar>
      <v-select :items="settingsService.wordFilterTypes" item-title="label" item-value="value" v-model="filterType" @change="onRefresh"></v-select>
      <v-text-field label="Filter" type="text" v-model="filter" @keyup.enter="onRefresh"></v-text-field>
      <v-select :items="settingsService.textbookFilters" item-title="label" item-value="value" v-model="textbookFilter" @change="onRefresh"></v-select>
      <v-btn color="info"><v-icon left>fa-refresh</v-icon>Refresh</v-btn>
      <router-link to="/words-dict/textbook/0">
        <v-btn color="info" @click="onRefresh()"><v-icon left>fa-book</v-icon>Dictionary</v-btn>
      </router-link>
    </v-toolbar>
    <div class="text-xs-center">
      <v-row justify="center" align="center">
        <v-col cols="12" md="3">
          <v-select
            :items="settingsService.USROWSPERPAGEOPTIONS"
            v-model="rows"
            label="Rows per page"
            style="width: 125px"
            @change="rowsChange"
          ></v-select>
        </v-col>
        <v-pagination
          v-model="page"
          :length="pageCount"
          :total-visible="20"
          @input="onRefresh"
        ></v-pagination>
      </v-row>
    </div>
    <v-data-table
      :headers="headers"
      :items="wordsUnitService.textbookWords"
      :items-per-page="-1"
      hide-default-footer
      class="elevation-1"
      ref="sortableTable"
      item-key="ID"
    >
      <template v-slot:item.ACTIONS="{ item, index }">
        <v-tooltip text="Delete" location="top">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" icon="fa-trash" color="error" @click="deleteWord(item)"></v-btn>
          </template>
        </v-tooltip>
<!--        <router-link :to="{ name: 'words-textbook-detail', params: { id: item.ID }}">-->
          <v-tooltip text="Edit" location="top">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" icon="fa-edit" color="info"></v-btn>
            </template>
          </v-tooltip>
<!--        </router-link>-->
        <v-tooltip text="Speak" location="top">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" icon="fa-volume-up" color="info" @click="settingsService.speak(item.WORD)" v-show="settingsService.selectedVoice"></v-btn>
          </template>
        </v-tooltip>
        <v-tooltip text="Copy" location="top">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" icon="fa-copy" color="info" v-clipboard:copy="item.WORD"></v-btn>
          </template>
        </v-tooltip>
        <v-tooltip text="Google Word" location="top">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" icon="fa-brands fa-google" color="info" @click="googleWord(item.WORD)"></v-btn>
          </template>
        </v-tooltip>
<!--        <router-link :to="{ name: 'words-dict', params: { type: 'textbook', index: index }}">-->
          <v-tooltip text="Dictionary" location="top">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" icon="fa-book" color="info"></v-btn>
            </template>
          </v-tooltip>
<!--        </router-link>-->
        <v-btn v-show="settingsService.selectedDictNote" color="warning" @click="getNote(index)">Retrieve Note</v-btn>
      </template>
    </v-data-table>
    <div class="text-xs-center">
      <v-row justify="center" align="center">
        <v-col cols="12" md="3">
          <v-select
            :items="settingsService.USROWSPERPAGEOPTIONS"
            v-model="rows"
            label="Rows per page"
            style="width: 125px"
            @change="rowsChange"
          ></v-select>
        </v-col>
        <v-pagination
          v-model="page"
          :length="pageCount"
          :total-visible="20"
          @input="onRefresh"
        ></v-pagination>
      </v-row>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { SettingsService } from '@/view-models/misc/settings.service';
  import { googleString } from '@/common/common';
  import { WordsUnitService } from '@/view-models/wpp/words-unit.service';
  import { MUnitWord } from '@/models/wpp/unit-word';
  import { AppService } from '@/view-models/misc/app.service';
  import { container } from 'tsyringe';
  import { ref } from "vue";

  const appService = ref(container.resolve(AppService));
  const wordsUnitService = ref(container.resolve(WordsUnitService));
  const settingsService = ref(container.resolve(SettingsService));

  const headers = ref([
    { title: 'ID', sortable: false, key: 'ID' },
    { title: 'TEXTBOOKNAME', sortable: false, key: 'TEXTBOOKNAME' },
    { title: 'UNIT', sortable: false, key: 'UNITSTR' },
    { title: 'PART', sortable: false, key: 'PARTSTR' },
    { title: 'SEQNUM', sortable: false, key: 'SEQNUM' },
    { title: 'WORDID', sortable: false, key: 'WORDID' },
    { title: 'WORD', sortable: false, key: 'WORD' },
    { title: 'NOTE', sortable: false, key: 'NOTE' },
    { title: 'ACCURACY', sortable: false, key: 'ACCURACY' },
    { title: 'ACTIONS', sortable: false, key: 'ACTIONS' },
  ]);
  const page = ref(1);
  const pageCount = ref(1);
  const rows = ref(0);
  const filter = ref('');
  const filterType = ref(0);
  const textbookFilter = ref(0);

  (() => {
    appService.value.initializeObject.subscribe(_ => {
      rows.value = settingsService.value.USROWSPERPAGE;
      onRefresh();
    });
  })();

  function rowsChange(rows: number) {
    page.value = 1;
    onRefresh();
  }

  async function onRefresh() {
    // https://stackoverflow.com/questions/4228356/integer-division-with-remainder-in-javascript
    await wordsUnitService.value.getDataInLang(page.value, rows.value, filter.value, filterType.value, textbookFilter.value);
    pageCount.value = (wordsUnitService.value.textbookWordCount + rows.value - 1) / rows.value >> 0;
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
</script>

<style>
  /*@import '../../assets/common.css';*/
</style>
