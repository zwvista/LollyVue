<template>
  <div>
    <div class="text-xs-center">
      <v-pagination
        v-model="page"
        :length="pageCount"
        @input="pageChange"
      ></v-pagination>
    </div>
    <md-table v-model="phrasesUnitService.textbookPhrases">
      <md-table-toolbar>
        <md-button class="md-raised md-primary" @click="onRefresh()">
          <span><md-icon class="fa fa-refresh"></md-icon>Refresh</span>
        </md-button>
      </md-table-toolbar>
      <md-table-row slot="md-table-row" slot-scope="{item}" :style="item.colorStyle">
        <md-table-cell md-label="ID">{{item.ID}}</md-table-cell>
        <md-table-cell md-label="TEXTBOOKNAME">{{item.TEXTBOOKNAME}}</md-table-cell>
        <md-table-cell md-label="UNIT">{{item.UNITSTR}}</md-table-cell>
        <md-table-cell md-label="PART">{{item.PARTSTR}}</md-table-cell>
        <md-table-cell md-label="SEQNUM">{{item.SEQNUM}}</md-table-cell>
        <md-table-cell md-label="PHRASEID">{{item.PHRASEID}}</md-table-cell>
        <md-table-cell md-label="PHRASE">{{item.PHRASE}}</md-table-cell>
        <md-table-cell md-label="TRANSLATION">{{item.TRANSLATION}}</md-table-cell>
        <md-table-cell md-label="ACTIONS">
          <md-button class="md-raised md-icon-button md-accent" @click="deletePhrase(item)">
            <md-icon class="fa fa-trash"></md-icon>
            <md-tooltip>Delete</md-tooltip>
          </md-button>
          <router-link :to="{ name: 'phrases-textbook-detail', params: { id: item.ID }}">
            <md-button class="md-raised md-icon-button md-primary">
              <md-icon class="fa fa-edit"></md-icon>
              <md-tooltip>Edit</md-tooltip>
            </md-button>
          </router-link>
          <md-button class="md-raised md-icon-button md-primary" @click="settingsService.speak(item.PHRASE)">
            <md-icon class="fa fa-volume-up"></md-icon>
            <md-tooltip>Speak</md-tooltip>
          </md-button>
          <md-button class="md-raised md-icon-button md-primary" v-clipboard:copy="item.PHRASE">
            <md-icon class="fa fa-copy"></md-icon>
            <md-tooltip>Copy</md-tooltip>
          </md-button>
          <md-button class="md-raised md-icon-button md-primary" @click="googlePhrase(item.PHRASE)">
            <md-icon class="fa fa-google"></md-icon>
            <md-tooltip>Google Phrase</md-tooltip>
          </md-button>
        </md-table-cell>
      </md-table-row>
    </md-table>
    <div class="text-xs-center">
      <v-pagination
        v-model="page"
        :length="pageCount"
        @input="pageChange"
      ></v-pagination>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { inject } from 'vue-typescript-inject';
  import { SettingsService } from '@/view-models/settings.service';
  import { googleString } from '@/common/common';
  import { PhrasesUnitService } from '@/view-models/phrases-unit.service';
  import { MUnitPhrase } from '@/models/unit-phrase';

  @Component
  export default class PhrasesTextbook3 extends Vue {
    @inject() phrasesUnitService!: PhrasesUnitService;
    @inject() settingsService!: SettingsService;

    page = 1;
    pageCount = 1;
    rows = this.settingsService.USROWSPERPAGE;

    services = {};
    created() {
      this.$set(this.services, 'phrasesUnitService', this.phrasesUnitService);
      this.onRefresh();
    }

    pageChange(page: number) {
      this.page = page;
      this.onRefresh();
    }

    onRefresh() {
      this.phrasesUnitService.getDataInLang(this.page, this.rows).subscribe(_ => {
        this.pageCount = (this.phrasesUnitService.textbookPhraseCount + this.rows - 1) / this.rows >> 0;
        this.$forceUpdate();
      });
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
</style>
