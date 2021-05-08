<template>
  <div>
    <v-text-field label="ID" type="text" v-model="item.ID" disabled></v-text-field>
    <v-text-field label="TEXTBOOK" type="text" v-model="item.TEXTBOOKNAME" disabled></v-text-field>
    <v-select label="UNIT" :items="settingsService.units" item-text="label" item-value="value" v-model="item.UNIT"></v-select>
    <v-select label="PART" :items="settingsService.parts" item-text="label" item-value="value" v-model="item.PART"></v-select>
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
  import { SettingsService } from '@/view-models/misc/settings.service';
  import { MUnitPhrase } from '@/models/wpp/unit-phrase';
  import { PhrasesUnitService } from '@/view-models/wpp/phrases-unit.service';

  @Component
  export default class PhrasesTextbookDetail extends Vue {
    @inject() phrasesUnitService!: PhrasesUnitService;
    @inject() settingsService!: SettingsService;

    item!: MUnitPhrase;

    created() {
      const id = +this.$route.params['id'];
      this.item = this.phrasesUnitService.textbookPhrases.find(value => value.ID === id)!;
    }

    goBack(): void {
      this.$router.go(-1);
    }

    save(): void {
      this.item.PHRASE = this.settingsService.autoCorrectInput(this.item.PHRASE);
      this.phrasesUnitService.update(this.item).subscribe(_ => this.goBack());
    }
  }
</script>

<style>
  @import '../../assets/common.css';
</style>
