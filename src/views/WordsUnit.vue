<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="wordsUnitService.unitWords"
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
        <td>
          <v-btn icon color="error"><v-icon>fa-trash</v-icon></v-btn>
          <v-btn icon color="info"><v-icon>fa-edit</v-icon></v-btn>
        </td>
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
  @inject() wordsUnitService!: WordsUnitService;

  headers = [
    { text: 'ID', sortable: false, value: 'ID' },
    { text: 'UNIT', sortable: false, value: 'UNIT' },
    { text: 'PART', sortable: false, value: 'PART' },
    { text: 'SEQNUM', sortable: false, value: 'SEQNUM' },
    { text: 'WORD', sortable: false, value: 'WORD' },
    { text: 'NOTE', sortable: false, value: 'NOTE' },
    { text: 'ACTIONS', sortable: false },
  ];
  newWord!: string;

  services = {};
  created() {
    this.$set(this.services, 'wordsUnitService', this.wordsUnitService);
    this.wordsUnitService.getData().subscribe();
  }
}
</script>
