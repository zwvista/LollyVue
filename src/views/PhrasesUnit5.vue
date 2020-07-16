<template>
  <div>
    <v-toolbar>
      <v-flex xs6 md2>
        <v-select :items="settingsService.phraseFilterTypes" item-text="label" item-value="value" v-model="filterType" @change="onRefresh"></v-select>
      </v-flex>
      <v-flex xs6 md2>
        <v-text-field label="Filter" type="text" v-model="filter" @keyup.enter="onRefresh"></v-text-field>
      </v-flex>
      <router-link to="/phrases-unit-detail/0">
        <v-btn color="info"><v-icon left>fa-plus</v-icon>Add</v-btn>
      </router-link>
      <v-btn color="info" @click="onRefresh()"><v-icon left>fa-refresh</v-icon>Refresh</v-btn>
    </v-toolbar>
    <v-data-table
      :headers="headers"
      :items="phrasesUnitService.unitPhrases"
      :items-per-page="-1"
      hide-default-footer
      class="elevation-1"
      ref="sortableTable"
      item-key="ID"
    >
      <template v-slot:body="{items}">
        <tbody>
        <tr v-for="(item, index) in items" class="sortableRow" :key="item.ID">
          <td class="px-1" style="width: 0.1%">
            <v-btn v-show="settingsService.isSingleUnitPart && !filter" style="cursor: move" icon class="sortHandle"><v-icon>fa-bars</v-icon></v-btn>
          </td>
          <td>{{ item.ID }}</td>
          <td>{{ item.UNITSTR }}</td>
          <td>{{ item.PARTSTR }}</td>
          <td>{{ item.SEQNUM }}</td>
          <td>{{ item.PHRASEID }}</td>
          <td>{{ item.PHRASE }}</td>
          <td>{{ item.TRANSLATION }}</td>
          <td>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" icon color="error" @click="deletePhrase(item)"><v-icon>fa-trash</v-icon></v-btn>
              </template>
              <span>Delete</span>
            </v-tooltip>
            <router-link :to="{ name: 'phrases-unit-detail', params: { id: item.ID }}">
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" v-on="on" icon color="info"><v-icon>fa-edit</v-icon></v-btn>
                </template>
                <span>Edit</span>
              </v-tooltip>
            </router-link>
            <v-tooltip v-show="settingsService.selectedVoice" top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" icon color="info" @click="settingsService.speak(item.PHRASE)"><v-icon>fa-volume-up</v-icon></v-btn>
              </template>
              <span>Speak</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" icon color="info" v-clipboard:copy="item.PHRASE"><v-icon>fa-copy</v-icon></v-btn>
              </template>
              <span>Copy</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" icon color="info" @click="googlePhrase(item.PHRASE)"><v-icon>fa-google</v-icon></v-btn>
              </template>
              <span>Google Phrase</span>
            </v-tooltip>
          </td>
        </tr>
        </tbody>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { inject } from 'vue-typescript-inject';
  import { PhrasesUnitService } from '@/view-models/phrases-unit.service';
  import Sortable from 'sortablejs';
  import { googleString } from '@/common/common';
  import { SettingsService } from '@/view-models/settings.service';
  import { MUnitPhrase } from '@/models/unit-phrase';
  import { AppService } from '@/view-models/app.service';

  @Component
  export default class PhrasesUnit5 extends Vue {
    @inject() appService!: AppService;
    @inject() phrasesUnitService!: PhrasesUnitService;
    @inject() settingsService!: SettingsService;

    headers = [
      { sortable: false },
      { text: 'ID', sortable: false, value: 'ID' },
      { text: 'UNIT', sortable: false, value: 'UNIT' },
      { text: 'PART', sortable: false, value: 'PART' },
      { text: 'SEQNUM', sortable: false, value: 'SEQNUM' },
      { text: 'PHRASEID', sortable: false, value: 'PHRASEID' },
      { text: 'PHRASE', sortable: false, value: 'PHRASE' },
      { text: 'TRANSLATION', sortable: false, value: 'TRANSLATION' },
      { text: 'ACTIONS', sortable: false },
    ];
    filter = '';
    filterType = 0;

    services = {};
    created() {
      this.$set(this.services, 'phrasesUnitService', this.phrasesUnitService);
      this.appService.initializeObject.subscribe(_ => {
        this.onRefresh();
      });
    }

    expandRow = null;

    mounted() {
      /* eslint-disable no-new */
      new Sortable(
        (this.$refs.sortableTable as any).$el.getElementsByTagName('tbody')[0],
        {
          draggable: '.sortableRow',
          handle: '.sortHandle',
          onStart: this.dragStart,
          onEnd: this.dragReorder,
        },
      );
    }

    dragStart({item}: any) {
      const nextSib = item.nextSibling;
      if (nextSib &&
        nextSib.classList.contains('datatable__expand-row')) {
        this.expandRow = nextSib;
      } else {
        this.expandRow = null;
      }
    }

    dragReorder({item, oldIndex, newIndex}: any) {
      console.log('reorder', item, oldIndex, newIndex);
      const nextSib = item.nextSibling;
      if (nextSib &&
        nextSib.classList.contains('datatable__expand-row') &&
        nextSib !== this.expandRow) {
        item.parentNode.insertBefore(item, nextSib.nextSibling);
      }
      const movedItem = this.phrasesUnitService.unitPhrases.splice(oldIndex, 1)[0];
      this.phrasesUnitService.unitPhrases.splice(newIndex, 0, movedItem);
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
