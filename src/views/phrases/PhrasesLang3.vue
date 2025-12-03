<template>
  <div>
    <div class="text-xs-center">
      <md-table-pagination
        :md-page-size="phrasesLangService.rows"
        :md-page-options="settingsService.USROWSPERPAGEOPTIONS"
        :md-update="updatePagination"
        :md-data="{mdCount: phrasesLangService.langPhraseCount, mdPage: phrasesLangService.page, mdData: phrasesLangService.langPhrases}"
      ></md-table-pagination>
    </div>
    <md-table v-model="phrasesLangService.langPhrases">
      <md-table-toolbar>
        <div class="md-layout md-gutter">
          <div class="md-layout-item">
            <md-field>
              <md-select v-model="phrasesLangService.filterType" @md-selected="onRefresh">
                <md-option v-for="o in settingsService.phraseFilterTypes" :value="o.value">{{o.label}}</md-option>
              </md-select>
            </md-field>
          </div>
        </div>
        <div class="md-layout md-gutter">
          <div class="md-layout-item">
            <md-field>
              <label>Filter</label>
              <md-input v-model="phrasesLangService.filter" @keyup.enter="onRefresh"></md-input>
            </md-field>
          </div>
        </div>
        <router-link to="/phrases-unit-detail/0">
          <md-button class="md-raised md-primary">
            <span><md-icon class="fa fa-plus"></md-icon>Add</span>
          </md-button>
        </router-link>
        <md-button class="md-raised md-primary" @click="onRefresh()">
          <span><md-icon class="fa fa-refresh"></md-icon>Refresh</span>
        </md-button>
      </md-table-toolbar>
      <md-table-row slot="md-table-row" slot-scope="{item}" :style="item.colorStyle">
        <md-table-cell md-label="ID">{{item.ID}}</md-table-cell>
        <md-table-cell md-label="PHRASE">{{item.PHRASE}}</md-table-cell>
        <md-table-cell md-label="TRANSLATION">{{item.TRANSLATION}}</md-table-cell>
        <md-table-cell md-label="ACTIONS">
          <md-button class="md-raised md-icon-button md-accent" @click="deletePhrase(item)">
            <md-icon class="fa fa-trash"></md-icon>
            <md-tooltip>Delete</md-tooltip>
          </md-button>
          <router-link :to="{ name: 'phrases-lang-detail', params: { id: item.ID }}">
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
      <md-table-pagination
        :md-page-size="phrasesLangService.rows"
        :md-page-options="settingsService.USROWSPERPAGEOPTIONS"
        :md-update="updatePagination"
        :md-data="{mdCount: phrasesLangService.langPhraseCount, mdPage: phrasesLangService.page, mdData: phrasesLangService.langPhrases}"
      ></md-table-pagination>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { SettingsService } from '@/shared/view-models/misc/settings.service';
  import { googleString } from '@/shared/common/common';
  import { MUnitPhrase } from '@/shared/models/wpp/unit-phrase';
  import { PhrasesLangService } from '@/shared/view-models/wpp/phrases-lang.service';
  import { AppService } from '@/shared/view-models/misc/app.service';
  import { MLangPhrase } from '@/shared/models/wpp/lang-phrase';
  import { container } from 'tsyringe';

  @Component
  export default class PhrasesLang3 extends Vue {
    appService = container.resolve(AppService);
    phrasesLangService = container.resolve(PhrasesLangService);
    settingsService = container.resolve(SettingsService);

    services = {};
    async created() {
      this.$set(this.services, 'phrasesLangService', this.phrasesLangService);
      await this.appService.getData();
      this.phrasesLangService.rows = this.settingsService.USROWSPERPAGE;
      await this.onRefresh();
    }

    async updatePagination(page, pageSize, sort, sortOrder) {
      console.log('pagination has updated', page, pageSize, sort, sortOrder);
      this.phrasesLangService.page = page;
      this.phrasesLangService.rows = pageSize;
      await this.onRefresh();
    }

    async onRefresh() {
      await this.phrasesLangService.getData();
      this.$forceUpdate();
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
</style>
