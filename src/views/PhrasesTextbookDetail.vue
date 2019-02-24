<template>
  <div>
    <v-text-field label="ID" type="text" v-model="item.ID" disabled></v-text-field>
    <v-text-field label="TEXTBOOK" type="text" v-model="item.TEXTBOOKNAME" disabled></v-text-field>
    <v-select label="UNIT" :items="units" item-text="label" item-value="value" v-model="item.UNIT"></v-select>
    <v-select label="PART" :items="parts" item-text="label" item-value="value" v-model="item.PART"></v-select>
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
import { PhrasesTextbookService } from '@/view-models/phrases-textbook.service';
import { TextbookPhrase } from '@/models/textbook-phrase';
import { SettingsService } from '@/view-models/settings.service';

@Component
export default class PhrasesTextbookDetail extends Vue {
  @inject() phrasesTextbookService!: PhrasesTextbookService;
  @inject() settingsService!: SettingsService;

  item!: TextbookPhrase;
  units!: Array<{ label: string; value: number; }>;
  parts!: Array<{ label: string; value: number; }>;

  created() {
    const id = +this.$route.params['id'];
    this.item = this.phrasesTextbookService.textbookPhrases.find(value => value.ID === id)!;
    this.units = this.item.units.map((v, i) => ({label: v, value: i + 1}));
    this.parts = this.item.parts.map((v, i) => ({label: v, value: i + 1}));
  }

  goBack(): void {
    this.$router.go(-1);
  }

  save(): void {
    this.item.PHRASE = this.settingsService.autoCorrectInput(this.item.PHRASE);
  }
}
</script>

<style>
  @import '../assets/common.css';
</style>
