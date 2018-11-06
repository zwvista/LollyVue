<template>
  <div>
    <v-text-field label="ID" type="text" v-model="langWord.ID" disabled></v-text-field>
    <v-text-field label="WORD" type="text" v-model="langWord.WORD"></v-text-field>
    <v-text-field label="LEVEL" type="text" v-model="langWord.LEVEL"></v-text-field>
    <v-btn color="info" @click="goBack()">Back</v-btn>
    <v-btn color="info" @click="save()">Save</v-btn>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { inject } from 'vue-typescript-inject';
import { WordsLangService } from '../view-models/words-lang.service';
import { LangWord } from '../models/lang-word';

@Component
export default class WordsLangDetail extends Vue {
  @inject() wordsLangService!: WordsLangService;

  langWord!: LangWord;

  created() {
    const id = +this.$route.params['id'];
    const o = this.wordsLangService.langWords.find(value => value.ID === id);
    this.langWord = o ? {...o} as LangWord : this.wordsLangService.newLangWord();
  }

  goBack(): void {
    this.$router.go(-1);
  }

  save(): void {
    if (this.langWord.ID) {
      this.wordsLangService.update(this.langWord).subscribe(_ => this.goBack());
    } else {
      this.wordsLangService.create(this.langWord).subscribe(_ => this.goBack());
    }
  }
}
</script>

<style>
  @import '../assets/common.css';
</style>
