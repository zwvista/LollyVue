<template>
  <div>
    <v-text-field label="ID" type="text" v-model="item.ID" disabled></v-text-field>
    <v-text-field label="TEXTBOOK" type="text" v-model="item.TEXTBOOKNAME" disabled></v-text-field>
    <v-select label="UNIT" :items="settingsService.units" item-text="label" item-value="value" v-model="item.UNIT"></v-select>
    <v-select label="PART" :items="settingsService.parts" item-text="label" item-value="value" v-model="item.PART"></v-select>
    <v-text-field label="SEQNUM" type="text" v-model="item.SEQNUM"></v-text-field>
    <v-text-field label="ID" type="text" v-model="item.ID" disabled></v-text-field>
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
  import { WordsTextbookService } from '@/view-models/words-textbook.service';
  import { MTextbookWord } from '@/models/textbook-word';
  import { SettingsService } from '@/view-models/settings.service';

  @Component
  export default class WordsTextbookDetail extends Vue {
    @inject() wordsTextbookService!: WordsTextbookService;
    @inject() settingsService!: SettingsService;

    item!: MTextbookWord;

    created() {
      const id = +this.$route.params['id'];
      this.item = this.wordsTextbookService.textbookWords.find(value => value.ID === id)!;
    }

    goBack(): void {
      this.$router.go(-1);
    }

    save(): void {
      this.item.WORD = this.settingsService.autoCorrectInput(this.item.WORD);
    }
  }
</script>

<style>
  @import '../assets/common.css';
</style>
