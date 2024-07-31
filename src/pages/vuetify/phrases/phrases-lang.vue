<template>
  <div>
    <v-toolbar>
      <v-select :items="settingsService.phraseFilterTypes" item-title="label" item-value="value" v-model="filterType" @change="onRefresh"></v-select>
      <v-text-field label="Filter" type="text" v-model="filter" @keyup.enter="onRefresh"></v-text-field>
<!--      <router-link to="/phrases-lang-detail/0">-->
        <v-btn variant="elevated" prepend-icon="fa-plus" color="info">Add</v-btn>
<!--      </router-link>-->
      <v-btn variant="elevated" prepend-icon="fa-refresh" color="info" @click="onRefresh()">Refresh</v-btn>
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
      :items="phrasesLangService.langPhrases"
      :items-per-page="-1"
      hide-default-footer
      class="elevation-1"
    >
      <template v-slot:item.ACTIONS="{ item, index }">
        <v-tooltip text="Delete" location="top">
          <template v-slot:activator="{ props }">
           <v-btn v-bind="props" icon="fa-trash" color="error" @click="deletePhrase(item)"></v-btn>
          </template>
        </v-tooltip>
<!--        <router-link :to="{ name: 'phrases-lang-detail', params: { id: item.ID }}">-->
          <v-tooltip text="Edit" location="top">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" icon="fa-edit" color="info"></v-btn>
            </template>
          </v-tooltip>
<!--        </router-link>-->
        <v-tooltip text="Speak" location="top">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" icon="fa-volume-up" color="info" @click="settingsService.speak(item.PHRASE)" v-show="settingsService.selectedVoice"></v-btn>
          </template>
        </v-tooltip>
        <v-tooltip text="Copy" location="top">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" icon="fa-copy" color="info" v-clipboard:copy="item.PHRASE"></v-btn>
          </template>
        </v-tooltip>
        <v-tooltip text="Google Phrase" location="top">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" icon="fa-brands fa-google" color="info" @click="googlePhrase(item.PHRASE)"></v-btn>
          </template>
        </v-tooltip>
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
  import { PhrasesLangService } from '@/view-models/wpp/phrases-lang.service';
  import { googleString } from '@/common/common';
  import { SettingsService } from '@/view-models/misc/settings.service';
  import { AppService } from '@/view-models/misc/app.service';
  import { MLangPhrase } from '@/models/wpp/lang-phrase';
  import { container } from 'tsyringe';
  import { ref } from "vue";

  const appService = ref(container.resolve(AppService));
  const phrasesLangService = ref(container.resolve(PhrasesLangService));
  const settingsService = ref(container.resolve(SettingsService));

  const headers = ref([
    { title: 'ID', sortable: false, key: 'ID' },
    { title: 'PHRASE', sortable: false, key: 'PHRASE' },
    { title: 'TRANSLATION', sortable: false, key: 'TRANSLATION' },
    { title: 'ACTIONS', sortable: false, key: 'ACTIONS' },
  ]);
  const page = ref(1);
  const pageCount = ref(1);
  const rows = ref(0);
  const filter = ref('');
  const filterType = ref(0);

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
    await phrasesLangService.value.getData(page.value, rows.value, filter.value, filterType.value);
    pageCount.value = (phrasesLangService.value.langPhraseCount + rows.value - 1) / rows.value >> 0;
  }

  function deletePhrase(item: MLangPhrase) {
    phrasesLangService.value.delete(item);
  }

  function googlePhrase(phrase: string) {
    googleString(phrase);
  }
</script>

<style>
  /*@import '../../assets/common.css';*/
</style>
