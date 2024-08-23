<template>
  <div>
    <Toolbar>
      <template #start>
        <Select :options="settingsService.patternFilterTypes" optionLabel="label" optionValue="value" v-model="filterType" @change="onRefresh" />
        <FloatLabel>
          <InputText id="filter" type="text" v-model="filter" @keyup.enter="onRefresh" />
          <label for="filter">Filter</label>
        </FloatLabel>
        <Button rounded @click.stop="showDetailDialog(0)"><font-awesome-icon icon="fa-plus"/>Add</Button>
        <Button rounded @click="onRefresh()"><font-awesome-icon icon="fa-refresh"/>Refresh</Button>
      </template>
    </Toolbar>
    <Paginator :rows.sync="rows" :totalRecords="patternsService.patternCount" :rowsPerPageOptions="settingsService.USROWSPERPAGEOPTIONS" @page="onRefresh" />
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
         <Button rounded v-tooltip2.top="'Delete'"  severity="danger" @click="deletePattern(slotProps.data.ID)"><font-awesome-icon icon="fa-trash"/></Button>
          <Button rounded v-tooltip2.top="'Edit'" @click.stop="showDetailDialog(slotProps.data.ID)"><font-awesome-icon icon="fa-edit"/></Button>
          <Button rounded v-tooltip2.top="'Speak'" @click="settingsService.speak(slotProps.data.PATTERN)"><font-awesome-icon icon="fa-volume-up"/></Button>
          <Button rounded v-tooltip2.top="'Copy'" v-clipboard:copy="slotProps.data.PATTERN"><font-awesome-icon icon="fa-copy"/></Button>
          <Button rounded v-tooltip2.top="'Google Pattern'" @click="googlePattern(slotProps.data.PATTERN)"><font-awesome-icon icon="fa-brands fa-google"/></Button>
        </template>
      </Column>
    </DataTable>
    <Paginator :rows.sync="rows" :totalRecords="patternsService.patternCount" :rowsPerPageOptions="settingsService.USROWSPERPAGEOPTIONS" @page="onRefresh" />
    <PatternsDetail5 v-if="showDetail" v-model="showDetail" :id="detailId"></PatternsDetail5>
  </div>
</template>

<script setup lang="ts">
  import { googleString } from '@/common/common';
  import { SettingsService } from '@/view-models/misc/settings.service';
  import { AppService } from '@/view-models/misc/app.service';
  import { PatternsService } from '@/view-models/wpp/patterns.service';
  import { container } from 'tsyringe';
  import { ref } from "vue";
  import PatternsDetail5 from '@/components/primevue/PatternsDetail5.vue'

  const appService = ref(container.resolve(AppService));
  const patternsService = ref(container.resolve(PatternsService));
  const settingsService = ref(container.resolve(SettingsService));
  const showDetail = ref(false);
  const detailId = ref(0);

  const page = ref(1);
  const pageCount = ref(1);
  const rows = ref(0);
  const filter = ref('');
  const filterType = ref(0);

  const onRefresh = async () => {
    // https://stackoverflow.com/questions/4228356/integer-division-with-remainder-in-javascript
    await patternsService.value.getData(page.value, rows.value, filter.value, filterType.value);
    pageCount.value = (patternsService.value.patternCount + rows.value - 1) / rows.value >> 0;
  };

  (async () => {
    await appService.value.getData();
    rows.value = settingsService.value.USROWSPERPAGE;
    await onRefresh();
  })();

  const rowsChange = async (rows: number) => {
    page.value = 1;
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

<style>
  /*@import '../../assets/common.css';*/
</style>
