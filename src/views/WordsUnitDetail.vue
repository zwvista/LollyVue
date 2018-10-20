<template>
  <div>
    <v-text-field label="ID" id="id" type="text" v-model="unitWord.ID" disabled></v-text-field>
    <v-text-field label="UNIT" id="unit" type="text" v-model="unitWord.UNIT"></v-text-field>
    <v-text-field label="PART" id="part" type="text" v-model="unitWord.PART"></v-text-field>
    <v-text-field label="SEQNUM" id="seqnum" type="text" v-model="unitWord.SEQNUM"></v-text-field>
    <v-text-field label="WORD" id="word" type="text" v-model="unitWord.WORD"></v-text-field>
    <v-text-field label="NOTE" id="note" type="text" v-model="unitWord.NOTE"></v-text-field>
    <v-btn @click="goBack()">Back</v-btn>
    <v-btn @click="save()">Save</v-btn>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { inject } from 'vue-typescript-inject';
import { WordsUnitService } from '../view-models/words-unit.service';
import { UnitWord } from '../models/unit-word';

@Component
export default class WordsUnitDetail extends Vue {
  @inject() wordsUnitService!: WordsUnitService;

  unitWord!: UnitWord;

  created() {
    const id = +this.$route.params['id'];
    const o = this.wordsUnitService.unitWords.find(value => value.ID === id);
    this.unitWord = o ? {...o} : this.wordsUnitService.newUnitWord();
  }

  goBack(): void {
    this.$router.go(-1);
  }

  save(): void {
    if (this.unitWord.ID) {
      this.wordsUnitService.update(this.unitWord).subscribe(_ => this.goBack());
    } else {
      this.wordsUnitService.create(this.unitWord).subscribe(_ => this.goBack());
    }
  }
}
</script>

<style>
  .v-btn {
    margin-right: 0;
  }
</style>
