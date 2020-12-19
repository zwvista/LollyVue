<template>
  <div>
    <Toolbar>
      <template slot="left">
        <DropDown :options="settingsService.phraseFilterTypes" optionLabel="label" optionValue="value" v-model="filterType" @change="onRefresh" />
        <span class="p-float-label">
          <InputText id="filter" type="text" v-model="filter" @keyup.enter="onRefresh" />
          <label for="filter">Filter</label>
        </span>
        <router-link to="/phrases-unit-detail/0">
          <Button icon="fa fa-plus" label="Add" />
        </router-link>
        <Button icon="fa fa-refresh" label="Refresh" @click="onRefresh()" />
      </template>
    </Toolbar>
    <DataTable
      :value="phrasesUnitService.unitPhrases"
      @row-reorder="onReorder"
    >
      <Column :rowReorder="settingsService.textbooks.length && settingsService.isSingleUnitPart && !filter" headerStyle="width: 3rem" />
      <Column headerStyle="width: 80px" field="ID" header="ID" />
      <Column headerStyle="width: 80px" field="UNITSTR" header="UNIT" />
      <Column headerStyle="width: 80px" field="PARTSTR" header="PART" />
      <Column headerStyle="width: 80px" field="SEQNUM" header="SEQNUM" />
      <Column headerStyle="width: 80px" field="PHRASEID" header="PHRASEID" />
      <Column field="PHRASE" header="PHRASE" />
      <Column field="TRANSLATION" header="TRANSLATION" />
      <Column headerStyle="width: 30%" header="ACTIONS">
        <template #body="slotProps">
          <Button v-tooltip.top="'Delete'" icon="fa fa-trash" class="p-button-danger" @click="deletePhrase(slotProps.data)" />
          <router-link :to="{ name: 'phrases-unit-detail', params: { id: slotProps.data.ID }}">
            <Button v-tooltip.top="'Edit'" icon="fa fa-edit" />
          </router-link>
          <Button v-tooltip.top="'Speak'" icon="fa fa-volume-up" @click="settingsService.speak(slotProps.data.PHRASE)" />
          <Button v-tooltip.top="'Copy'" icon="fa fa-copy" v-clipboard:copy="slotProps.data.PHRASE" />
          <Button v-tooltip.top="'Google Phrase'" icon="fa fa-google" @click="googlePhrase(slotProps.data.PHRASE)" />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { inject } from 'vue-typescript-inject';
  import { PhrasesUnitService } from '@/view-models/phrases-unit.service';
  import Sortable from 'sortablejs';
  import { googleString } from '@/common/common';
  import { SettingsService } from '@/view-models/settings.service';
  import { MUnitPhrase } from '@/models/misc/unit-phrase';
  import { AppService } from '@/view-models/app.service';

  @Component
  export default class PhrasesUnit5 extends Vue {
    @inject() appService!: AppService;
    @inject() phrasesUnitService!: PhrasesUnitService;
    @inject() settingsService!: SettingsService;

    filter = '';
    filterType = 0;

    services = {};
    created() {
      this.$set(this.services, 'phrasesUnitService', this.phrasesUnitService);
      this.appService.initializeObject.subscribe(_ => {
        this.onRefresh();
      });
    }

    mounted() {
    }

    onReorder({dragIndex, dropIndex}: any) {
      console.log('reorder', dragIndex, dropIndex);
      const movedItem = this.phrasesUnitService.unitPhrases.splice(dragIndex, 1)[0];
      this.phrasesUnitService.unitPhrases.splice(dropIndex, 0, movedItem);
      this.phrasesUnitService.reindex(index => {});
    }

    onRefresh() {
      this.phrasesUnitService.getDataInTextbook(this.filter, this.filterType).subscribe();
    }

    deletePhrase(item: MUnitPhrase) {
      this.phrasesUnitService.delete(item);
    }

    googlePhrase(phrase: string) {
      googleString(phrase);
    }
  }
</script>

<style>
  @import '../assets/common.css';
</style>
