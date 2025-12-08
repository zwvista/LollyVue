<template>
  <div>
    <el-row>
      <el-col :span="4">
        <el-input placeholder="Filter" v-model="patternsService.filter" @input="onRefresh" class="input-with-select">
          <el-select v-model="patternsService.filterType" slot="prepend" @change="onRefresh">
            <el-option
              v-for="item in settingsService.patternFilterTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-input>
      </el-col>
      <router-link to="/patterns-detail/0">
        <el-button type="primary" icon="fa fa-plus">Add</el-button>
      </router-link>
      <el-button type="primary" icon="fa fa-refresh" @click="onRefresh()">Refresh</el-button>
      <router-link to="/patterns-dict/lang/0">
        <el-button type="primary" icon="fa fa-book">Dictionary</el-button>
      </router-link>
    </el-row>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="patternsService.page"
        :page-sizes="settingsService.USROWSPERPAGEOPTIONS"
        :page-size="patternsService.rows"
        layout="total, sizes, prev, pager, next, jumper"
        :total="patternsService.patternCount">
      </el-pagination>
    </div>
    <el-table
      :data="patternsService.patterns"
      :row-style="({row}) => row.colorStyle"
      style="width: 100%"
    >
      <el-table-column prop="ID" label="ID"></el-table-column>
      <el-table-column prop="PATTERN" label="PATTERN"></el-table-column>
      <el-table-column prop="TAGS" label="TAGS"></el-table-column>
      <el-table-column prop="TITLE" label="TITLE"></el-table-column>
      <el-table-column prop="URL" label="URL"></el-table-column>
      <el-table-column label="ACTIONS" width="300">
        <template slot-scope="scope">
          <el-tooltip content="Delete">
            <el-button circle type="danger" icon="fa fa-trash" @click="deletePattern(scope.row.ID)"></el-button>
          </el-tooltip>
          <router-link :to="{ name: 'patterns-detail', params: { id: scope.row.ID }}">
            <el-tooltip content="Edit">
              <el-button circle type="primary" icon="fa fa-edit"></el-button>
            </el-tooltip>
          </router-link>
          <el-tooltip content="Speak">
            <el-button v-show="settingsService.selectedVoice" circle type="primary" icon="fa fa-volume-up"
                 @click="settingsService.speak(scope.row.PATTERN)"></el-button>
          </el-tooltip>
          <el-tooltip content="Copy">
            <el-button circle type="primary" icon="fa fa-copy" v-clipboard:copy="scope.row.PATTERN"></el-button>
          </el-tooltip>
          <el-tooltip content="Google Pattern">
            <el-button circle type="primary" icon="fa fa-google" @click="googlePattern(scope.row.PATTERN)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="patternsService.page"
        :page-sizes="settingsService.USROWSPERPAGEOPTIONS"
        :page-size="patternsService.rows"
        layout="total, sizes, prev, pager, next, jumper"
        :total="patternsService.patternCount">
      </el-pagination>
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
  export default class Patterns4 extends Vue {
    appService = container.resolve(AppService);
    patternsService = container.resolve(PatternsService);
    settingsService = container.resolve(SettingsService);

    services = {};
    async created() {
      this.$set(this.services, 'patternsService', this.patternsService);
      await this.appService.getData();
      await this.onRefresh();
    }

    async handleSizeChange(val) {
      this.patternsService.rows = val;
      await this.onRefresh();
    }

    async handleCurrentChange(val) {
      this.patternsService.page = val;
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
  @import '../../assets/common.css';
</style>
