<template>
  <div>
    <el-row>
      <el-col :span="4">
        <el-input placeholder="Filter" v-model="filter" @input="onRefresh">
          <template #prepend>
            <el-select v-model="filterType" slot="prepend" @change="onRefresh" style="width: 100px">
              <el-option
                v-for="item in settingsService.phraseFilterTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-input>
      </el-col>
<!--      <router-link to="/phrases-lang-detail/0">-->
        <el-button type="primary">Add
          <template #icon><font-awesome-icon icon="fa-plus" /></template>
        </el-button>
<!--      </router-link>-->
      <el-button type="primary" @click="onRefresh()">Refresh
        <template #icon><font-awesome-icon icon="fa-refresh" /></template>
      </el-button>
<!--      <router-link to="/phrases-dict/lang/0">-->
        <el-button type="primary">Dictionary
          <template #icon><font-awesome-icon icon="fa-book" /></template>
        </el-button>
<!--      </router-link>-->
    </el-row>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="page"
        :page-sizes="settingsService.USROWSPERPAGEOPTIONS"
        :page-size="rows"
        layout="total, sizes, prev, pager, next, jumper"
        :total="phrasesLangService.langPhraseCount">
      </el-pagination>
    </div>
    <el-table
      :data="phrasesLangService.langPhrases"
      :row-style="({row}) => row.colorStyle"
      style="width: 100%"
    >
      <el-table-column prop="ID" label="ID"></el-table-column>
      <el-table-column prop="PHRASE" label="PHRASE"></el-table-column>
      <el-table-column prop="TRANSLATION" label="TRANSLATION"></el-table-column>
      <el-table-column label="ACTIONS" width="300">
        <template #default="scope">
          <el-tooltip content="Delete">
            <el-button circle type="danger" @click="deletePhrase(scope.row)">
              <template #icon><font-awesome-icon icon="fa-trash" /></template>
            </el-button>
          </el-tooltip>
<!--          <router-link :to="{ name: 'phrases-lang-detail', params: { id: scope.row.ID }}">-->
            <el-tooltip content="Edit">
              <el-button circle type="primary">
                <template #icon><font-awesome-icon icon="fa-edit" /></template>
              </el-button>
            </el-tooltip>
<!--          </router-link>-->
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
        :total="phrasesLangService.langPhraseCount">
      </el-pagination>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { SettingsService } from '@/view-models/misc/settings.service';
  import { googleString } from '@/common/common';
  import { PhrasesLangService } from '@/view-models/wpp/phrases-lang.service';
  import { AppService } from '@/view-models/misc/app.service';
  import { MLangPhrase } from '@/models/wpp/lang-phrase';
  import { container } from 'tsyringe';
  import { ref } from "vue";

  const appService = ref(container.resolve(AppService));
  const phrasesLangService = ref(container.resolve(PhrasesLangService));
  const settingsService = ref(container.resolve(SettingsService));

  const page = ref(1);
  const rows = ref(0);
  const filter = ref('');
  const filterType = ref(0);

  (() => {
    appService.value.initializeObject.subscribe(_ => {
      rows.value = settingsService.value.USROWSPERPAGE;
      onRefresh();
    });
  })();

  function handleSizeChange(val: number) {
    rows.value = val;
    onRefresh();
  }

  function handleCurrentChange(val: number) {
    page.value = val;
    onRefresh();
  }

  async function onRefresh() {
    // https://stackoverflow.com/questions/4228356/integer-division-with-remainder-in-javascript
    await phrasesLangService.value.getData(page.value, rows.value, filter.value, filterType.value);
  }

  function deletePhrase(item: MLangPhrase) {
    phrasesLangService.value.delete(item);
  }

  function googlePhrase(phrase: string) {
    googleString(phrase);
  }
</script>

<style scoped>
  /*@import '../../assets/common.css';*/
</style>
