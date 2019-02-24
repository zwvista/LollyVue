<template>
  <div>
    <v-text-field label="ID" type="text" v-model="item.ID" disabled></v-text-field>
    <v-select label="UNIT" :items="units" item-text="label" item-value="value" v-model="item.UNIT"></v-select>
    <v-select label="PART" :items="parts" item-text="label" item-value="value" v-model="item.PART"></v-select>
    <v-text-field label="SEQNUM" type="text" v-model="item.SEQNUM"></v-text-field>
    <v-text-field label="WORD" type="text" v-model="item.WORD"></v-text-field>
    <v-text-field label="NOTE" type="text" v-model="item.NOTE"></v-text-field>
    <v-text-field label="FAMIID" type="text" v-model="item.FAMIID" disabled></v-text-field>
    <v-text-field label="LEVEL" type="text" v-model="item.LEVEL"></v-text-field>
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

  item!: UnitWord;
  units!: Array<{ label: string; value: number; }>;
  parts!: Array<{ label: string; value: number; }>;

  created() {
    const id = +this.$route.params['id'];
    const o = this.wordsUnitService.unitWords.find(value => value.ID === id);
    this.item = o ? {...o} as UnitWord : this.wordsUnitService.newUnitWord();
    this.units = this.settingsService.units.map((v, i) => ({label: v, value: i + 1}));
    this.parts = this.settingsService.parts.map((v, i) => ({label: v, value: i + 1}));
  }

  goBack(): void {
    this.$router.go(-1);
  }

  save(): void {
    this.item.WORD = this.settingsService.autoCorrectInput(this.item.WORD);
    if (this.item.ID) {
      this.wordsUnitService.update(this.item).subscribe(_ => this.goBack());
    } else {
      this.wordsUnitService.create(this.item).subscribe(_ => this.goBack());
    }
  }
}
</script>

<style>
  @import '../assets/common.css';
</style>
