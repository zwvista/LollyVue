<template>
  <div>
    <div class="text-xs-center">
      <md-table-pagination
        :md-page-size="patternsService.rows"
        :md-page-options="settingsService.USROWSPERPAGEOPTIONS"
        :md-update="updatePagination"
        :md-data="{mdCount: patternsService.patternCount, mdPage: patternsService.page, mdData: patternsService.patterns}"
      ></md-table-pagination>
    </div>
    <md-table v-model="patternsService.patterns">
      <md-table-toolbar>
        <div class="md-layout md-gutter">
          <div class="md-layout-item">
            <md-field>
              <md-select v-model="patternsService.filterType" @md-selected="onRefresh">
                <md-option v-for="o in settingsService.patternFilterTypes" :value="o.value">{{o.label}}</md-option>
              </md-select>
            </md-field>
          </div>
        </div>
        <div class="md-layout md-gutter">
          <div class="md-layout-item">
            <md-field>
              <label>Filter</label>
              <md-input v-model="patternsService.filter" @keyup.enter="onRefresh"></md-input>
            </md-field>
          </div>
        </div>
        <router-link to="/patterns-detail/0">
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
        <md-table-cell md-label="PATTERN">{{item.PATTERN}}</md-table-cell>
        <md-table-cell md-label="TAGS">{{item.TAGS}}</md-table-cell>
        <md-table-cell md-label="TITLE">{{item.TITLE}}</md-table-cell>
        <md-table-cell md-label="URL">{{item.URL}}</md-table-cell>
        <md-table-cell md-label="ACTIONS">
          <md-button class="md-raised md-icon-button md-accent" @click="deletePattern(item.ID)">
            <md-icon class="fa fa-trash"></md-icon>
            <md-tooltip>Delete</md-tooltip>
          </md-button>
          <router-link :to="{ name: 'patterns-detail', params: { id: item.ID }}">
            <md-button class="md-raised md-icon-button md-primary">
              <md-icon class="fa fa-edit"></md-icon>
              <md-tooltip>Edit</md-tooltip>
            </md-button>
          </router-link>
          <md-button class="md-raised md-icon-button md-primary" @click="settingsService.speak(item.PATTERN)">
            <md-icon class="fa fa-volume-up"></md-icon>
            <md-tooltip>Speak</md-tooltip>
          </md-button>
          <md-button class="md-raised md-icon-button md-primary" v-clipboard:copy="item.PATTERN">
            <md-icon class="fa fa-copy"></md-icon>
            <md-tooltip>Copy</md-tooltip>
          </md-button>
          <md-button class="md-raised md-icon-button md-primary" @click="googlePattern(item.PATTERN)">
            <md-icon class="fa fa-google"></md-icon>
            <md-tooltip>Google Pattern</md-tooltip>
          </md-button>
        </md-table-cell>
      </md-table-row>
    </md-table>
    <div class="text-xs-center">
      <md-table-pagination
        :md-page-size="patternsService.rows"
        :md-page-options="settingsService.USROWSPERPAGEOPTIONS"
        :md-update="updatePagination"
        :md-data="{mdCount: patternsService.patternCount, mdPage: patternsService.page, mdData: patternsService.patterns}"
      ></md-table-pagination>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { SettingsService } from '@/shared/view-models/misc/settings.service';
  import { googleString } from '@/shared/common/common';
  import { AppService } from '@/shared/view-models/misc/app.service';
  import { PatternsService } from '@/shared/view-models/wpp/patterns.service';
  import { container } from 'tsyringe';

  @Component
  export default class Patterns3 extends Vue {
    appService = container.resolve(AppService);
    patternsService = container.resolve(PatternsService);
    settingsService = container.resolve(SettingsService);

    services = {};
    async created() {
      this.$set(this.services, 'patternsService', this.patternsService);
      await this.appService.getData();
      this.patternsService.rows = this.settingsService.USROWSPERPAGE;
      await this.onRefresh();
    }

    async updatePagination(page, pageSize, sort, sortOrder) {
      console.log('pagination has updated', page, pageSize, sort, sortOrder);
      this.patternsService.page = page;
      this.patternsService.rows = pageSize;
      await this.onRefresh();
    }

    async onRefresh() {
      await this.patternsService.getData();
      this.$forceUpdate();
    }

    deletePattern(id: number) {
      this.patternsService.delete(id);
    }

    googlePattern(pattern: string) {
      googleString(pattern);
    }
  }
</script>

<style scoped>
</style>
