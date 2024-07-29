<template>
  <div>
    <Toolbar>
      <template #start>
        <Select :options="settingsService.wordFilterTypes" optionLabel="label" optionValue="value" v-model="filterType" @change="onRefresh" />
        <FloatLabel>
          <InputText id="filter" type="text" v-model="filter" @keyup.enter="onRefresh" />
          <label for="filter">Filter</label>
        </FloatLabel>
        <Select :options="settingsService.textbookFilters" optionLabel="label" optionValue="value" v-model="textbookFilter" @change="onRefresh" />
        <Button @click="onRefresh()"><font-awesome-icon icon="fa-refresh"/>Refresh</Button>
<!--        <router-link to="/words-dict/textbook/0">-->
          <Button><font-awesome-icon icon="fa-book"/>Dictionary</Button>
<!--        </router-link>-->
      </template>
    </Toolbar>
    <Paginator :rows.sync="rows" :totalRecords="wordsUnitService.textbookWordCount" :rowsPerPageOptions="settingsService.USROWSPERPAGEOPTIONS" @page="onRefresh" />
    <DataTable
      :value="wordsUnitService.textbookWords"
    >
      <Column headerStyle="width: 80px" field="ID" header="ID" />
      <Column headerStyle="width: 150px" field="TEXTBOOKNAME" header="TEXTBOOKNAME" />
      <Column headerStyle="width: 80px" field="UNITSTR" header="UNIT" />
      <Column headerStyle="width: 80px" field="PARTSTR" header="PART" />
      <Column headerStyle="width: 80px" field="SEQNUM" header="SEQNUM" />
      <Column headerStyle="width: 80px" field="WORDID" header="WORDID" />
      <Column field="WORD" header="WORD" />
      <Column field="NOTE" header="NOTE" />
      <Column headerStyle="width: 80px" field="ACCURACY" header="ACCURACY" />
      <Column headerStyle="width: 30%" header="ACTIONS">
        <template #body="slotProps">
          <Button v-tooltip2.top="'Delete'" severity="danger" @click="deleteWord(slotProps.data)"><font-awesome-icon icon="fa-trash"/></Button>
<!--          <router-link :to="{ name: 'words-textbook-detail', params: { id: slotProps.data.ID }}">-->
            <Button v-tooltip2.top="'Edit'"><font-awesome-icon icon="fa-edit"/></Button>
<!--          </router-link>-->
          <Button v-tooltip2.top="'Speak'" @click="settingsService.speak(slotProps.data.WORD)"><font-awesome-icon icon="fa-volume-up"/></Button>
          <Button v-tooltip2.top="'Copy'" v-clipboard:copy="slotProps.data.WORD"><font-awesome-icon icon="fa-copy"/></Button>
          <Button v-tooltip2.top="'Google Word'" @click="googleWord(slotProps.data.WORD)"><font-awesome-icon icon="fa-brands fa-google"/></Button>
<!--          <router-link :to="{ name: 'words-dict', params: { type: 'textbook', index: slotProps.index }}">-->
            <Button v-tooltip2.top="'Dictionary'"><font-awesome-icon icon="fa-book"/></Button>
<!--          </router-link>-->
          <Button v-show="settingsService.selectedDictNote" label="Retrieve Note" severity="warn" @click="getNote(slotProps.index)" />
        </template>
      </Column>
    </DataTable>
    <Paginator :rows.sync="rows" :totalRecords="wordsUnitService.textbookWordCount" :rowsPerPageOptions="settingsService.USROWSPERPAGEOPTIONS" @page="onRefresh" />
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
