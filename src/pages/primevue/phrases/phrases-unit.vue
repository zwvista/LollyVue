<template>
  <div>
    <Toolbar>
      <template #start>
        <Select :options="settingsService.phraseFilterTypes" optionLabel="label" optionValue="value" v-model="filterType" @change="onRefresh" />
        <FloatLabel>
          <InputText id="filter" type="text" v-model="filter" @keyup.enter="onRefresh" />
          <label for="filter">Filter</label>
        </FloatLabel>
<!--        <router-link to="/phrases-unit-detail/0">-->
        <Button><font-awesome-icon icon="fa-plus"/>Add</Button>
<!--        </router-link>-->
        <Button @click="onRefresh()"><font-awesome-icon icon="fa-refresh"/>Refresh</Button>
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
          <Button v-tooltip2.top="'Delete'" severity="danger" @click="deletePhrase(slotProps.data)"><font-awesome-icon icon="fa-trash"/></Button>
<!--          <router-link :to="{ name: 'phrases-unit-detail', params: { id: slotProps.data.ID }}">-->
            <Button v-tooltip2.top="'Edit'"><font-awesome-icon icon="fa-edit"/></Button>
<!--          </router-link>-->
          <Button v-tooltip2.top="'Speak'" @click="settingsService.speak(slotProps.data.PHRASE)"><font-awesome-icon icon="fa-volume-up"/></Button>
          <Button v-tooltip2.top="'Copy'" v-clipboard:copy="slotProps.data.PHRASE"><font-awesome-icon icon="fa-copy"/></Button>
          <Button v-tooltip2.top="'Google Phrase'" @click="googlePhrase(slotProps.data.PHRASE)"><font-awesome-icon icon="fa-brands fa-google"/></Button>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
  import { PhrasesUnitService } from '@/view-models/wpp/phrases-unit.service';
  // import Sortable from 'sortablejs';
  import { googleString } from '@/common/common';
  import { SettingsService } from '@/view-models/misc/settings.service';
  import { MUnitPhrase } from '@/models/wpp/unit-phrase';
  import { AppService } from '@/view-models/misc/app.service';
  import { container } from 'tsyringe';
  import { ref } from "vue";

  const appService = ref(container.resolve(AppService));
  const phrasesUnitService = ref(container.resolve(PhrasesUnitService));
  const settingsService = ref(container.resolve(SettingsService));

  const filter = ref('');
  const filterType = ref(0);

  (() => {
    appService.value.initializeObject.subscribe(_ => {
      onRefresh();
    });
  })();

  function onReorder({dragIndex, dropIndex}: any) {
    console.log('reorder', dragIndex, dropIndex);
    const movedItem = phrasesUnitService.unitPhrases.splice(dragIndex, 1)[0];
    phrasesUnitService.unitPhrases.splice(dropIndex, 0, movedItem);
    phrasesUnitService.reindex(index => {});
  }

  async function onRefresh() {
    await phrasesUnitService.value.getDataInTextbook(filter.value, filterType.value);
  }

  function deletePhrase(item: MUnitPhrase) {
    phrasesUnitService.value.delete(item);
  }

  function googlePhrase(phrase: string) {
    googleString(phrase);
  }
</script>

<style>
  /*@import '../../assets/common.css';*/
</style>
