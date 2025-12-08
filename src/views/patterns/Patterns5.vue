<template>
  <div>
    <Toolbar>
      <template #start>
        <DropDown :options="settingsService.patternFilterTypes" optionLabel="label" optionValue="value" v-model="patternsService.filterType" @change="onRefresh" />
        <span class="p-float-label">
          <InputText id="filter" type="text" v-model="patternsService.filter" @keyup.enter="onRefresh" />
          <label for="filter">Filter</label>
        </span>
        <router-link to="/patterns-detail/0">
          <Button icon="fa fa-plus" label="Add" />
        </router-link>
        <Button icon="fa fa-refresh" label="Refresh" @click="onRefresh()" />
      </template>
    </Toolbar>
    <Paginator :rows="patternsService.rows" :totalRecords="patternsService.patternCount" :rowsPerPageOptions="settingsService.USROWSPERPAGEOPTIONS" @page="onPage($event)" />
    <DataTable
      :value="patternsService.patterns"
    >
      <Column headerStyle="width: 80px" field="ID" header="ID" />
      <Column field="PATTERN" header="PATTERN" />
      <Column field="TAGS" header="TAGS" />
      <Column field="TITLE" header="TITLE" />
      <Column field="URL" header="URL" />
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
    <Paginator :rows="patternsService.rows" :totalRecords="patternsService.patternCount" :rowsPerPageOptions="settingsService.USROWSPERPAGEOPTIONS" @page="onPage($event)" />
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { googleString } from '@/shared/common/common';
  import { SettingsService } from '@/shared/view-models/misc/settings.service';
  import { AppService } from '@/shared/view-models/misc/app.service';
  import { PatternsService } from '@/shared/view-models/wpp/patterns.service';
  import { container } from 'tsyringe';

  @Component
  export default class Patterns5 extends Vue {
    appService = container.resolve(AppService);
    patternsService = container.resolve(PatternsService);
    settingsService = container.resolve(SettingsService);

    pageCount = 1;

    services = {};
    async created() {
      this.$set(this.services, 'patternsService', this.patternsService);
      await this.appService.getData();
      await this.onRefresh();
    }

    async onPage(event: any) {
      this.patternsService.page = event.page + 1;
      await this.onRefresh();
    }

    async onRefresh() {
      // https://stackoverflow.com/questions/4228356/integer-division-with-remainder-in-javascript
      await this.patternsService.getData();
      this.pageCount = (this.patternsService.patternCount + this.patternsService.rows - 1) / this.patternsService.rows >> 0;
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
