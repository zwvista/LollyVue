<template>
  <div>
    <el-row>
      <el-col :span="4">
        <el-input placeholder="Filter" v-model="wordsUnitService.filter" @input="onRefresh">
          <template #prepend>
            <el-select value-key="value" v-model="wordsUnitService.filterType" @change="onRefresh" style="width: 100px">
              <el-option v-for="item in settingsService.wordFilterTypes" :label="item.label" :value="item.value" />
            </el-select>
          </template>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-select value-key="value" v-model="wordsUnitService.textbookFilter" @change="onRefresh">
          <el-option v-for="item in settingsService.textbookFilters" :label="item.label" :value="item.value" />
        </el-select>
      </el-col>
      <el-button type="primary" @click="onRefresh()">Refresh
        <template #icon><font-awesome-icon icon="fa-refresh" /></template>
      </el-button>
<!--      <router-link to="/words-dict/textbook/0">-->
        <el-button type="primary">Dictionary
          <template #icon><font-awesome-icon icon="fa-book" /></template>
        </el-button>
<!--      </router-link>-->
    </el-row>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="wordsUnitService.page"
        :page-sizes="settingsService.USROWSPERPAGEOPTIONS"
        :page-size="wordsUnitService.rows"
        layout="total, sizes, prev, pager, next, jumper"
        :total="wordsUnitService.textbookWordCount">
      </el-pagination>
    </div>
    <el-table
      :data="wordsUnitService.textbookWords"
      :row-style="({row}) => row.colorStyle"
      style="width: 100%"
    >
      <el-table-column prop="ID" label="ID"></el-table-column>
      <el-table-column prop="TEXTBOOKNAME" label="TEXTBOOKNAME"></el-table-column>
      <el-table-column prop="UNITSTR" label="UNIT"></el-table-column>
      <el-table-column prop="PARTSTR" label="PART"></el-table-column>
      <el-table-column prop="SEQNUM" label="SEQNUM"></el-table-column>
      <el-table-column prop="WORDID" label="WORDID"></el-table-column>
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
<!--          <router-link :to="{ name: 'words-dict', params: { type: 'textbook', index: scope.$index }}">-->
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
        :current-page.sync="wordsUnitService.page"
        :page-sizes="settingsService.USROWSPERPAGEOPTIONS"
        :page-size="wordsUnitService.rows"
        layout="total, sizes, prev, pager, next, jumper"
        :total="wordsUnitService.textbookWordCount">
      </el-pagination>
    </div>
    <WordsTextbookDetail4 v-if="showDetail" v-model="showDetail" :id="detailId"></WordsTextbookDetail4>
  </div>
</template>

<script setup lang="ts">
  import { WordsUnitService } from '@/shared/view-models/wpp/words-unit.service';
  import { SettingsService } from '@/shared/view-models/misc/settings.service';
  import { googleString } from '@/shared/common/common';
  import { MUnitWord } from '@/shared/models/wpp/unit-word';
  import { AppService } from '@/shared/view-models/misc/app.service';
  import { container } from 'tsyringe';
  import { ref } from "vue";
  import WordsTextbookDetail4 from '@/components/element/WordsTextbookDetail4.vue'

  const appService = ref(container.resolve(AppService));
  const wordsUnitService = ref(container.resolve(WordsUnitService));
  const settingsService = ref(container.resolve(SettingsService));
  const showDetail = ref(false);
  const detailId = ref(0);

  const onRefresh = async () => {
    // https://stackoverflow.com/questions/4228356/integer-division-with-remainder-in-javascript
    await wordsUnitService.value.getDataInLang();
  };

  (async () => {
    await appService.value.getData();
    wordsUnitService.value.rows = settingsService.value.USROWSPERPAGE;
    await onRefresh();
  })();

  const handleSizeChange = async (val: number) => {
    wordsUnitService.value.rows = val;
    await onRefresh();
  };

  const handleCurrentChange = async (val: number) => {
    wordsUnitService.value.page = val;
    await onRefresh();
  };

  const deleteWord = async (item: MUnitWord) => {
    await wordsUnitService.value.delete(item);
  };

  const getNote = async (item: MUnitWord) => {
    await wordsUnitService.value.getNote(item);
  };

  const clearNote = async (item: MUnitWord) => {
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
