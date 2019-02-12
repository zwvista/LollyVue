<template>
  <div>
    <v-text-field label="ID" type="text" v-model="unitWord.ID" disabled></v-text-field>
    <v-select label="UNIT" :items="units" item-text="label" item-value="value" v-model="unitWord.UNIT"></v-select>
    <v-select label="PART" :items="parts" item-text="label" item-value="value" v-model="unitWord.PART"></v-select>
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
import { SettingsService } from '@/view-models/settings.service';

@Component
export default class WordsUnitDetail extends Vue {
  @inject() wordsUnitService!: WordsUnitService;
  @inject() settingsService!: SettingsService;

  unitWord!: UnitWord;
  units!: Array<{ label: string; value: number; }>;
  parts!: Array<{ label: string; value: number; }>;

  created() {
    const id = +this.$route.params['id'];
    const o = this.wordsUnitService.unitWords.find(value => value.ID === id);
    this.unitWord = o ? {...o} as UnitWord : this.wordsUnitService.newUnitWord();
    this.units = this.settingsService.units.map(v => ({label: v, value: Number(v)}));
    this.parts = this.settingsService.parts.map((v, i) => ({label: v, value: i + 1}));
  }

  goBack(): void {
    this.$router.go(-1);
  }

  save(): void {
    this.unitWord.WORD = this.settingsService.autoCorrectInput(this.unitWord.WORD);
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
