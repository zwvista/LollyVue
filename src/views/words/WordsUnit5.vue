<template>
  <div>
    <Toolbar>
      <template #start>
        <span class="p-float-label">
          <InputText id="word" type="text" v-model="wordsUnitService.newWord" @keyup.enter="onEnterNewWord" />
          <label for="word">New Word</label>
        </span>
        <Button v-tooltip.top="'Speak'" v-show="settingsService.selectedVoice" icon="fa fa-volume-up" @click="settingsService.speak(newWord)" />
        <DropDown :options="settingsService.wordFilterTypes" optionLabel="label" optionValue="value" v-model="wordsUnitService.filterType" @change="onRefresh" />
        <span class="p-float-label">
          <InputText id="filter" type="text" v-model="wordsUnitService.filter" @keyup.enter="onRefresh" />
          <label for="filter">Filter</label>
        </span>
        <router-link to="/words-unit-detail/0">
          <Button icon="fa fa-plus" label="Add" />
        </router-link>
        <Button icon="fa fa-refresh" label="Refresh" @click="onRefresh()" />
        <!--https://web.archive.org/web/20220323102337/https://www.primefaces.org/primevue-v2/#/checkbox-->
        <div class="field-checkbox">
          <Checkbox id="ifEmpty" v-model="wordsUnitService.ifEmpty" :binary="true" />
          <label for="ifEmpty">If Empty</label>
        </div>
        <Button v-show="settingsService.selectedDictNote" label="Get Notes" class="p-button-warning" @click="getNotes()" />
        <Button v-show="settingsService.selectedDictNote" label="Clear Notes" class="p-button-warning" @click="clearNotes()" />
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
          <Button v-show="settingsService.selectedDictNote" label="Get Note" class="p-button-warning" @click="getNote(slotProps.data)" />
          <Button v-show="settingsService.selectedDictNote" label="Clear Note" class="p-button-warning" @click="clearNote(slotProps.data)" />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { WordsUnitService } from '@/shared/view-models/wpp/words-unit.service';
  import { SettingsService } from '@/shared/view-models/misc/settings.service';
  import { googleString } from '@/shared/common/common';
  import { MUnitWord } from '@/shared/models/wpp/unit-word';
  import { AppService } from '@/shared/view-models/misc/app.service';
  import { container } from 'tsyringe';

  @Component
  export default class WordsUnit5 extends Vue {
    appService = container.resolve(AppService);
    wordsUnitService = container.resolve(WordsUnitService);
    settingsService = container.resolve(SettingsService);

    services = {};
    async created() {
      this.$set(this.services, 'wordsUnitService', this.wordsUnitService);
      await this.appService.getData();
      await this.onRefresh();
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
      await this.wordsUnitService.createWithNewWord();
    }

    async onRefresh() {
      await this.wordsUnitService.getDataInTextbook();
    }

    async deleteWord(item: MUnitWord) {
      await this.wordsUnitService.delete(item);
    }

    async getNote(item: MUnitWord) {
      await this.wordsUnitService.getNote(item);
    }

    async clearNote(item: MUnitWord) {
      await this.wordsUnitService.clearNote(item);
    }

    googleWord(word: string) {
      googleString(word);
    }

    getNotes() {
      this.wordsUnitService.getNotes(() => {}, () => {});
    }

    clearNotes() {
      this.wordsUnitService.clearNotes(() => {}, () => {});
    }
  }
</script>

<style>
  @import '../../assets/common.css';
</style>
