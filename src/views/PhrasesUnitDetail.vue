<template>
  <div>
    <v-text-field label="ID" type="text" v-model="item.ID" disabled></v-text-field>
    <v-select label="UNIT" :items="units" item-text="label" item-value="value" v-model="item.UNIT"></v-select>
    <v-select label="PART" :items="parts" item-text="label" item-value="value" v-model="item.PART"></v-select>
    <v-text-field label="SEQNUM" type="text" v-model="item.SEQNUM"></v-text-field>
    <v-text-field label="PHRASEID" type="text" v-model="item.PHRASEID" disabled></v-text-field>
    <v-text-field label="PHRASE" type="text" v-model="item.PHRASE"></v-text-field>
    <v-text-field label="TRANSLATION" type="text" v-model="item.TRANSLATION"></v-text-field>
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

  item!: UnitPhrase;
  units!: Array<{ label: string; value: number; }>;
  parts!: Array<{ label: string; value: number; }>;

  created() {
    const id = +this.$route.params['id'];
    this.item = this.phrasesUnitService.unitPhrases.find(value => value.ID === id)!;
    this.units = this.settingsService.units.map(v => ({label: v, value: Number(v)}));
    this.parts = this.settingsService.parts.map((v, i) => ({label: v, value: i + 1}));
  }

  goBack(): void {
    this.$router.go(-1);
  }

  save(): void {
    this.item.PHRASE = this.settingsService.autoCorrectInput(this.item.PHRASE);
    if (this.item.ID) {
      this.phrasesUnitService.update(this.item).subscribe(_ => this.goBack());
    } else {
      this.phrasesUnitService.create(this.item).subscribe(_ => this.goBack());
    }
  }
}
</script>

<style>
  @import '../assets/common.css';
</style>
