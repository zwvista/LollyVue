<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="phrasesUnitService.unitPhrases"
      hide-actions
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <td>{{ props.item.ID }}</td>
        <td>{{ props.item.UNIT }}</td>
        <td>{{ props.item.PART }}</td>
        <td>{{ props.item.SEQNUM }}</td>
        <td>{{ props.item.PHRASE }}</td>
        <td>{{ props.item.TRANSLATION }}</td>
        <td>
          <v-btn color="error">Delete</v-btn>
          <v-btn color="info">Edit</v-btn>
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { inject } from 'vue-typescript-inject';
import { PhrasesUnitService } from '../view-models/phrases-unit.service';

@Component
export default class PhrasesUnit extends Vue {
  @inject() phrasesUnitService: PhrasesUnitService;

  headers = [
    { text: 'ID', sortable: false, value: 'ID' },
    { text: 'UNIT', sortable: false, value: 'UNIT' },
    { text: 'PART', sortable: false, value: 'PART' },
    { text: 'SEQNUM', sortable: false, value: 'SEQNUM' },
    { text: 'PHRASE', sortable: false, value: 'PHRASE' },
    { text: 'TRANSLATION', sortable: false, value: 'TRANSLATION' },
    { text: 'ACTIONS', sortable: false },
  ];
  newWord!: string;

  services = {};
  created() {
    this.$set(this.services, 'phrasesUnitService', this.phrasesUnitService);
    this.phrasesUnitService.getData().subscribe();
  }
}
</script>
