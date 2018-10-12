<template>
  <div class="words-unit">
    <v-data-table
      :headers="headers"
      :items="unitWords"
      hide-actions
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <td>{{ props.item.ID }}</td>
        <td>{{ props.item.UNIT }}</td>
        <td>{{ props.item.PART }}</td>
        <td>{{ props.item.SEQNUM }}</td>
        <td>{{ props.item.WORD }}</td>
        <td>{{ props.item.NOTE }}</td>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { inject } from 'vue-typescript-inject';
import { WordsUnitService } from '../view-models/words-unit.service';

@Component
export default class WordsUnit extends Vue {
  @inject() readonly wordsUnitService!: WordsUnitService;

  headers = [
    { text: 'ID', sortable: false, value: 'ID' },
    { text: 'UNIT', sortable: false, value: 'UNIT' },
    { text: 'PART', sortable: false, value: 'PART' },
    { text: 'SEQNUM', sortable: false, value: 'SEQNUM' },
    { text: 'WORD', sortable: false, value: 'WORD' },
    { text: 'NOTE', sortable: false, value: 'NOTE' },
  ];
  newWord!: string;

  mounted() {
    this.wordsUnitService.getData();
  }

  get unitWords() {
    return this.wordsUnitService.unitWords;
  }
}
</script>
