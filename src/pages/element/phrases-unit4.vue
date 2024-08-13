<template>
  <div>
    <el-row>
      <el-col :span="4">
        <el-input placeholder="Filter" v-model="filter" @input="onRefresh">
          <template #prepend>
            <el-select value-key="value" v-model="filterType" @change="onRefresh" style="width: 100px">
              <el-option v-for="item in settingsService.phraseFilterTypes" :label="item.label" :value="item.value" />
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
        <template #default="scope">
          <el-tooltip content="Delete">
            <el-button circle type="danger" @click="deletePhrase(scope.row)">
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
                 @click="settingsService.speak(scope.row.PHRASE)">
              <template #icon><font-awesome-icon icon="fa-volume-up" /></template>
            </el-button>
          </el-tooltip>
          <el-tooltip content="Copy">
            <el-button circle type="primary" v-clipboard:copy="scope.row.PHRASE">
              <template #icon><font-awesome-icon icon="fa-copy" /></template>
            </el-button>
          </el-tooltip>
          <el-tooltip content="Google Phrase">
            <el-button circle type="primary" @click="googlePhrase(scope.row.PHRASE)">
              <template #icon><font-awesome-icon icon="fa-brands fa-google" /></template>
            </el-button>
          </el-tooltip>
          <el-button v-show="settingsService.selectedDictNote" type="warning"
                 @click="getNote(scope.$index)">Retrieve Note</el-button>
        </template>
      </el-table-column>
    </el-table>
    <PhrasesUnitDetail4 v-if="showDetail" v-model="showDetail" :id="detailId"></PhrasesUnitDetail4>
  </div>
</template>

<script setup lang="ts">
  import { SettingsService } from '@/view-models/misc/settings.service';
  import { googleString } from '@/common/common';
  import { MUnitPhrase } from '@/models/wpp/unit-phrase';
  import { PhrasesUnitService } from '@/view-models/wpp/phrases-unit.service';
  import { AppService } from '@/view-models/misc/app.service';
  import { container } from 'tsyringe';
  import { ref } from "vue";
  import PhrasesUnitDetail4 from '@/components/element/PhrasesUnitDetail4'

  const appService = ref(container.resolve(AppService));
  const phrasesUnitService = ref(container.resolve(PhrasesUnitService));
  const settingsService = ref(container.resolve(SettingsService));
  const showDetail = ref(false);
  const detailId = ref(0);

  const filter = ref('');
  const filterType = ref(0);

  const onRefresh = async () => {
    await phrasesUnitService.value.getDataInTextbook(filter.value, filterType.value);
  };

  (async () => {
    await appService.value.getData();
    await onRefresh();
  })();

  const deletePhrase = async (item: MUnitPhrase) => {
    await phrasesUnitService.value.delete(item);
  };

  const googlePhrase = (phrase: string) => {
    googleString(phrase);
  };

  const showDetailDialog = (id: number) => {
    detailId.value = id;
    showDetail.value = true;
  };
</script>

<style scoped>
  /*@import '../../assets/common.css';*/
</style>
