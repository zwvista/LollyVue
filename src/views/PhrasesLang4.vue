<template>
  <div>
    <el-row>
      <el-col :span="4">
        <el-input placeholder="Filter" v-model="filter" @input="onRefresh" class="input-with-select">
          <el-select v-model="filterType" slot="prepend" @change="onRefresh">
            <el-option
              v-for="item in settingsService.phraseFilterTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-input>
      </el-col>
      <router-link to="/phrases-lang-detail/0">
        <el-button type="primary" icon="fa fa-plus">Add</el-button>
      </router-link>
      <el-button type="primary" icon="fa fa-refresh" @click="onRefresh()">Refresh</el-button>
      <router-link to="/phrases-dict/lang/0">
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
        :total="phrasesLangService.langPhraseCount">
      </el-pagination>
    </div>
    <el-table
      :data="phrasesLangService.langPhrases"
      :row-style="({row}) => row.colorStyle"
      style="width: 100%"
    >
      <el-table-column prop="ID" label="ID"></el-table-column>
      <el-table-column prop="PHRASE" label="PHRASE"></el-table-column>
      <el-table-column prop="TRANSLATION" label="TRANSLATION"></el-table-column>
      <el-table-column label="ACTIONS" width="300">
        <template slot-scope="scope">
          <el-tooltip content="Delete">
            <el-button circle type="danger" icon="fa fa-trash" @click="deletePhrase(scope.row)"></el-button>
          </el-tooltip>
          <router-link :to="{ name: 'phrases-lang-detail', params: { id: scope.row.ID }}">
            <el-tooltip content="Edit">
              <el-button circle type="primary" icon="fa fa-edit"></el-button>
            </el-tooltip>
          </router-link>
          <el-tooltip content="Speak">
            <el-button v-show="settingsService.selectedVoice" circle type="primary" icon="fa fa-volume-up"
                 @click="settingsService.speak(scope.row.PHRASE)"></el-button>
          </el-tooltip>
          <el-tooltip content="Copy">
            <el-button circle type="primary" icon="fa fa-copy" v-clipboard:copy="scope.row.PHRASE"></el-button>
          </el-tooltip>
          <el-tooltip content="Google Phrase">
            <el-button circle type="primary" icon="fa fa-google" @click="googlePhrase(scope.row.PHRASE)"></el-button>
          </el-tooltip>
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
        :total="phrasesLangService.langPhraseCount">
      </el-pagination>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { inject } from 'vue-typescript-inject';
  import { SettingsService } from '@/view-models/settings.service';
  import { googleString } from '@/common/common';
  import { PhrasesLangService } from '@/view-models/phrases-lang.service';
  import { AppService } from '@/view-models/app.service';
  import { MLangPhrase } from '@/models/misc/lang-phrase';

  @Component
  export default class PhrasesLang4 extends Vue {
    @inject() appService!: AppService;
    @inject() phrasesLangService!: PhrasesLangService;
    @inject() settingsService!: SettingsService;

    page = 1;
    rows = 0;
    filter = '';
    filterType = 0;

    services = {};
    created() {
      this.$set(this.services, 'phrasesLangService', this.phrasesLangService);
      this.appService.initializeObject.subscribe(_ => {
        this.rows = this.settingsService.USROWSPERPAGE;
        this.onRefresh();
      });
    }

    handleSizeChange(val) {
      this.rows = val;
      this.onRefresh();
    }

    handleCurrentChange(val) {
      this.page = val;
      this.onRefresh();
    }

    onRefresh() {
      this.phrasesLangService.getData(this.page, this.rows, this.filter, this.filterType).subscribe(_ => {
        this.$forceUpdate();
      });
    }

    deletePhrase(item: MLangPhrase) {
      this.phrasesLangService.delete(item);
    }

    googlePhrase(phrase: string) {
      googleString(phrase);
    }
  }
</script>

<style scoped>
  @import '../assets/common.css';
</style>
