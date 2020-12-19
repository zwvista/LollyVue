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
      <router-link to="/phrases-unit-detail/0">
        <el-button type="primary" icon="fa fa-plus">Add</el-button>
      </router-link>
      <el-button type="primary" icon="fa fa-refresh" @click="onRefresh()">Refresh</el-button>
    </el-row>
    <el-table
      :data="phrasesUnitService.unitPhrases"
      :row-style="({row}) => row.colorStyle"
      style="width: 100%"
    >
      <el-table-column prop="ID" label="ID"></el-table-column>
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
          <router-link :to="{ name: 'phrases-unit-detail', params: { id: scope.row.ID }}">
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
  import { SettingsService } from '@/view-models/settings.service';
  import { googleString } from '@/common/common';
  import { MUnitPhrase } from '@/models/wpp/unit-phrase';
  import { PhrasesUnitService } from '@/view-models/phrases-unit.service';
  import { AppService } from '@/view-models/app.service';

  @Component
  export default class PhrasesUnit4 extends Vue {
    @inject() appService!: AppService;
    @inject() phrasesUnitService!: PhrasesUnitService;
    @inject() settingsService!: SettingsService;

    filter = '';
    filterType = 0;

    services = {};
    created() {
      this.$set(this.services, 'phrasesUnitService', this.phrasesUnitService);
      this.appService.initializeObject.subscribe(_ => {
        this.onRefresh();
      });
    }

    onRefresh() {
      this.phrasesUnitService.getDataInTextbook(this.filter, this.filterType).subscribe();
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
  @import '../assets/common.css';
</style>
