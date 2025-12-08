<template>
  <div>
    <el-row>
      <el-col :span="4">
        <el-input placeholder="Filter" v-model="patternsService.filter" @input="onRefresh">
          <template #prepend>
            <el-select value-key="value" v-model="patternsService.filterType" @change="onRefresh" style="width: 100px">
              <el-option v-for="item in settingsService.patternFilterTypes" :label="item.label" :value="item.value" />
            </el-select>
          </template>
        </el-input>
      </el-col>
      <el-button type="primary" @click.stop="showDetailDialog(0)">Add
        <template #icon><font-awesome-icon icon="fa-plus" /></template>
      </el-button>
      <el-button type="primary" @click="onRefresh()">Refresh
        <template #icon><font-awesome-icon icon="fa-refresh" /></template>
      </el-button>
<!--      <router-link to="/patterns-dict/lang/0">-->
        <el-button type="primary">Dictionary
          <template #icon><font-awesome-icon icon="fa-book" /></template>
        </el-button>
<!--      </router-link>-->
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
        <template #default="scope">
          <el-tooltip content="Delete">
            <el-button circle type="danger" @click="deletePattern(scope.row.ID)">
              <template #icon><font-awesome-icon icon="fa-trash" /></template>
            </el-button>
          </el-tooltip>
          <el-tooltip content="Edit">
            <el-button circle type="primary" @click.stop="showDetailDialog(scope.row.ID)">
              <template #icon><font-awesome-icon icon="fa-edit" /></template>
            </el-button>
          </el-tooltip>
          <el-tooltip content="Speak">
            <el-button v-show="settingsService.selectedVoice" circle type="primary"
                 @click="settingsService.speak(scope.row.PATTERN)">
              <template #icon><font-awesome-icon icon="fa-volume-up" /></template>
            </el-button>
          </el-tooltip>
          <el-tooltip content="Copy">
            <el-button circle type="primary" v-clipboard:copy="scope.row.PATTERN">
              <template #icon><font-awesome-icon icon="fa-copy" /></template>
            </el-button>
          </el-tooltip>
          <el-tooltip content="Google Pattern">
            <el-button circle type="primary" @click="googlePattern(scope.row.PATTERN)">
              <template #icon><font-awesome-icon icon="fa-brands fa-google" /></template>
            </el-button>
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
    <PatternsDetail4 v-if="showDetail" v-model="showDetail" :id="detailId"></PatternsDetail4>
  </div>
</template>

<script setup lang="ts">
  import { SettingsService } from '@/shared/view-models/misc/settings.service';
  import { googleString } from '@/shared/common/common';
  import { AppService } from '@/shared/view-models/misc/app.service';
  import { PatternsService } from '@/shared/view-models/wpp/patterns.service';
  import { container } from 'tsyringe';
  import { ref } from "vue";
  import PatternsDetail4 from '@/components/element/PatternsDetail4.vue'

  const appService = ref(container.resolve(AppService));
  const patternsService = ref(container.resolve(PatternsService));
  const settingsService = ref(container.resolve(SettingsService));
  const showDetail = ref(false);
  const detailId = ref(0);

  const onRefresh = async () => {
    // https://stackoverflow.com/questions/4228356/integer-division-with-remainder-in-javascript
    await patternsService.value.getData();
  };

  (async () => {
    await appService.value.getData();
    await onRefresh();
  })();

  const handleSizeChange = async (val: number) => {
    patternsService.value.rows = val;
    await onRefresh();
  };

  const handleCurrentChange = async (val: number) => {
    patternsService.value.page = val;
    await onRefresh();
  };

  const deletePattern = async (id: number) => {
    await patternsService.value.delete(id);
  };

  const googlePattern = (pattern: string) => {
    googleString(pattern);
  };

  const showDetailDialog = (id: number) => {
    detailId.value = id;
    showDetail.value = true;
  };
</script>

<style scoped>
  /*@import '../../assets/common.css';*/
</style>
