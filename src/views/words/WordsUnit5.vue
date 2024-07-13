<template>
  <div>
    <Toolbar>
      <template #start>
        <span class="p-float-label">
          <InputText id="word" type="text" v-model="newWord" @keyup.enter="onEnterNewWord" />
          <label for="word">New Word</label>
        </span>
        <Button v-tooltip.top="'Speak'" v-show="settingsService.selectedVoice" icon="fa fa-volume-up" @click="settingsService.speak(newWord)" />
        <DropDown :options="settingsService.wordFilterTypes" optionLabel="label" optionValue="value" v-model="filterType" @change="onRefresh" />
        <span class="p-float-label">
          <InputText id="filter" type="text" v-model="filter" @keyup.enter="onRefresh" />
          <label for="filter">Filter</label>
        </span>
        <router-link to="/words-unit-detail/0">
          <Button icon="fa fa-plus" label="Add" />
        </router-link>
        <Button icon="fa fa-refresh" label="Refresh" @click="onRefresh()" />
        <Button v-show="settingsService.selectedDictNote" label="Retrieve All Notes" class="p-button-warning" />
        <Button v-show="settingsService.selectedDictNote" label="Retrieve Notes If Empty" class="p-button-warning" />
        <router-link to="/words-dict/unit/0">
          <Button icon="fa fa-book" label="Dictionary" />
        </router-link>
      </template>
    </Toolbar>
    <DataTable
      :value="wordsUnitService.unitWords"
      @row-reorder="onReorder"
    >
      <Column :rowReorder="settingsService.textbooks.length && settingsService.isSingleUnitPart && !filter" headerStyle="width: 3rem" />
      <Column headerStyle="width: 80px" field="ID" header="ID" />
      <Column headerStyle="width: 80px" field="UNITSTR" header="UNIT" />
      <Column headerStyle="width: 80px" field="PARTSTR" header="PART" />
      <Column headerStyle="width: 80px" field="SEQNUM" header="SEQNUM" />
      <Column headerStyle="width: 80px" field="WORDID" header="WORDID" />
      <Column field="WORD" header="WORD" />
      <Column field="NOTE" header="NOTE" />
      <Column headerStyle="width: 80px" field="ACCURACY" header="ACCURACY" />
      <Column headerStyle="width: 30%" header="ACTIONS">
        <template #body="slotProps">
          <Button v-tooltip.top="'Delete'" icon="fa fa-trash" class="p-button-danger" @click="deleteWord(slotProps.data)" />
          <router-link :to="{ name: 'words-unit-detail', params: { id: slotProps.data.ID }}">
            <Button v-tooltip.top="'Edit'" icon="fa fa-edit" />
          </router-link>
          <Button v-tooltip.top="'Speak'" icon="fa fa-volume-up" @click="settingsService.speak(slotProps.data.WORD)" />
          <Button v-tooltip.top="'Copy'" icon="fa fa-copy" v-clipboard:copy="slotProps.data.WORD" />
          <Button v-tooltip.top="'Google Word'" icon="fa fa-google" @click="googleWord(slotProps.data.WORD)" />
          <router-link :to="{ name: 'words-dict', params: { type: 'unit', index: slotProps.index }}">
            <Button v-tooltip.top="'Dictionary'" icon="fa fa-book" />
          </router-link>
          <Button v-show="settingsService.selectedDictNote" label="Retrieve Note" class="p-button-warning" @click="getNote(slotProps.index)" />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { WordsUnitService } from '@/view-models/wpp/words-unit.service';
  import { SettingsService } from '@/view-models/misc/settings.service';
  import { googleString } from '@/common/common';
  import { MUnitWord } from '@/models/wpp/unit-word';
  import { AppService } from '@/view-models/misc/app.service';
  import { container } from 'tsyringe';

  @Component
  export default class WordsUnit5 extends Vue {
    appService = container.resolve(AppService);
    wordsUnitService = container.resolve(WordsUnitService);
    settingsService = container.resolve(SettingsService);

    newWord = '';
    filter = '';
    filterType = 0;

    services = {};
    created() {
      this.$set(this.services, 'wordsUnitService', this.wordsUnitService);
      this.appService.initializeObject.subscribe(_ => {
        this.onRefresh();
      });
    }

    mounted() {
    }

    onReorder({dragIndex, dropIndex}: any) {
      console.log('reorder', dragIndex, dropIndex);
      const movedItem = this.wordsUnitService.unitWords.splice(dragIndex, 1)[0];
      this.wordsUnitService.unitWords.splice(dropIndex, 0, movedItem);
      this.wordsUnitService.reindex(index => {});
    }

    async onEnterNewWord() {
      if (!this.newWord) return;
      const o = this.wordsUnitService.newUnitWord();
      o.WORD = this.settingsService.autoCorrectInput(this.newWord);
      this.newWord = '';
      const id = await this.wordsUnitService.create(o);
      o.ID = id as number;
      this.wordsUnitService.unitWords.push(o);
    }

    async onRefresh() {
      await this.wordsUnitService.getDataInTextbook(this.filter, this.filterType);
    }

    async deleteWord(item: MUnitWord) {
      await this.wordsUnitService.delete(item);
    }

    async getNote(index: number) {
      console.log(index);
      await this.wordsUnitService.getNote(index);
    }

    googleWord(word: string) {
      googleString(word);
    }

    getNotes(ifEmpty: boolean) {
      this.wordsUnitService.getNotes(ifEmpty, () => {}, () => {});
    }
  }
</script>

<style>
  @import '../../assets/common.css';
</style>
