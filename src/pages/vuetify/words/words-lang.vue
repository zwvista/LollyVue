<template>
  <div>
    <v-toolbar>
        <v-select :items="settingsService.wordFilterTypes" item-title="label" v-model="filterType" @update:modelValue="onRefresh"></v-select>
        <v-text-field label="Filter" type="text" v-model="filter" @keyup.enter="onRefresh"></v-text-field>
<!--      <router-link to="/words-lang-detail/0">-->
        <v-btn variant="elevated" prepend-icon="fa-plus" color="info">Add</v-btn>
<!--      </router-link>-->
      <v-btn variant="elevated" prepend-icon="fa-refresh" color="info" @click="onRefresh()">Refresh</v-btn>
<!--      <router-link to="/words-dict/lang/0">-->
        <v-btn variant="elevated" prepend-icon="fa-book" color="info">Dictionary</v-btn>
<!--      </router-link>-->
    </v-toolbar>
    <div class="text-xs-center">
      <v-row justify="center" align="center">
        <v-col cols="12" md="3">
          <v-select
            :items="settingsService.USROWSPERPAGEOPTIONS"
            v-model="rows"
            label="Rows per page"
            style="width: 125px"
            @update:modelValue="rowsChange"
          ></v-select>
        </v-col>
        <v-pagination
          v-model="page"
          :length="pageCount"
          :total-visible="20"
          @update:modelValue="onRefresh"
        ></v-pagination>
      </v-row>
    </div>
    <v-data-table
      :headers="headers"
      :items="wordsLangService.langWords"
      :items-per-page="-1"
      hide-default-footer
      class="elevation-1"
      item-key="ID"
    >
      <template v-slot:item.ACTIONS="{ item, index }">
        <v-tooltip text="Speak" location="top">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" icon="fa-trash" color="error" @click="deleteWord(item)"></v-btn>
          </template>
          <span>Delete</span>
        </v-tooltip>
<!--        <router-link :to="{ name: 'words-lang-detail', params: { id: item.ID }}">-->
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
<!--        <router-link :to="{ name: 'words-dict', params: { type: 'lang', index: index }}">-->
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
            @update:modelValue="rowsChange"
          ></v-select>
        </v-col>
        <v-pagination
          v-model="page"
          :length="pageCount"
          :total-visible="20"
          @update:modelValue="onRefresh"
        ></v-pagination>
      </v-row>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { WordsLangService } from '@/view-models/wpp/words-lang.service';
  import { SettingsService } from '@/view-models/misc/settings.service';
  import { googleString } from '@/common/common';
  import { MLangWord } from '@/models/wpp/lang-word';
  import { AppService } from '@/view-models/misc/app.service';
  import { container } from 'tsyringe';
  import { ref } from "vue";

  const appService = ref(container.resolve(AppService));
  const wordsLangService = ref(container.resolve(WordsLangService));
  const settingsService = ref(container.resolve(SettingsService));

  const headers = ref([
    { title: 'ID', sortable: false, key: 'ID' },
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

  (() => {
    appService.value.initializeObject.subscribe(async _ => {
      rows.value = settingsService.value.USROWSPERPAGE;
      await onRefresh();
    });
  })();

  async function rowsChange(rows: number) {
    page.value = 1;
    await onRefresh();
  }

  async function onRefresh() {
    // https://stackoverflow.com/questions/4228356/integer-division-with-remainder-in-javascript
    await wordsLangService.value.getData(page.value, rows.value, filter.value, filterType.value);
    pageCount.value = (wordsLangService.value.langWordsCount + rows.value - 1) / rows.value >> 0;
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

<style>
  /*@import '../../assets/common.css';*/
</style>
