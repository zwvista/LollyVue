<template>
  <div>
    <v-text-field label="ID" type="text" v-model="langPhrase.ID" disabled></v-text-field>
    <v-text-field label="PHRASE" type="text" v-model="langPhrase.PHRASE"></v-text-field>
    <v-text-field label="TRANSLATION" type="text" v-model="langPhrase.TRANSLATION"></v-text-field>
    <v-btn color="info" @click="goBack()">Back</v-btn>
    <v-btn color="info" @click="save()">Save</v-btn>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { inject } from 'vue-typescript-inject';
import { PhrasesLangService } from '../view-models/phrases-lang.service';
import { LangPhrase } from '../models/lang-phrase';

@Component
export default class PhrasesLangDetail extends Vue {
  @inject() phrasesLangService!: PhrasesLangService;

  langPhrase!: LangPhrase;

  created() {
    const id = +this.$route.params['id'];
    const o = this.phrasesLangService.langPhrases.find(value => value.ID === id);
    this.langPhrase = o ? {...o} as LangPhrase : this.phrasesLangService.newLangPhrase();
  }

  goBack(): void {
    this.$router.go(-1);
  }

  save(): void {
    if (this.langPhrase.ID) {
      this.phrasesLangService.update(this.langPhrase).subscribe(_ => this.goBack());
    } else {
      this.phrasesLangService.create(this.langPhrase).subscribe(_ => this.goBack());
    }
  }
}
</script>

<style>
  @import '../assets/common.css';
</style>
