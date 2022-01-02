<template>
  <div>
    <v-text-field label="ID" type="text" v-model="item.ID" disabled></v-text-field>
    <v-text-field label="WORD" type="text" v-model="item.WORD"></v-text-field>
    <v-text-field label="NOTE" type="text" v-model="item.NOTE"></v-text-field>
    <v-text-field label="FAMIID" type="text" v-model="item.FAMIID" disabled></v-text-field>
    <v-text-field label="ACCURACY" type="text" v-model="item.ACCURACY" disabled></v-text-field>
    <v-btn color="info" @click="goBack()">Back</v-btn>
    <v-btn color="info" @click="save()">Save</v-btn>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { inject } from 'vue-typescript-inject';
  import { WordsLangService } from '@/view-models/wpp/words-lang.service';
  import { MLangWord } from '@/models/wpp/lang-word';
  import { SettingsService } from '@/view-models/misc/settings.service';

  @Component
  export default class WordsLangDetail extends Vue {
    @inject() wordsLangService!: WordsLangService;
    @inject() settingsService!: SettingsService;

    item!: MLangWord;

    created() {
      const id = +this.$route.params['id'];
      const o = this.wordsLangService.langWords.find(value => value.ID === id);
      this.item = o || this.wordsLangService.newLangWord();
    }

    goBack() {
      this.$router.go(-1);
    }

    async save() {
      this.item.WORD = this.settingsService.autoCorrectInput(this.item.WORD);
      if (this.item.ID) {
        await this.wordsLangService.update(this.item); this.goBack();
      } else {
        await this.wordsLangService.create(this.item); this.goBack();
      }
    }
  }
</script>

<style>
  @import '../../assets/common.css';
</style>
