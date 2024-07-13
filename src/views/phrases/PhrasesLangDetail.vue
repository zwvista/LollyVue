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
  import { PhrasesLangService } from '@/view-models/wpp/phrases-lang.service';
  import { MLangPhrase } from '@/models/wpp/lang-phrase';
  import { SettingsService } from '@/view-models/misc/settings.service';
  import { container } from 'tsyringe';

  @Component
  export default class PhrasesLangDetail extends Vue {
    phrasesLangService: PhrasesLangService = container.resolve(PhrasesLangService);
    settingsService: SettingsService = container.resolve(SettingsService);

    langPhrase!: MLangPhrase;

    created() {
      const id = +this.$route.params['id'];
      const o = this.phrasesLangService.langPhrases.find(value => value.ID === id);
      this.langPhrase = o ? {...o} as MLangPhrase : this.phrasesLangService.newLangPhrase();
    }

    goBack() {
      this.$router.go(-1);
    }

    async save() {
      this.langPhrase.PHRASE = this.settingsService.autoCorrectInput(this.langPhrase.PHRASE);
      if (this.langPhrase.ID) {
        await this.phrasesLangService.update(this.langPhrase); this.goBack();
      } else {
        await this.phrasesLangService.create(this.langPhrase); this.goBack();
      }
    }
  }
</script>

<style>
  @import '../../assets/common.css';
</style>
