<template>
  <div>
    <Toolbar>
      <template #start>
        <DropDown :options="settingsService.patternFilterTypes" optionLabel="label" optionValue="value" v-model="filterType" @change="onRefresh" />
        <FloatLabel>
          <InputText id="filter" type="text" v-model="filter" @keyup.enter="onRefresh" />
          <label for="filter">Filter</label>
        </FloatLabel>
        <router-link to="/patterns-detail/0">
          <Button icon="fa fa-plus" label="Add" />
        </router-link>
        <Button icon="fa fa-refresh" label="Refresh" @click="onRefresh()" />
      </template>
    </Toolbar>
    <Paginator :rows.sync="rows" :totalRecords="patternsService.langPatternCount" :rowsPerPageOptions="settingsService.USROWSPERPAGEOPTIONS" @page="onRefresh" />
    <DataTable
      :value="patternsService.patterns"
    >
      <Column headerStyle="width: 80px" field="ID" header="ID" />
      <Column field="PATTERN" header="PATTERN" />
      <Column field="NOTE" header="NOTE" />
      <Column field="TAGS" header="TAGS" />
      <Column headerStyle="width: 30%" header="ACTIONS">
        <template #body="slotProps">
         <Button v-tooltip.top="'Delete'" icon="fa fa-trash" class="p-button-danger" @click="deletePattern(slotProps.data.ID)" />
          <router-link :to="{ name: 'patterns-detail', params: { id: slotProps.data.ID }}">
            <Button v-tooltip.top="'Edit'" icon="fa fa-edit" />
          </router-link>
          <Button v-tooltip.top="'Speak'" icon="fa fa-volume-up" @click="settingsService.speak(slotProps.data.PATTERN)" />
          <Button v-tooltip.top="'Copy'" icon="fa fa-copy" v-clipboard:copy="slotProps.data.PATTERN" />
          <Button v-tooltip.top="'Google Pattern'" icon="fa fa-google" @click="googlePattern(slotProps.data.PATTERN)" />
        </template>
      </Column>
    </DataTable>
    <Paginator :rows.sync="rows" :totalRecords="patternsService.langPatternCount" :rowsPerPageOptions="settingsService.USROWSPERPAGEOPTIONS" @page="onRefresh" />
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { googleString } from '@/common/common';
  import { SettingsService } from '@/view-models/misc/settings.service';
  import { AppService } from '@/view-models/misc/app.service';
  import { PatternsService } from '@/view-models/wpp/patterns.service';
  import { container } from 'tsyringe';

  @Component
  export default class Patterns5 extends Vue {
    appService = container.resolve(AppService);
    patternsService = container.resolve(PatternsService);
    settingsService = container.resolve(SettingsService);

    page = 1;
    pageCount = 1;
    rows = 0;
    filter = '';
    filterType = 0;

    services = {};
    created() {
      this.$set(this.services, 'patternsService', this.patternsService);
      this.appService.initializeObject.subscribe(_ => {
        this.rows = this.settingsService.USROWSPERPAGE;
        this.onRefresh();
      });
    }

    rowsChange(rows: number) {
      this.page = 1;
      this.onRefresh();
    }

    async onRefresh() {
      // https://stackoverflow.com/questions/4228356/integer-division-with-remainder-in-javascript
      await this.patternsService.getData(this.page, this.rows, this.filter, this.filterType);
      this.pageCount = (this.patternsService.patternCount + this.rows - 1) / this.rows >> 0;
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

<style>
  @import '../../assets/common.css';
</style>
