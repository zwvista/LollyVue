<template>
  <div>
    <v-toolbar>
      <v-flex xs6 md2>
        <v-text-field label="New Word" type="text" v-model="wordsUnitService.newWord" @keyup.enter="onEnterNewWord"></v-text-field>
      </v-flex>
      <v-tooltip top v-show="settingsService.selectedVoice">
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" icon color="info" @click="settingsService.speak(newWord)"><v-icon>fa-volume-up</v-icon></v-btn>
        </template>
        <span>Speak</span>
      </v-tooltip>
      <v-flex xs6 md2>
        <v-select :items="settingsService.wordFilterTypes" item-text="label" item-value="value" v-model="wordsUnitService.filterType" @change="onRefresh"></v-select>
      </v-flex>
      <v-flex xs6 md2>
        <v-text-field label="Filter" type="text" v-model="wordsUnitService.filter" @keyup.enter="onRefresh"></v-text-field>
      </v-flex>
      <router-link to="/words-unit-detail/0">
        <v-btn color="info"><v-icon left>fa-plus</v-icon>Add</v-btn>
      </router-link>
      <v-btn color="info" @click="onRefresh()"><v-icon left>fa-refresh</v-icon>Refresh</v-btn>
      <v-checkbox label="If Empty" v-model="wordsUnitService.ifEmpty"></v-checkbox>
      <v-btn v-show="settingsService.selectedDictNote" color="warning" @click="getNotes()">Get Notes</v-btn>
      <v-btn v-show="settingsService.selectedDictNote" color="warning" @click="clearNotes()">Clear Notes</v-btn>
      <router-link to="/words-dict/unit/0">
        <v-btn color="info"><v-icon left>fa-book</v-icon>Dictionary</v-btn>
      </router-link>
    </v-toolbar>
    <v-data-table
      :headers="headers"
      :items="wordsUnitService.unitWords"
      :items-per-page="-1"
      hide-default-footer
      class="elevation-1"
      ref="sortableTable"
      item-key="ID"
    >
      <template v-slot:body="{items}">
        <tbody>
        <tr class="sortableRow" v-for="(item, index) in items" :key="item.ID" :style="item.colorStyle">
          <td class="px-1" style="width: 0.1%">
            <v-btn v-show="settingsService.isSingleUnitPart && !filter" style="cursor: move" icon class="sortHandle"><v-icon>fa-bars</v-icon></v-btn>
          </td>
          <td>{{ item.ID }}</td>
          <td>{{ item.UNITSTR }}</td>
          <td>{{ item.PARTSTR }}</td>
          <td>{{ item.SEQNUM }}</td>
          <td>{{ item.WORDID }}</td>
          <td>{{ item.WORD }}</td>
          <td>{{ item.NOTE }}</td>
          <td>{{ item.ACCURACY }}</td>
          <td>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" icon color="error" @click="deleteWord(item)"><v-icon>fa-trash</v-icon></v-btn>
              </template>
              <span>Delete</span>
            </v-tooltip>
            <router-link :to="{ name: 'words-unit-detail', params: { id: item.ID }}">
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" v-on="on" icon color="info"><v-icon>fa-edit</v-icon></v-btn>
                </template>
                <span>Edit</span>
              </v-tooltip>
            </router-link>
            <v-tooltip top v-show="settingsService.selectedVoice">
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" icon color="info" @click="settingsService.speak(item.WORD)"><v-icon>fa-volume-up</v-icon></v-btn>
              </template>
              <span>Speak</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
              <v-btn v-bind="attrs" v-on="on" icon color="info" v-clipboard:copy="item.WORD"><v-icon>fa-copy</v-icon></v-btn>
                </template>
              <span>Copy</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" icon color="info" @click="googleWord(item.WORD)"><v-icon>fa-google</v-icon></v-btn>
              </template>
              <span>Google Word</span>
            </v-tooltip>
            <router-link :to="{ name: 'words-dict', params: { type: 'unit', index: index }}">
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" v-on="on" icon color="info"><v-icon>fa-book</v-icon></v-btn>
                </template>
                <span>Dictionary</span>
              </v-tooltip>
            </router-link>
            <v-btn v-show="settingsService.selectedDictNote" color="warning" @click="getNote(index)">Get Note</v-btn>
            <v-btn v-show="settingsService.selectedDictNote" color="warning" @click="clearNote(index)">Clear Note</v-btn>
          </td>
        </tr>
        </tbody>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { WordsUnitService } from '@/shared/view-models/wpp/words-unit.service';
  import Sortable from 'sortablejs';
  import { SettingsService } from '@/shared/view-models/misc/settings.service';
  import { googleString } from '@/shared/common/common';
  import { MUnitWord } from '@/shared/models/wpp/unit-word';
  import { AppService } from '@/shared/view-models/misc/app.service';
  import { container } from 'tsyringe';

  @Component
  export default class WordsUnit extends Vue {
    appService = container.resolve(AppService);
    wordsUnitService = container.resolve(WordsUnitService);
    settingsService = container.resolve(SettingsService);

    headers = [
      { sortable: false },
      { text: 'ID', sortable: false, value: 'ID' },
      { text: 'UNIT', sortable: false, value: 'UNIT' },
      { text: 'PART', sortable: false, value: 'PART' },
      { text: 'SEQNUM', sortable: false, value: 'SEQNUM' },
      { text: 'WORDID', sortable: false, value: 'WORDID' },
      { text: 'WORD', sortable: false, value: 'WORD' },
      { text: 'NOTE', sortable: false, value: 'NOTE' },
      { text: 'ACCURACY', sortable: false, value: 'ACCURACY' },
      { text: 'ACTIONS', sortable: false },
    ];

    services = {};
    async created() {
      this.$set(this.services, 'wordsUnitService', this.wordsUnitService);
      await this.appService.getData();
      await this.onRefresh();
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
      const movedItem = this.wordsUnitService.unitWords.splice(oldIndex, 1)[0];
      this.wordsUnitService.unitWords.splice(newIndex, 0, movedItem);
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
