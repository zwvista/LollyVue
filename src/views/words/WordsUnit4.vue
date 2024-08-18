<template>
  <div>
    <el-row>
      <el-col :span="4">
        <el-input placeholder="New Word" v-model="newWord" @keyup.enter="onEnterNewWord">
          <el-tooltip slot="append" content="Speak">
            <el-button v-show="settingsService.selectedVoice" circle type="primary" icon="fa fa-volume-up"
                       @click="settingsService.speak(newWord)"></el-button>
          </el-tooltip>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-input placeholder="Filter" v-model="filter" @input="onRefresh" class="input-with-select">
          <el-select v-model="filterType" slot="prepend" @change="onRefresh">
            <el-option
              v-for="item in settingsService.wordFilterTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-input>
      </el-col>
      <router-link to="/words-unit-detail/0">
        <el-button type="primary" icon="fa fa-plus">Add</el-button>
      </router-link>
      <el-button type="primary" icon="fa fa-refresh" @click="onRefresh()">Refresh</el-button>
      <el-button v-show="settingsService.selectedDictNote" type="warning" @click="getNotes(false)">Get All Notes</el-button>
      <el-button v-show="settingsService.selectedDictNote" type="warning" @click="getNotes(true)">Get Notes If Empty</el-button>
      <el-button v-show="settingsService.selectedDictNote" type="warning" @click="clearNotes(false)">Clear All Notes</el-button>
      <el-button v-show="settingsService.selectedDictNote" type="warning" @click="clearNotes(true)">Clear Notes If Empty</el-button>
      <router-link to="/words-dict/unit/0">
        <el-button type="primary" icon="fa fa-book">Dictionary</el-button>
      </router-link>
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
        <template slot-scope="scope">
          <el-tooltip content="Delete">
            <el-button circle type="danger" icon="fa fa-trash" @click="deleteWord(scope.row)"></el-button>
          </el-tooltip>
          <router-link :to="{ name: 'words-unit-detail', params: { id: scope.row.ID }}">
            <el-tooltip content="Edit">
              <el-button circle type="primary" icon="fa fa-edit"></el-button>
            </el-tooltip>
          </router-link>
          <el-tooltip content="Speak">
            <el-button v-show="settingsService.selectedVoice" circle type="primary" icon="fa fa-volume-up"
                 @click="settingsService.speak(scope.row.WORD)"></el-button>
          </el-tooltip>
          <el-tooltip content="Copy">
            <el-button circle type="primary" icon="fa fa-copy" v-clipboard:copy="scope.row.WORD"></el-button>
          </el-tooltip>
          <el-tooltip content="Google Word">
            <el-button circle type="primary" icon="fa fa-google" @click="googleWord(scope.row.WORD)"></el-button>
          </el-tooltip>
          <router-link :to="{ name: 'words-dict', params: { type: 'unit', index: scope.$index }}">
            <el-tooltip content="Dictionary">
              <el-button circle type="primary" icon="fa fa-book"></el-button>
            </el-tooltip>
          </router-link>
          <el-button v-show="settingsService.selectedDictNote" type="warning"
                 @click="getNote(scope.row)">Get Note</el-button>
          <el-button v-show="settingsService.selectedDictNote" type="warning"
                 @click="clearNote(scope.row)">Clear Note</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { WordsUnitService } from '@/view-models/wpp/words-unit.service';
  import { SettingsService } from '@/view-models/misc/settings.service';
  import { googleString } from '@/common/common';
  import { MUnitWord } from '@/models/wpp/unit-word';
  import { AppService } from '@/view-models/misc/app.service';
  import { container } from 'tsyringe';

  @Component
  export default class WordsUnit4 extends Vue {
    appService = container.resolve(AppService);
    wordsUnitService = container.resolve(WordsUnitService);
    settingsService = container.resolve(SettingsService);

    newWord = '';
    filter = '';
    filterType = 0;

    services = {};
    async created() {
      this.$set(this.services, 'wordsUnitService', this.wordsUnitService);
      await this.appService.getData();
      await this.onRefresh();
    }

    async onEnterNewWord() {
      if (!this.newWord) return;
      const o = this.wordsUnitService.newUnitWord();
      o.WORD = this.settingsService.autoCorrectInput(this.newWord);
      this.newWord = '';
      const id = await this.wordsUnitService.create(o);
      o.ID = id as number;
      this.wordsUnitService.unitWords.push(o);
    }

    async onRefresh() {
      await this.wordsUnitService.getDataInTextbook(this.filter, this.filterType);
    }

    async deleteWord(item: MUnitWord) {
      await this.wordsUnitService.delete(item);
    }

    async getNote(item: MUnitWord) {
      await this.wordsUnitService.getNote(item);
    }

    async clearNote(item: MUnitWord) {
      await this.wordsUnitService.clearNote(item);
    }

    googleWord(word: string) {
      googleString(word);
    }

    getNotes(ifEmpty: boolean) {
      this.wordsUnitService.getNotes(ifEmpty, () => {}, () => {});
    }

    clearNotes(ifEmpty: boolean) {
      this.wordsUnitService.clearNotes(ifEmpty, () => {}, () => {});
    }
  }
</script>

<style scoped>
  @import '../../assets/common.css';
</style>
