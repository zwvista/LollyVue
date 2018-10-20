<template>
  <div>
    <v-text-field label="ID" type="text" v-model="unitPhrase.ID" disabled></v-text-field>
    <v-text-field label="UNIT" type="text" v-model="unitPhrase.UNIT"></v-text-field>
    <v-text-field label="PART" type="text" v-model="unitPhrase.PART"></v-text-field>
    <v-text-field label="SEQNUM" type="text" v-model="unitPhrase.SEQNUM"></v-text-field>
    <v-text-field label="PHRASE" type="text" v-model="unitPhrase.PHRASE"></v-text-field>
    <v-text-field label="TRANSLATION" type="text" v-model="unitPhrase.TRANSLATION"></v-text-field>
    <v-btn @click="goBack()">Back</v-btn>
    <v-btn @click="save()">Save</v-btn>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { inject } from 'vue-typescript-inject';
import { PhrasesUnitService } from '../view-models/phrases-unit.service';
import { UnitPhrase } from '../models/unit-phrase';

@Component
export default class PhrasesUnitDetail extends Vue {
  @inject() phrasesUnitService!: PhrasesUnitService;

  unitPhrase!: UnitPhrase;

  created() {
    const id = +this.$route.params['id'];
    const o = this.phrasesUnitService.unitPhrases.find(value => value.ID === id);
    this.unitPhrase = o ? {...o} : this.phrasesUnitService.newUnitPhrase();
  }

  goBack(): void {
    this.$router.go(-1);
  }

  save(): void {
    if (this.unitPhrase.ID) {
      this.phrasesUnitService.update(this.unitPhrase).subscribe(_ => this.goBack());
    } else {
      this.phrasesUnitService.create(this.unitPhrase).subscribe(_ => this.goBack());
    }
  }
}
</script>

<style>
  .v-btn {
    margin-right: 0;
  }
</style>
