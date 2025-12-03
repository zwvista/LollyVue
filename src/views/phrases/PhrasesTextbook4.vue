<template>
  <div>
    <el-row>
      <el-col :span="4">
        <el-input placeholder="Filter" v-model="phrasesUnitService.filter" @input="onRefresh" class="input-with-select">
          <el-select v-model="phrasesUnitService.filterType" slot="prepend" @change="onRefresh">
            <el-option
              v-for="item in settingsService.phraseFilterTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-input>
      </el-col>
      <el-select v-model="phrasesUnitService.textbookFilter" @change="onRefresh">
        <el-option
          v-for="item in settingsService.textbookFilters"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button type="primary" icon="fa fa-refresh" @click="onRefresh()">Refresh</el-button>
    </el-row>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="phrasesUnitService.page"
        :page-sizes="settingsService.USROWSPERPAGEOPTIONS"
        :page-size="phrasesUnitService.rows"
        layout="total, sizes, prev, pager, next, jumper"
        :total="phrasesUnitService.textbookPhraseCount">
      </el-pagination>
    </div>
    <el-table
      :data="phrasesUnitService.textbookPhrases"
      :row-style="({row}) => row.colorStyle"
      style="width: 100%"
    >
      <el-table-column prop="ID" label="ID"></el-table-column>
      <el-table-column prop="TEXTBOOKNAME" label="TEXTBOOKNAME"></el-table-column>
      <el-table-column prop="UNITSTR" label="UNIT"></el-table-column>
      <el-table-column prop="PARTSTR" label="PART"></el-table-column>
      <el-table-column prop="SEQNUM" label="SEQNUM"></el-table-column>
      <el-table-column prop="PHRASEID" label="PHRASEID"></el-table-column>
      <el-table-column prop="PHRASE" label="PHRASE"></el-table-column>
      <el-table-column prop="TRANSLATION" label="TRANSLATION"></el-table-column>
      <el-table-column label="ACTIONS" width="300">
        <template slot-scope="scope">
          <el-tooltip content="Delete">
            <el-button circle type="danger" icon="fa fa-trash" @click="deletePhrase(scope.row)"></el-button>
          </el-tooltip>
          <router-link :to="{ name: 'phrases-textbook-detail', params: { id: scope.row.ID }}">
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
        :current-page.sync="phrasesUnitService.page"
        :page-sizes="settingsService.USROWSPERPAGEOPTIONS"
        :page-size="phrasesUnitService.rows"
        layout="total, sizes, prev, pager, next, jumper"
        :total="phrasesUnitService.textbookPhraseCount">
      </el-pagination>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { PhrasesUnitService } from '@/shared/view-models/wpp/phrases-unit.service';
  import { SettingsService } from '@/shared/view-models/misc/settings.service';
  import { googleString } from '@/shared/common/common';
  import { MUnitPhrase } from '@/shared/models/wpp/unit-phrase';
  import { AppService } from '@/shared/view-models/misc/app.service';
  import { container } from 'tsyringe';

  @Component
  export default class PhrasesTextbook4 extends Vue {
    appService = container.resolve(AppService);
    phrasesUnitService = container.resolve(PhrasesUnitService);
    settingsService = container.resolve(SettingsService);

    services = {};
    async created() {
      this.$set(this.services, 'phrasesUnitService', this.phrasesUnitService);
      await this.appService.getData();
      this.phrasesUnitService.rows = this.settingsService.USROWSPERPAGE;
      await this.onRefresh();
    }

    async handleSizeChange(val) {
      this.phrasesUnitService.rows = val;
      await this.onRefresh();
    }

    async handleCurrentChange(val) {
      this.phrasesUnitService.page = val;
      await this.onRefresh();
    }

    async onRefresh() {
      await this.phrasesUnitService.getDataInLang();
      this.$forceUpdate();
    }

    deletePhrase(item: MUnitPhrase) {
      this.phrasesUnitService.delete(item);
    }

    googlePhrase(phrase: string) {
      googleString(phrase);
    }
  }
</script>

<style scoped>
  @import '../../assets/common.css';
</style>
