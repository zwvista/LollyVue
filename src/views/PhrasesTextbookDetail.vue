<template>
  <div>
    <v-text-field label="ID" type="text" v-model="textbookPhrase.ID" disabled></v-text-field>
    <v-select label="UNIT" :items="textbooks" item-text="label" item-value="value" v-model="textbookWord.UNIT"></v-select>
    <v-select label="PART" :items="parts" item-text="label" item-value="value" v-model="textbookWord.PART"></v-select>
    <v-text-field label="PHRASE" type="text" v-model="textbookPhrase.PHRASE"></v-text-field>
    <v-text-field label="TRANSLATION" type="text" v-model="textbookPhrase.TRANSLATION"></v-text-field>
    <v-btn color="info" @click="goBack()">Back</v-btn>
    <v-btn color="info" @click="save()">Save</v-btn>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { inject } from 'vue-typescript-inject';
import { PhrasesTextbookService } from '../view-models/phrases-textbook.service';
import { TextbookPhrase } from '../models/textbook-phrase';
import { SettingsService } from '@/view-models/settings.service';

@Component
export default class PhrasesTextbookDetail extends Vue {
  @inject() phrasesTextbookService!: PhrasesTextbookService;
  @inject() settingsService!: SettingsService;

  textbookPhrase!: TextbookPhrase;
  textbooks!: Array<{ label: string; value: number; }>;
  parts!: Array<{ label: string; value: number; }>;

  created() {
    const id = +this.$route.params['id'];
    const o = this.phrasesTextbookService.textbookPhrases.find(value => value.ID === id);
    this.textbookPhrase = o ? {...o} as TextbookPhrase : this.phrasesTextbookService.newTextbookPhrase();
    this.textbooks = this.settingsService.textbooks.map(v => ({label: v, value: Number(v)}));
    this.parts = this.settingsService.parts.map((v, i) => ({label: v, value: i + 1}));
  }

  goBack(): void {
    this.$router.go(-1);
  }

  save(): void {
    this.textbookPhrase.PHRASE = this.settingsService.autoCorrectInput(this.textbookPhrase.PHRASE);
    if (this.textbookPhrase.ID) {
      this.phrasesTextbookService.update(this.textbookPhrase).subscribe(_ => this.goBack());
    } else {
      this.phrasesTextbookService.create(this.textbookPhrase).subscribe(_ => this.goBack());
    }
  }
}
</script>

<style>
  @import '../assets/common.css';
</style>
