<template>
  <div>
    <v-text-field label="ID" type="text" v-model="textbookWord.ID" disabled></v-text-field>
    <v-select label="UNIT" :items="textbooks" item-text="label" item-value="value" v-model="textbookWord.UNIT"></v-select>
    <v-select label="PART" :items="parts" item-text="label" item-value="value" v-model="textbookWord.PART"></v-select>
    <v-text-field label="SEQNUM" type="text" v-model="textbookWord.SEQNUM"></v-text-field>
    <v-text-field label="WORD" type="text" v-model="textbookWord.WORD"></v-text-field>
    <v-text-field label="NOTE" type="text" v-model="textbookWord.NOTE"></v-text-field>
    <v-btn color="info" @click="goBack()">Back</v-btn>
    <v-btn color="info" @click="save()">Save</v-btn>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { inject } from 'vue-typescript-inject';
import { WordsTextbookService } from '../view-models/words-textbook.service';
import { TextbookWord } from '../models/textbook-word';
import { SettingsService } from '@/view-models/settings.service';

@Component
export default class WordsTextbookDetail extends Vue {
  @inject() wordsTextbookService!: WordsTextbookService;
  @inject() settingsService!: SettingsService;

  textbookWord!: TextbookWord;
  textbooks!: Array<{ label: string; value: number; }>;
  parts!: Array<{ label: string; value: number; }>;

  created() {
    const id = +this.$route.params['id'];
    const o = this.wordsTextbookService.textbookWords.find(value => value.ID === id);
    this.textbookWord = o ? {...o} as TextbookWord : this.wordsTextbookService.newTextbookWord();
    this.textbooks = this.settingsService.textbooks.map(v => ({label: v, value: Number(v)}));
    this.parts = this.settingsService.parts.map((v, i) => ({label: v, value: i + 1}));
  }

  goBack(): void {
    this.$router.go(-1);
  }

  save(): void {
    this.textbookWord.WORD = this.settingsService.autoCorrectInput(this.textbookWord.WORD);
    if (this.textbookWord.ID) {
      this.wordsTextbookService.update(this.textbookWord).subscribe(_ => this.goBack());
    } else {
      this.wordsTextbookService.create(this.textbookWord).subscribe(_ => this.goBack());
    }
  }
}
</script>

<style>
  @import '../assets/common.css';
</style>
