<template>
  <div>
    <el-row>
      <el-col :span="4">
        <el-input placeholder="New Word" v-model="newWord" @keyup.enter="onEnter"></el-input>
      </el-col>
      <el-tooltip content="Speak">
        <el-button v-show="settingsService.selectedVoice" circle type="primary" icon="fa fa-volume-up"
                   @click="settingsService.speak(newWord)"></el-button>
      </el-tooltip>
      <router-link to="/words-lang-detail/0">
        <el-button type="primary" icon="fa fa-plus">Add</el-button>
      </router-link>
      <el-button type="primary" icon="fa fa-refresh" @click="onRefresh()">Refresh</el-button>
      <router-link to="/words-dict/lang/0">
        <el-button type="primary" icon="fa fa-book">Dictionary</el-button>
      </router-link>
    </el-row>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="page"
        :page-sizes="settingsService.USROWSPERPAGEOPTIONS"
        :page-size="rows"
        layout="total, sizes, prev, pager, next, jumper"
        :total="wordsLangService.langWordsCount">
      </el-pagination>
    </div>
    <el-table
      :data="wordsLangService.langWords"
      :row-style="({row}) => row.colorStyle"
      style="width: 100%"
    >
      <el-table-column prop="ID" label="ID"></el-table-column>
      <el-table-column prop="WORD" label="WORD"></el-table-column>
      <el-table-column prop="NOTE" label="NOTE"></el-table-column>
      <el-table-column prop="LEVEL" label="LEVEL"></el-table-column>
      <el-table-column prop="ACCURACY" label="ACCURACY"></el-table-column>
      <el-table-column label="ACTIONS" width="500">
        <template slot-scope="scope">
          <el-tooltip content="Delete">
            <el-button circle type="danger" icon="fa fa-trash" @click="deleteWord(scope.row.ID)"></el-button>
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
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="page"
        :page-sizes="settingsService.USROWSPERPAGEOPTIONS"
        :page-size="rows"
        layout="total, sizes, prev, pager, next, jumper"
        :total="wordsLangService.langWordsCount">
      </el-pagination>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { inject } from 'vue-typescript-inject';
  import { SettingsService } from '@/view-models/settings.service';
  import { googleString } from '@/common/common';
  import { WordsLangService } from '@/view-models/words-lang.service';
  import { MLangWord } from '@/models/lang-word';

  @Component
  export default class WordsLang4 extends Vue {
    @inject() wordsLangService!: WordsLangService;
    @inject() settingsService!: SettingsService;

    newWord = '';
    page = 1;
    rows = this.settingsService.USROWSPERPAGE;

    services = {};
    created() {
      this.$set(this.services, 'wordsLangService', this.wordsLangService);
      this.onRefresh();
    }

    handleSizeChange(val) {
      this.rows = val;
      this.onRefresh();
    }

    handleCurrentChange(val) {
      this.page = val;
      this.onRefresh();
    }

    onEnter() {
      if (!this.newWord) return;
      const o = this.wordsLangService.newLangWord();
      o.WORD = this.settingsService.autoCorrectInput(this.newWord);
      this.newWord = '';
      this.wordsLangService.create(o).subscribe(id => {
        o.ID = id as number;
        this.wordsLangService.langWords.push(o);
      });
    }

    onRefresh() {
      this.wordsLangService.getData(this.page, this.rows).subscribe(_ => {
        this.$forceUpdate();
      });
    }

    deleteWord(id: number) {
      this.wordsLangService.delete(id);
    }

    getNote(index: number) {
      console.log(index);
      this.wordsLangService.getNote(index).subscribe();
    }

    googleWord(word: string) {
      googleString(word);
    }

    updateLevel(item: MLangWord, delta: number) {
      this.settingsService.updateLevel(item, item.ID, delta).subscribe();
    }
  }
</script>

<style scoped>
</style>
