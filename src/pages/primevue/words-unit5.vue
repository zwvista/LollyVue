<template>
  <div>
    <Toolbar>
      <template #start>
        <FloatLabel>
          <InputText id="word" type="text" v-model="wordsUnitService.newWord" @keyup.enter="onEnterNewWord" />
          <label for="word">New Word</label>
        </FloatLabel>
        <Button rounded v-tooltip2.top="'Speak'" v-show="settingsService.selectedVoice" @click="settingsService.speak(wordsUnitService.newWord)"><font-awesome-icon icon="fa-volume-up"/></Button>
        <Select :options="settingsService.wordFilterTypes" optionLabel="label" optionValue="value" v-model="wordsUnitService.filterType" @change="onRefresh" />
        <FloatLabel>
          <InputText id="filter" type="text" v-model="wordsUnitService.filter" @keyup.enter="onRefresh" />
          <label for="filter">Filter</label>
        </FloatLabel>
        <Button rounded @click.stop="showDetailDialog(0)"><font-awesome-icon icon="fa-plus"/>Add</Button>
        <Button rounded @click="onRefresh()"><font-awesome-icon icon="fa-refresh"/>Refresh</Button>
        <div class="flex items-center gap-2">
          <Checkbox v-model="wordsUnitService.ifEmpty" binary inputId="ifEmpty" />
          <label for="ifEmpty">If Empty</label>
        </div>
        <Button rounded v-show="settingsService.selectedDictNote" label="Get Notes" severity="warn" @click="getNotes()" />
        <Button rounded v-show="settingsService.selectedDictNote" label="Clear Notes" severity="warn" @click="clearNotes()" />
<!--        <router-link to="/words-dict/unit/0">-->
          <Button rounded><font-awesome-icon icon="fa-book"/>Dictionary</Button>
<!--        </router-link>-->
      </template>
    </Toolbar>
    <DataTable
      :value="wordsUnitService.unitWords"
      @row-reorder="onReorder"
    >
      <Column :rowReorder="settingsService.textbooks.length && settingsService.isSingleUnitPart && !wordsUnitService.filter" headerStyle="width: 3rem" />
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
          <Button rounded v-tooltip2.top="'Delete'" severity="danger" @click="deleteWord(slotProps.data)"><font-awesome-icon icon="fa-trash"/></Button>
          <Button rounded v-tooltip2.top="'Edit'" @click.stop="showDetailDialog(slotProps.data.ID)"><font-awesome-icon icon="fa-edit"/></Button>
          <Button rounded v-tooltip2.top="'Speak'" @click="settingsService.speak(slotProps.data.WORD)"><font-awesome-icon icon="fa-volume-up"/></Button>
          <Button rounded v-tooltip2.top="'Copy'" v-clipboard:copy="slotProps.data.WORD"><font-awesome-icon icon="fa-copy"/></Button>
          <Button rounded v-tooltip2.top="'Google Word'" @click="googleWord(slotProps.data.WORD)"><font-awesome-icon icon="fa-brands fa-google"/></Button>
<!--          <router-link :to="{ name: 'words-dict', params: { type: 'unit', index: slotProps.index }}">-->
            <Button rounded v-tooltip2.top="'Dictionary'"><font-awesome-icon icon="fa-book"/></Button>
<!--          </router-link>-->
          <Button rounded v-show="settingsService.selectedDictNote" label="Get Note" severity="warn" @click="getNote(slotProps.data)" />
          <Button rounded v-show="settingsService.selectedDictNote" label="Clear Note" severity="warn" @click="clearNote(slotProps.data)" />
        </template>
      </Column>
    </DataTable>
    <WordsUnitDetail5 v-if="showDetail" v-model="showDetail" :id="detailId"></WordsUnitDetail5>
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
  import WordsUnitDetail5 from '@/components/primevue/WordsUnitDetail5.vue'

  const appService = ref(container.resolve(AppService));
  const wordsUnitService = ref(container.resolve(WordsUnitService));
  const settingsService = ref(container.resolve(SettingsService));
  const showDetail = ref(false);
  const detailId = ref(0);

  const onRefresh = async () => {
    await wordsUnitService.value.getDataInTextbook();
  };

  (async () => {
    await appService.value.getData();
    await onRefresh();
  })();

  const onReorder = ({dragIndex, dropIndex}: any) => {
    console.log('reorder', dragIndex, dropIndex);
    const movedItem = wordsUnitService.value.unitWords.splice(dragIndex, 1)[0];
    wordsUnitService.value.unitWords.splice(dropIndex, 0, movedItem);
    wordsUnitService.value.reindex(index => {});
  };

  const onEnterNewWord = async () => {
    await wordsUnitService.value.createWithNewWord();
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

  const getNotes = () => {
    wordsUnitService.value.getNotes(() => {}, () => {});
  };

  const clearNotes = () => {
    wordsUnitService.value.clearNotes(() => {}, () => {});
  };

  const showDetailDialog = (id: number) => {
    detailId.value = id;
    showDetail.value = true;
  };
</script>

<style>
  /*@import '../../assets/common.css';*/
</style>
