<template>
  <div>
    <Toolbar>
      <template #start>
        <Select :options="settingsService.wordFilterTypes" optionLabel="label" optionValue="value" v-model="wordsUnitService.filterType" @change="onRefresh" />
        <FloatLabel>
          <InputText id="filter" type="text" v-model="wordsUnitService.filter" @keyup.enter="onRefresh" />
          <label for="filter">Filter</label>
        </FloatLabel>
        <Select :options="settingsService.textbookFilters" optionLabel="label" optionValue="value" v-model="wordsUnitService.textbookFilter" @change="onRefresh" />
        <Button rounded @click="onRefresh()"><font-awesome-icon icon="fa-refresh"/>Refresh</Button>
<!--        <router-link to="/words-dict/textbook/0">-->
          <Button rounded><font-awesome-icon icon="fa-book"/>Dictionary</Button>
<!--        </router-link>-->
      </template>
    </Toolbar>
    <Paginator :rows="wordsUnitService.rows" :totalRecords="wordsUnitService.textbookWordCount" :rowsPerPageOptions="settingsService.USROWSPERPAGEOPTIONS" @page="onPage($event)" />
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
          <Button rounded v-tooltip2.top="'Delete'" severity="danger" @click="deleteWord(slotProps.data)"><font-awesome-icon icon="fa-trash"/></Button>
          <Button rounded v-tooltip2.top="'Edit'" @click.stop="showDetailDialog(slotProps.data.ID)"><font-awesome-icon icon="fa-edit"/></Button>
          <Button rounded v-tooltip2.top="'Speak'" @click="settingsService.speak(slotProps.data.WORD)"><font-awesome-icon icon="fa-volume-up"/></Button>
          <Button rounded v-tooltip2.top="'Copy'" v-clipboard:copy="slotProps.data.WORD"><font-awesome-icon icon="fa-copy"/></Button>
          <Button rounded v-tooltip2.top="'Google Word'" @click="googleWord(slotProps.data.WORD)"><font-awesome-icon icon="fa-brands fa-google"/></Button>
<!--          <router-link :to="{ name: 'words-dict', params: { type: 'textbook', index: slotProps.index }}">-->
            <Button rounded v-tooltip2.top="'Dictionary'"><font-awesome-icon icon="fa-book"/></Button>
<!--          </router-link>-->
          <Button rounded v-show="settingsService.selectedDictNote" label="Get Note" severity="warn" @click="getNote(slotProps.data)" />
          <Button rounded v-show="settingsService.selectedDictNote" label="Clear Note" severity="warn" @click="clearNote(slotProps.data)" />
        </template>
      </Column>
    </DataTable>
    <Paginator :rows.sync="wordsUnitService.rows" :totalRecords="wordsUnitService.textbookWordCount" :rowsPerPageOptions="settingsService.USROWSPERPAGEOPTIONS" @page="onPage($event)" />
    <WordsTextbookDetail5 v-if="showDetail" v-model="showDetail" :id="detailId"></WordsTextbookDetail5>
  </div>
</template>

<script setup lang="ts">
  import { SettingsService } from '@/shared/view-models/misc/settings.service';
  import { googleString } from '@/shared/common/common';
  import { WordsUnitService } from '@/shared/view-models/wpp/words-unit.service';
  import { MUnitWord } from '@/shared/models/wpp/unit-word';
  import { AppService } from '@/shared/view-models/misc/app.service';
  import { container } from 'tsyringe';
  import { ref } from "vue";
  import WordsTextbookDetail5 from '@/components/primevue/WordsTextbookDetail5.vue'

  const appService = ref(container.resolve(AppService));
  const wordsUnitService = ref(container.resolve(WordsUnitService));
  const settingsService = ref(container.resolve(SettingsService));
  const showDetail = ref(false);
  const detailId = ref(0);

  const onRefresh = async () => {
    // https://stackoverflow.com/questions/4228356/integer-division-with-remainder-in-javascript
    await wordsUnitService.value.getDataInLang();
  };

  const onPage = async (event: any) => {
    wordsUnitService.value.page = event.page + 1;
    await onRefresh();
  };

  (async () => {
    await appService.value.getData();
    wordsUnitService.value.rows = settingsService.value.USROWSPERPAGE;
    await onRefresh();
  })();

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

  const showDetailDialog = (id: number) => {
    detailId.value = id;
    showDetail.value = true;
  };
</script>

<style>
  /*@import '../../assets/common.css';*/
</style>
