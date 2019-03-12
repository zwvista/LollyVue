<template>
  <div>
    <v-toolbar>
      <v-flex xs6 md2>
        <v-text-field label="New Word" type="text" v-model="newWord" @keyup.enter="onEnter"></v-text-field>
      </v-flex>
      <v-tooltip top v-show="settingsService.selectedVoice">
        <v-btn slot="activator" icon color="info" @click="settingsService.speak(newWord)"><v-icon>fa-volume-up</v-icon></v-btn>
        <span>Speak</span>
      </v-tooltip>
      <router-link to="/words-unit-detail/0">
        <v-btn color="info"><v-icon left>fa-plus</v-icon>Add</v-btn>
      </router-link>
      <v-btn color="info" @click="onRefresh()"><v-icon left>fa-refresh</v-icon>Refresh</v-btn>
      <v-btn v-show="settingsService.selectedDictNote" color="warning">Retrieve All Notes</v-btn>
      <v-btn v-show="settingsService.selectedDictNote" color="warning">Retrieve Notes If Empty</v-btn>
      <router-link to="/words-dict/unit/0">
        <v-btn color="info"><v-icon left>fa-book</v-icon>Dictionary</v-btn>
      </router-link>
    </v-toolbar>
    <v-data-table
      :headers="headers"
      :items="wordsUnitService.unitWords"
      hide-actions
      class="elevation-1"
      ref="sortableTable"
      item-key="ID"
    >
      <template slot="items" slot-scope="props">
        <tr class="sortableRow" :key="props.item.ID" :style="props.item.colorStyle">
          <td class="px-1" style="width: 0.1%">
            <v-btn style="cursor: move" icon class="sortHandle"><v-icon>fa-bars</v-icon></v-btn>
          </td>
          <td>{{ props.item.ID }}</td>
          <td>{{ props.item.UNITSTR }}</td>
          <td>{{ props.item.PARTSTR }}</td>
          <td>{{ props.item.SEQNUM }}</td>
          <td>{{ props.item.WORDID }}</td>
          <td>{{ props.item.WORD }}</td>
          <td>{{ props.item.NOTE }}</td>
          <td>{{ props.item.LEVEL }}</td>
          <td>
            <v-tooltip top>
              <v-btn slot="activator" icon color="error" @click="delete(props.item)"><v-icon>fa-trash</v-icon></v-btn>
              <span>Delete</span>
            </v-tooltip>
            <router-link :to="{ name: 'words-unit-detail', params: { id: props.item.ID }}">
              <v-tooltip top>
                <v-btn slot="activator" icon color="info"><v-icon>fa-edit</v-icon></v-btn>
                <span>Edit</span>
              </v-tooltip>
            </router-link>
            <v-tooltip top v-show="settingsService.selectedVoice">
              <v-btn slot="activator" icon color="info" @click="settingsService.speak(props.item.WORD)"><v-icon>fa-volume-up</v-icon></v-btn>
              <span>Speak</span>
            </v-tooltip>
            <v-tooltip top>
              <v-btn slot="activator" icon color="info" v-clipboard:copy="props.item.WORD"><v-icon>fa-copy</v-icon></v-btn>
              <span>Copy</span>
            </v-tooltip>
            <v-tooltip top>
              <v-btn slot="activator" icon color="warning" @click="updateLevel(props.index, 1)"><v-icon>fa-arrow-up</v-icon></v-btn>
              <span>Level Up</span>
            </v-tooltip>
            <v-tooltip top>
              <v-btn slot="activator" icon color="warning" @click="updateLevel(props.index, -1)"><v-icon>fa-arrow-down</v-icon></v-btn>
              <span>Level Down</span>
            </v-tooltip>
            <v-tooltip top>
              <v-btn slot="activator" icon color="info" @click="googleWord(props.item.WORD)"><v-icon>fa-google</v-icon></v-btn>
              <span>Google Word</span>
            </v-tooltip>
            <router-link :to="{ name: 'words-dict', params: { type: 'unit', index: props.index }}">
              <v-tooltip top>
                <v-btn slot="activator" icon color="info"><v-icon>fa-book</v-icon></v-btn>
                <span>Dictionary</span>
              </v-tooltip>
            </router-link>
            <v-btn v-show="settingsService.selectedDictNote" color="warning" @click="getNote(props.item.WORD)">Retrieve Note</v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { inject } from 'vue-typescript-inject';
  import { WordsUnitService } from '@/view-models/words-unit.service';
  import Sortable from 'sortablejs';
  import { SettingsService } from '@/view-models/settings.service';
  import { googleString } from '@/common/common';
  import { MUnitWord } from '@/models/unit-word';

  @Component
  export default class WordsUnit extends Vue {
    @inject() wordsUnitService!: WordsUnitService;
    @inject() settingsService!: SettingsService;

    headers = [
      { sortable: false },
      { text: 'ID', sortable: false, value: 'ID' },
      { text: 'UNIT', sortable: false, value: 'UNIT' },
      { text: 'PART', sortable: false, value: 'PART' },
      { text: 'SEQNUM', sortable: false, value: 'SEQNUM' },
      { text: 'WORDID', sortable: false, value: 'WORDID' },
      { text: 'WORD', sortable: false, value: 'WORD' },
      { text: 'NOTE', sortable: false, value: 'NOTE' },
      { text: 'LEVEL', sortable: false, value: 'LEVEL' },
      { text: 'ACTIONS', sortable: false },
    ];
    newWord = '';

    services = {};
    created() {
      this.$set(this.services, 'wordsUnitService', this.wordsUnitService);
      this.onRefresh();
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

    onEnter() {
      if (!this.newWord) return;
      const o = this.wordsUnitService.newUnitWord();
      o.WORD = this.settingsService.autoCorrectInput(this.newWord);
      this.newWord = '';
      this.wordsUnitService.create(o).subscribe(id => {
        o.ID = id as number;
        this.wordsUnitService.unitWords.push(o);
      });
    }

    onRefresh() {
      this.wordsUnitService.getData().subscribe();
    }

    deleteWord(item: MUnitWord) {
      this.wordsUnitService.delete(item);
    }

    getNote(index: number) {
      console.log(index);
      this.wordsUnitService.getNote(index).subscribe();
    }

    googleWord(word: string) {
      googleString(word);
    }

    getNotes(ifEmpty: boolean) {
      this.wordsUnitService.getNotes(ifEmpty, () => {}, () => {});
    }

    updateLevel(index: number, delta: number) {
      const o = this.wordsUnitService.unitWords[index];
      this.settingsService.updateLevel(o, o.WORDID, delta).subscribe();
    }
  }
</script>

<style>
  @import '../assets/common.css';
</style>
