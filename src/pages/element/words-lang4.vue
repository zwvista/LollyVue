<template>
  <div>
    <el-row>
      <el-col :span="4">
        <el-input placeholder="Filter" v-model="filter" @input="onRefresh">
          <template #prepend>
            <el-select value-key="value" v-model="filterType" @change="onRefresh" style="width: 100px">
              <el-option v-for="item in settingsService.wordFilterTypes" :label="item.label" :value="item.value" />
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
      <router-link to="/words-dict/lang/0">
        <el-button type="primary">Dictionary
          <template #icon><font-awesome-icon icon="fa-book" /></template>
        </el-button>
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
        :total="wordsLangService.langWordsCount">
      </el-pagination>
    </div>
    <el-table
      :data="wordsLangService.langWords"
      :row-style="({row}) => row.colorStyle"
      style="width: 100%"
    >
      <el-table-column prop="ID" label="ID"></el-table-column>
      <el-table-column prop="WORD" label="WORD"></el-table-column>
      <el-table-column prop="NOTE" label="NOTE"></el-table-column>
      <el-table-column prop="ACCURACY" label="ACCURACY"></el-table-column>
      <el-table-column label="ACTIONS" width="500">
        <template #default="scope">
          <el-tooltip content="Delete">
            <el-button circle type="danger" @click="deleteWord(scope.row)">
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
                 @click="settingsService.speak(scope.row.WORD)">
              <template #icon><font-awesome-icon icon="fa-volume-up" /></template>
            </el-button>
          </el-tooltip>
          <el-tooltip content="Copy">
            <el-button circle type="primary" v-clipboard:copy="scope.row.WORD">
              <template #icon><font-awesome-icon icon="fa-copy" /></template>
            </el-button>
          </el-tooltip>
          <el-tooltip content="Google Word">
            <el-button circle type="primary" @click="googleWord(scope.row.WORD)">
              <template #icon><font-awesome-icon icon="fa-brands fa-google" /></template>
            </el-button>
          </el-tooltip>
<!--          <router-link :to="{ name: 'words-dict', params: { type: 'unit', index: scope.$index }}">-->
            <el-tooltip content="Dictionary">
              <el-button circle type="primary">
                <template #icon><font-awesome-icon icon="fa-book" /></template>
              </el-button>
            </el-tooltip>
<!--          </router-link>-->
          <el-button v-show="settingsService.selectedDictNote" type="warning"
                     @click="getNote(scope.row)">Get Note</el-button>
          <el-button v-show="settingsService.selectedDictNote" type="warning"
                     @click="clearNote(scope.row)">Clear Note</el-button>
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
        :total="wordsLangService.langWordsCount">
      </el-pagination>
    </div>
    <WordsLangDetail4 v-if="showDetail" v-model="showDetail" :id="detailId"></WordsLangDetail4>
  </div>
</template>

<script setup lang="ts">
  import { SettingsService } from '@/view-models/misc/settings.service';
  import { googleString } from '@/common/common';
  import { WordsLangService } from '@/view-models/wpp/words-lang.service';
  import { MLangWord } from '@/models/wpp/lang-word';
  import { AppService } from '@/view-models/misc/app.service';
  import { container } from 'tsyringe';
  import { ref } from "vue";
  import WordsLangDetail4 from '@/components/element/WordsLangDetail4'

  const appService = ref(container.resolve(AppService));
  const wordsLangService = ref(container.resolve(WordsLangService));
  const settingsService = ref(container.resolve(SettingsService));

  const page = ref(1);
  const pageCount = ref(1);
  const rows = ref(0);
  const filter = ref('');
  const filterType = ref(0);
  const showDetail = ref(false);
  const detailId = ref(0);

  const onRefresh = async () => {
    // https://stackoverflow.com/questions/4228356/integer-division-with-remainder-in-javascript
    await wordsLangService.value.getData(page.value, rows.value, filter.value, filterType.value);
    pageCount.value = (wordsLangService.value.langWordsCount + rows.value - 1) / rows.value >> 0;
  };

  (async () => {
    await appService.value.getData();
    rows.value = settingsService.value.USROWSPERPAGE;
    await onRefresh();
  })();

  const handleSizeChange = async (val: number) => {
    rows.value = val;
    await onRefresh();
  };

  const handleCurrentChange = async (val: number) => {
    page.value = val;
    await onRefresh();
  };

  const deleteWord = async (item: MLangWord) => {
    await wordsLangService.value.delete(item);
  };

  const getNote = async (item: MLangWord) => {
    await wordsUnitService.value.getNote(item);
  };

  const clearNote = async (item: MLangWord) => {
    await wordsUnitService.value.clearNote(item);
  };

  const googleWord = (word: string) => {
    googleString(word);
  };

  const showDetailDialog = (id: number) => {
    detailId.value = id;
    showDetail.value = true;
  };
</script>

<style scoped>
  /*@import '../../assets/common.css';*/
</style>
