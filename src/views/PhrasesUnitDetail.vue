<template>
  <div>
    <v-text-field label="ID" type="text" v-model="unitPhrase.ID" disabled></v-text-field>
    <v-select label="UNIT" :items="units" item-text="label" item-value="value" v-model="unitWord.UNIT"></v-select>
    <v-select label="PART" :items="parts" item-text="label" item-value="value" v-model="unitWord.PART"></v-select>
    <v-text-field label="PHRASE" type="text" v-model="unitPhrase.PHRASE"></v-text-field>
    <v-text-field label="TRANSLATION" type="text" v-model="unitPhrase.TRANSLATION"></v-text-field>
    <v-btn color="info" @click="goBack()">Back</v-btn>
    <v-btn color="info" @click="save()">Save</v-btn>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { inject } from 'vue-typescript-inject';
import { PhrasesUnitService } from '../view-models/phrases-unit.service';
import { UnitPhrase } from '../models/unit-phrase';
import { SettingsService } from '@/view-models/settings.service';

@Component
export default class PhrasesUnitDetail extends Vue {
  @inject() phrasesUnitService!: PhrasesUnitService;
  @inject() settingsService!: SettingsService;

  unitPhrase!: UnitPhrase;
  units!: Array<{ label: string; value: number; }>;
  parts!: Array<{ label: string; value: number; }>;

  created() {
    const id = +this.$route.params['id'];
    const o = this.phrasesUnitService.unitPhrases.find(value => value.ID === id);
    this.unitPhrase = o ? {...o} as UnitPhrase : this.phrasesUnitService.newUnitPhrase();
    this.units = this.settingsService.units.map(v => ({label: v, value: Number(v)}));
    this.parts = this.settingsService.parts.map((v, i) => ({label: v, value: i + 1}));
  }

  goBack(): void {
    this.$router.go(-1);
  }

  save(): void {
    this.unitPhrase.PHRASE = this.settingsService.autoCorrectInput(this.unitPhrase.PHRASE);
    if (this.unitPhrase.ID) {
      this.phrasesUnitService.update(this.unitPhrase).subscribe(_ => this.goBack());
    } else {
      this.phrasesUnitService.create(this.unitPhrase).subscribe(_ => this.goBack());
    }
  }
}
</script>

<style>
  @import '../assets/common.css';
</style>
