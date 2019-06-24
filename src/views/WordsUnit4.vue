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
        <el-input placeholder="Filter" v-model="filter" @input="onEnterFilter" class="input-with-select">
          <el-select v-model="filterType" slot="prepend" @change="onEnterFilter">
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
      <el-button v-show="settingsService.selectedDictNote" type="warning">Retrieve All Notes</el-button>
      <el-button v-show="settingsService.selectedDictNote" type="warning">Retrieve Notes If Empty</el-button>
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
      <el-table-column prop="LEVEL" label="LEVEL"></el-table-column>
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
          <el-tooltip content="Level Up">
            <el-button circle type="warning" icon="fa fa-arrow-up" @click="updateLevel(scope.row, 1)"></el-button>
          </el-tooltip>
          <el-tooltip content="Level Down">
            <el-button circle type="warning" icon="fa fa-arrow-down" @click="updateLevel(scope.row, -1)"></el-button>
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
                 @click="getNote(scope.$index)">Retrieve Note</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { inject } from 'vue-typescript-inject';
  import { WordsUnitService } from '@/view-models/words-unit.service';
  import { SettingsService } from '@/view-models/settings.service';
  import { googleString } from '@/common/common';
  import { MUnitWord } from '@/models/unit-word';
  import { AppService } from '@/view-models/app.service';

  @Component
  export default class WordsUnit4 extends Vue {
    @inject() appService!: AppService;
    @inject() wordsUnitService!: WordsUnitService;
    @inject() settingsService!: SettingsService;

    newWord = '';
    filter = '';
    filterType = 0;

    services = {};
    created() {
      this.$set(this.services, 'wordsUnitService', this.wordsUnitService);
      this.appService.initializeComplete.subscribe(_ => {
        this.onRefresh();
      });
    }

    onEnterNewWord() {
      if (!this.newWord) return;
      const o = this.wordsUnitService.newUnitWord();
      o.WORD = this.settingsService.autoCorrectInput(this.newWord);
      this.newWord = '';
      this.wordsUnitService.create(o).subscribe(id => {
        o.ID = id as number;
        this.wordsUnitService.unitWords.push(o);
      });
    }

    onRefresh() {
      this.wordsUnitService.getDataInTextbook(this.filter, this.filterType).subscribe();
    }

    onEnterFilter() {
      if (this.filter && this.filterType === 0)
        this.filterType = 1;
      else if (!this.filter && this.filterType !== 0)
        this.filterType = 0;
      this.onRefresh();
    }

    deleteWord(item: MUnitWord) {
      this.wordsUnitService.delete(item);
    }

    getNote(index: number) {
      console.log(index);
      this.wordsUnitService.getNote(index).subscribe();
    }

    googleWord(word: string) {
      googleString(word);
    }

    getNotes(ifEmpty: boolean) {
      this.wordsUnitService.getNotes(ifEmpty, () => {}, () => {});
    }

    updateLevel(item: MUnitWord, delta: number) {
      this.settingsService.updateLevel(item, item.WORDID, delta).subscribe();
    }
  }
</script>

<style scoped>
</style>
