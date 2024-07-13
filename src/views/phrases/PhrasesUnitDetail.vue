<template>
  <div>
    <v-text-field label="ID" type="text" v-model="item.ID" disabled></v-text-field>
    <v-select label="UNIT" :items="settingsService.units" item-text="label" item-value="value" v-model="item.UNIT"></v-select>
    <v-select label="PART" :items="settingsService.parts" item-text="label" item-value="value" v-model="item.PART"></v-select>
    <v-text-field label="SEQNUM" type="text" v-model="item.SEQNUM"></v-text-field>
    <v-text-field label="PHRASEID" type="text" v-model="item.PHRASEID" disabled></v-text-field>
    <v-text-field label="PHRASE" type="text" v-model="item.PHRASE"></v-text-field>
    <v-text-field label="TRANSLATION" type="text" v-model="item.TRANSLATION"></v-text-field>
    <v-btn color="info" @click="goBack()">Back</v-btn>
    <v-btn color="info" @click="save()">Save</v-btn>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { PhrasesUnitService } from '@/view-models/wpp/phrases-unit.service';
  import { MUnitPhrase } from '@/models/wpp/unit-phrase';
  import { SettingsService } from '@/view-models/misc/settings.service';
  import { container } from 'tsyringe';

  @Component
  export default class PhrasesUnitDetail extends Vue {
    phrasesUnitService: PhrasesUnitService = container.resolve(PhrasesUnitService);
    settingsService: SettingsService = container.resolve(SettingsService);

    item!: MUnitPhrase;

    created() {
      const id = +this.$route.params['id'];
      const o = this.phrasesUnitService.unitPhrases.find(value => value.ID === id);
      this.item = o ? {...o} as MUnitPhrase : this.phrasesUnitService.newUnitPhrase();
    }

    goBack() {
      this.$router.go(-1);
    }

    async save() {
      this.item.PHRASE = this.settingsService.autoCorrectInput(this.item.PHRASE);
      if (this.item.ID) {
        await this.phrasesUnitService.update(this.item); this.goBack();
      } else {
        await this.phrasesUnitService.create(this.item); this.goBack();
      }
    }
  }
</script>

<style>
  @import '../../assets/common.css';
</style>
