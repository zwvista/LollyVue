<template>
  <div>
    <v-text-field label="ID" type="text" v-model="item.ID" disabled></v-text-field>
    <v-select label="UNIT" :items="settingsService.units" item-text="label" item-value="value" v-model="item.UNIT"></v-select>
    <v-select label="PART" :items="settingsService.parts" item-text="label" item-value="value" v-model="item.PART"></v-select>
    <v-text-field label="SEQNUM" type="text" v-model="item.SEQNUM"></v-text-field>
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
  import { WordsUnitService } from '@/shared/view-models/wpp/words-unit.service';
  import { MUnitWord } from '@/shared/models/wpp/unit-word';
  import { SettingsService } from '@/shared/view-models/misc/settings.service';
  import { container } from 'tsyringe';

  @Component
  export default class WordsUnitDetail extends Vue {
    wordsUnitService = container.resolve(WordsUnitService);
    settingsService = container.resolve(SettingsService);

    item!: MUnitWord;

    created() {
      const id = +this.$route.params['id'];
      const o = this.wordsUnitService.unitWords.find(value => value.ID === id);
      this.item = o || this.wordsUnitService.newUnitWord();
    }

    goBack() {
      this.$router.go(-1);
    }

    async save() {
      this.item.WORD = this.settingsService.autoCorrectInput(this.item.WORD);
      if (this.item.ID) {
        await this.wordsUnitService.update(this.item); this.goBack();
      } else {
        await this.wordsUnitService.create(this.item); this.goBack();
      }
    }
  }
</script>

<style>
  @import '../../assets/common.css';
</style>
