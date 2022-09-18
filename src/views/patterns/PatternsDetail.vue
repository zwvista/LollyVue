<template>
  <div>
    <v-text-field label="ID" type="text" v-model="pattern.ID" disabled></v-text-field>
    <v-text-field label="PATTERN" type="text" v-model="pattern.PATTERN"></v-text-field>
    <v-text-field label="NOTE" type="text" v-model="pattern.NOTE"></v-text-field>
    <v-text-field label="TAGS" type="text" v-model="pattern.TAGS"></v-text-field>
    <v-btn color="info" @click="goBack()">Back</v-btn>
    <v-btn color="info" @click="save()">Save</v-btn>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { inject } from 'vue-typescript-inject';
  import { SettingsService } from '@/view-models/misc/settings.service';
  import { MPattern } from '@/models/wpp/pattern';
  import { PatternsService } from '@/view-models/wpp/patterns.service';

  @Component
  export default class PatternDetail extends Vue {
    @inject() patternsService!: PatternsService;
    @inject() settingsService!: SettingsService;

    pattern!: MPattern;

    created() {
      const id = +this.$route.params['id'];
      const o = this.patternsService.patterns.find(value => value.ID === id);
      this.pattern = o ? {...o} as MPattern : this.patternsService.newPattern();
    }

    goBack() {
      this.$router.go(-1);
    }

    async save() {
      this.pattern.PATTERN = this.settingsService.autoCorrectInput(this.pattern.PATTERN);
      if (this.pattern.ID) {
        await this.patternsService.update(this.pattern); this.goBack();
      } else {
        await this.patternsService.create(this.pattern); this.goBack();
      }
    }
  }
</script>

<style>
  @import '../../assets/common.css';
</style>
