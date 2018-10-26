<template>
  <div>
    <v-text-field label="ID" type="text" v-model="unitWord.ID" disabled></v-text-field>
    <v-text-field label="UNIT" type="text" v-model="unitWord.UNIT"></v-text-field>
    <v-text-field label="PART" type="text" v-model="unitWord.PART"></v-text-field>
    <v-text-field label="SEQNUM" type="text" v-model="unitWord.SEQNUM"></v-text-field>
    <v-text-field label="WORD" type="text" v-model="unitWord.WORD"></v-text-field>
    <v-text-field label="NOTE" type="text" v-model="unitWord.NOTE"></v-text-field>
    <v-btn color="info" @click="goBack()">Back</v-btn>
    <v-btn color="info" @click="save()">Save</v-btn>
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
    this.unitWord = o ? {...o} as UnitWord : this.wordsUnitService.newUnitWord();
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
  @import '../assets/common.css';
</style>
