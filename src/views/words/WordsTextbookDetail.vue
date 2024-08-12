<template>
  <div>
    <v-text-field label="ID" type="text" v-model="item.ID" disabled></v-text-field>
    <v-text-field label="TEXTBOOK" type="text" v-model="item.TEXTBOOKNAME" disabled></v-text-field>
    <v-select label="UNIT" :items="settingsService.units" item-text="label" item-value="value" v-model="item.UNIT"></v-select>
    <v-select label="PART" :items="settingsService.parts" item-text="label" item-value="value" v-model="item.PART"></v-select>
    <v-text-field label="SEQNUM" type="text" v-model="item.SEQNUM"></v-text-field>
    <v-text-field label="WORDID" type="text" v-model="item.WORDID" disabled></v-text-field>
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
  import { SettingsService } from '@/view-models/misc/settings.service';
  import { MUnitWord } from '@/models/wpp/unit-word';
  import { WordsUnitService } from '@/view-models/wpp/words-unit.service';
  import { container } from 'tsyringe';

  @Component
  export default class WordsTextbookDetail extends Vue {
    wordsUnitService = container.resolve(WordsUnitService);
    settingsService = container.resolve(SettingsService);

    item!: MUnitWord;

    created() {
      const id = +this.$route.params['id'];
      this.item = this.wordsUnitService.textbookWords.find(value => value.ID === id)!;
    }

    goBack() {
      this.$router.go(-1);
    }

    save() {
      this.item.WORD = this.settingsService.autoCorrectInput(this.item.WORD);
      this.wordsUnitService.update(this.item);
    }
  }
</script>

<style>
  @import '../../assets/common.css';
</style>
