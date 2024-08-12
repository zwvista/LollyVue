<template>
  <div>
    <Toolbar>
      <template #start>
        <Select :options="settingsService.wordFilterTypes" optionLabel="label" optionValue="value" v-model="filterType" @change="onRefresh" />
        <FloatLabel>
          <InputText id="filter" type="text" v-model="filter" @keyup.enter="onRefresh" />
          <label for="filter">Filter</label>
        </FloatLabel>
        <Button @click.stop="showDetailDialog(0)"><font-awesome-icon icon="fa-plus"/>Add</Button>
        <Button @click="onRefresh()"><font-awesome-icon icon="fa-refresh"/>Refresh</Button>
<!--        <router-link to="/words-dict/lang/0">-->
          <Button icon="fa fa-book" label="Dictionary" />
<!--        </router-link>-->
      </template>
    </Toolbar>
    <Paginator :rows.sync="rows" :totalRecords="wordsLangService.langWordsCount" :rowsPerPageOptions="settingsService.USROWSPERPAGEOPTIONS" @page="onRefresh" />
    <DataTable
      :value="wordsLangService.langWords"
    >
      <Column headerStyle="width: 80px" field="ID" header="ID" />
      <Column field="WORD" header="WORD" />
      <Column field="NOTE" header="NOTE" />
      <Column headerStyle="width: 80px" field="ACCURACY" header="ACCURACY" />
      <Column headerStyle="width: 30%" header="ACTIONS">
        <template #body="slotProps">
          <Button v-tooltip2.top="'Delete'" severity="danger" @click="deleteWord(slotProps.data)"><font-awesome-icon icon="fa-trash"/></Button>
          <Button v-tooltip2.top="'Edit'" @click.stop="showDetailDialog(slotProps.data.ID)"><font-awesome-icon icon="fa-edit"/></Button>
          <Button v-tooltip2.top="'Speak'" @click="settingsService.speak(slotProps.data.WORD)"><font-awesome-icon icon="fa-volume-up"/></Button>
          <Button v-tooltip2.top="'Copy'" v-clipboard:copy="slotProps.data.WORD"><font-awesome-icon icon="fa-copy"/></Button>
          <Button v-tooltip2.top="'Google Word'" @click="googleWord(slotProps.data.WORD)"><font-awesome-icon icon="fa-brands fa-google"/></Button>
<!--          <router-link :to="{ name: 'words-dict', params: { type: 'lang', index: slotProps.index }}">-->
            <Button v-tooltip2.top="'Dictionary'"><font-awesome-icon icon="fa-book"/></Button>
<!--          </router-link>-->
          <Button v-show="settingsService.selectedDictNote" label="Retrieve Note" severity="warn" @click="getNote(slotProps.index)" />
        </template>
      </Column>
    </DataTable>
    <Paginator :rows.sync="rows" :totalRecords="wordsLangService.langWordsCount" :rowsPerPageOptions="settingsService.USROWSPERPAGEOPTIONS" @page="onRefresh" />
    <WordsLangDetail5 v-if="showDetail" v-model="showDetail" :id="detailId"></WordsLangDetail5>
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
  import WordsLangDetail5 from '@/components/primevue/WordsLangDetail5'

  const appService = ref(container.resolve(AppService));
  const wordsLangService = ref(container.resolve(WordsLangService));
  const settingsService = ref(container.resolve(SettingsService));
  const showDetail = ref(false);
  const detailId = ref(0);

  const page = ref(1);
  const pageCount = ref(1);
  const rows = ref(0);
  const filter = ref('');
  const filterType = ref(0);

  const onRefresh = async () => {
    // https://stackoverflow.com/questions/4228356/integer-division-with-remainder-in-javascript
    await wordsLangService.value.getData(page.value, rows.value, filter.value, filterType.value);
    pageCount.value = (wordsLangService.value.langWordsCount + rows.value - 1) / rows.value >> 0;
  };

  (async () => {
    await appService.value.getData();
    rows.value = settingsService.value.USROWSPERPAGE;
    await onRefresh();
  })();

  const rowsChange = (rows: number) => {
    page.value = 1;
    onRefresh();
  };

  const deleteWord = (item: MLangWord) => {
    wordsLangService.value.delete(item);
  };

  const getNote = async (index: number) => {
    console.log(index);
    await wordsLangService.value.getNote(index);
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
