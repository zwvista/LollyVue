<template>
  <div>
    <el-row>
      <el-col :span="4">
        <el-input placeholder="New Word" v-model="newWord" @keyup.enter="onEnterNewWord">
          <template #append>
            <el-tooltip content="Speak">
              <el-button v-show="settingsService.selectedVoice" circle type="primary" @click="settingsService.speak(newWord)">
                <template #icon><font-awesome-icon icon="fa-volume-up" /></template>
              </el-button>
            </el-tooltip>
          </template>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-input placeholder="Filter" v-model="filter" @input="onRefresh">
          <template #prepend>
            <el-select value-key="value" v-model="filterType" @change="onRefresh" style="width: 100px">
              <el-option v-for="item in settingsService.wordFilterTypes" :label="item.label" :value="item.value" />
            </el-select>
          </template>
        </el-input>
      </el-col>
      <el-button type="primary" @click.stop="showDetailDialog(0)">Add
        <template #icon><font-awesome-icon icon="fa-plus" /></template>
      </el-button>
      <el-button type="primary" @click="onRefresh()">Refresh
        <template #icon><font-awesome-icon icon="fa-refresh" /></template>
      </el-button>
      <el-button v-show="settingsService.selectedDictNote" type="warning" @click="getNotes(false)">Get All Notes</el-button>
      <el-button v-show="settingsService.selectedDictNote" type="warning" @click="getNotes(true)">Get Notes If Empty</el-button>
      <el-button v-show="settingsService.selectedDictNote" type="warning" @click="clearNotes(false)">Clear All Notes</el-button>
      <el-button v-show="settingsService.selectedDictNote" type="warning" @click="clearNotes(true)">Clear Notes If Empty</el-button>
<!--      <router-link to="/words-dict/unit/0">-->
        <el-button type="primary">Dictionary
          <template #icon><font-awesome-icon icon="fa-book" /></template>
        </el-button>
<!--      </router-link>-->
    </el-row>
    <el-table
      :data="wordsUnitService.unitWords"
      :row-style="({row}) => row.colorStyle"
      style="width: 100%"
    >
      <el-table-column prop="ID" label="ID"></el-table-column>
      <el-table-column prop="UNITSTR" label="UNIT"></el-table-column>
      <el-table-column prop="PARTSTR" label="PART"></el-table-column>
      <el-table-column prop="SEQNUM" label="SEQNUM"></el-table-column>
      <el-table-column prop="WORDID" label="WORDID"></el-table-column>
      <el-table-column prop="WORD" label="WORD"></el-table-column>
      <el-table-column prop="NOTE" label="NOTE"></el-table-column>
      <el-table-column prop="ACCURACY" label="ACCURACY"></el-table-column>
      <el-table-column label="ACTIONS" width="500">
        <template #default="scope">
          <el-tooltip content="Delete">
            <el-button circle type="danger" @click="deleteWord(scope.row)">
              <template #icon><font-awesome-icon icon="fa-trash" /></template>
            </el-button>
          </el-tooltip>
          <el-tooltip content="Edit">
            <el-button circle type="primary" @click.stop="showDetailDialog(scope.row.ID)">
              <template #icon><font-awesome-icon icon="fa-edit" /></template>
            </el-button>
          </el-tooltip>
          <el-tooltip content="Speak">
            <el-button v-show="settingsService.selectedVoice" circle type="primary"
                 @click="settingsService.speak(scope.row.WORD)">
              <template #icon><font-awesome-icon icon="fa-volume-up" /></template>
            </el-button>
          </el-tooltip>
          <el-tooltip content="Copy">
            <el-button circle type="primary" v-clipboard:copy="scope.row.WORD">
              <template #icon><font-awesome-icon icon="fa-copy" /></template>
            </el-button>
          </el-tooltip>
          <el-tooltip content="Google Word">
            <el-button circle type="primary" @click="googleWord(scope.row.WORD)">
              <template #icon><font-awesome-icon icon="fa-brands fa-google" /></template>
            </el-button>
          </el-tooltip>
<!--          <router-link :to="{ name: 'words-dict', params: { type: 'unit', index: scope.$index }}">-->
            <el-tooltip content="Dictionary">
              <el-button circle type="primary">
                <template #icon><font-awesome-icon icon="fa-book" /></template>
              </el-button>
            </el-tooltip>
<!--          </router-link>-->
          <el-button v-show="settingsService.selectedDictNote" type="warning"
                 @click="getNote(scope.row)">Get Note</el-button>
          <el-button v-show="settingsService.selectedDictNote" type="warning"
                 @click="clearNote(scope.row)">Clear Note</el-button>
        </template>
      </el-table-column>
    </el-table>
    <WordsUnitDetail4 v-if="showDetail" v-model="showDetail" :id="detailId"></WordsUnitDetail4>
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
  import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
  import WordsUnitDetail4 from '@/components/element/WordsUnitDetail4.vue'

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
  /*@import '../../assets/common.css';*/
</style>
