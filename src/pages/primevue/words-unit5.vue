<template>
  <div>
    <Toolbar>
      <template #start>
        <FloatLabel>
          <InputText id="word" type="text" v-model="newWord" @keyup.enter="onEnterNewWord" />
          <label for="word">New Word</label>
        </FloatLabel>
        <Button v-tooltip2.top="'Speak'" v-show="settingsService.selectedVoice" @click="settingsService.speak(newWord)"><font-awesome-icon icon="fa-volume-up"/></Button>
        <Select :options="settingsService.wordFilterTypes" optionLabel="label" optionValue="value" v-model="filterType" @change="onRefresh" />
        <FloatLabel>
          <InputText id="filter" type="text" v-model="filter" @keyup.enter="onRefresh" />
          <label for="filter">Filter</label>
        </FloatLabel>
        <Button @click.stop="showDetailDialog(0)"><font-awesome-icon icon="fa-plus"/>Add</Button>
        <Button @click="onRefresh()"><font-awesome-icon icon="fa-refresh"/>Refresh</Button>
        <Button v-show="settingsService.selectedDictNote" label="Retrieve All Notes" severity="warn" />
        <Button v-show="settingsService.selectedDictNote" label="Retrieve Notes If Empty" severity="warn" />
<!--        <router-link to="/words-dict/unit/0">-->
          <Button><font-awesome-icon icon="fa-book"/>Dictionary</Button>
<!--        </router-link>-->
      </template>
    </Toolbar>
    <DataTable
      :value="wordsUnitService.unitWords"
      @row-reorder="onReorder"
    >
      <Column :rowReorder="settingsService.textbooks.length && settingsService.isSingleUnitPart && !filter" headerStyle="width: 3rem" />
      <Column headerStyle="width: 80px" field="ID" header="ID" />
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
          <Button v-tooltip2.top="'Edit'" @click.stop="showDetailDialog(slotProps.data.ID)"><font-awesome-icon icon="fa-edit"/></Button>
          <Button v-tooltip2.top="'Speak'" @click="settingsService.speak(slotProps.data.WORD)"><font-awesome-icon icon="fa-volume-up"/></Button>
          <Button v-tooltip2.top="'Copy'" v-clipboard:copy="slotProps.data.WORD"><font-awesome-icon icon="fa-copy"/></Button>
          <Button v-tooltip2.top="'Google Word'" @click="googleWord(slotProps.data.WORD)"><font-awesome-icon icon="fa-brands fa-google"/></Button>
<!--          <router-link :to="{ name: 'words-dict', params: { type: 'unit', index: slotProps.index }}">-->
            <Button v-tooltip2.top="'Dictionary'"><font-awesome-icon icon="fa-book"/></Button>
<!--          </router-link>-->
          <Button v-show="settingsService.selectedDictNote" label="Retrieve Note" severity="warn" @click="getNote(slotProps.index)" />
        </template>
      </Column>
    </DataTable>
    <WordsUnitDetail5 v-if="showDetail" v-model="showDetail" :id="detailId"></WordsUnitDetail5>
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
  import WordsUnitDetail5 from '@/components/primevue/WordsUnitDetail5'

  const appService = ref(container.resolve(AppService));
  const wordsUnitService = ref(container.resolve(WordsUnitService));
  const settingsService = ref(container.resolve(SettingsService));
  const showDetail = ref(false);
  const detailId = ref(0);

  const newWord = ref('');
  const filter = ref('');
  const filterType = ref(0);

  const onRefresh = async () => {
    await wordsUnitService.value.getDataInTextbook(filter.value, filterType.value);
  };

  (async () => {
    await appService.value.getData();
    onRefresh();
  })();

  const onReorder = ({dragIndex, dropIndex}: any) => {
    console.log('reorder', dragIndex, dropIndex);
    const movedItem = wordsUnitService.value.unitWords.splice(dragIndex, 1)[0];
    wordsUnitService.value.unitWords.splice(dropIndex, 0, movedItem);
    wordsUnitService.value.reindex(index => {});
  };

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

  const getNote = async (index: number) => {
    console.log(index);
    await wordsUnitService.value.getNote(index);
  };

  const googleWord = (word: string) => {
    googleString(word);
  };

  const getNotes = (ifEmpty: boolean) => {
    wordsUnitService.value.getNotes(ifEmpty, () => {}, () => {});
  };

  const showDetailDialog = (id: number) => {
    detailId.value = id;
    showDetail.value = true;
  };
</script>

<style>
  /*@import '../../assets/common.css';*/
</style>
