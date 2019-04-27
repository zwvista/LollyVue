<template>
  <div>
    <el-row>
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
            <el-button circle type="danger" icon="fa fa-trash" @click="deletePhrase(scope.row.ID)"></el-button>
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

  @Component
  export default class PhrasesLang4 extends Vue {
    @inject() phrasesLangService!: PhrasesLangService;
    @inject() settingsService!: SettingsService;

    page = 1;
    rows = this.settingsService.USROWSPERPAGE;

    services = {};
    created() {
      this.$set(this.services, 'phrasesLangService', this.phrasesLangService);
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

    onRefresh() {
      this.phrasesLangService.getData(this.page, this.rows).subscribe(_ => {
        this.$forceUpdate();
      });
    }

    deletePhrase(id: number) {
      this.phrasesLangService.delete(id);
    }

    googlePhrase(phrase: string) {
      googleString(phrase);
    }
  }
</script>

<style scoped>
</style>
