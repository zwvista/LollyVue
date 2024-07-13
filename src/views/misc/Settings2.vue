<template>
  <div class="container">
    <div class="row mb-2">
      <label for="lang" class="col-2 control-label">Language:</label>
      <q-select id="lang" class="col-4 form-control" :value="settingsService.selectedLang" @change="onLangChange($event)"
                :options="settingsService.languages.map(o => {return {label:o.NAME, value:o};})">
      </q-select>
    </div>
    <div class="row mb-2">
      <label for="voice" class="col-2 control-label">Voice:</label>
      <q-select id="voice" class="col-4 form-control" :value="settingsService.selectedVoice" @change="onVoiceChange($event)"
                :options="settingsService.voices.map(o => {return {label:o.VOICENAME, value:o};})">
      </q-select>
    </div>
    <div class="row mb-2">
      <label for="dictReference" class="col-2 control-label">Dictionary(Reference):</label>
      <q-select id="dictReference" class="col-4 form-control" :value="settingsService.selectedDictReference" @change="onDictReferenceChange($event)"
                :options="settingsService.dictsReference.map(o => {return {label:o.NAME, value:o};})">
      </q-select>
    </div>
    <div class="row mb-2">
      <label for="dictNote" class="col-2 control-label">Dictionary(Note):</label>
      <q-select id="dictNote" class="col-4 form-control" :value="settingsService.selectedDictNote" @change="onDictNoteChange($event)"
                :options="settingsService.dictsNote.map(o => {return {label:o.NAME, value:o};})">
      </q-select>
    </div>
    <div class="row mb-2">
      <label for="dictTranslation" class="col-2 control-label">Dictionary(Translation):</label>
      <q-select id="dictTranslation" class="col-4 form-control" :value="settingsService.selectedDictTranslation" @change="onDictTranslationChange($event)"
                :options="settingsService.dictsTranslation.map(o => {return {label:o.NAME, value:o};})">
      </q-select>
    </div>
    <div class="row mb-2">
      <label for="textbook" class="col-2 control-label">Textbook:</label>
      <q-select id="textbook" class="col-4 form-control" :value="settingsService.selectedTextbook" @change="onTextbookChange($event)"
                :options="settingsService.textbooks.map(o => {return {label:o.NAME, value:o};})">
      </q-select>
    </div>
    <div class="row mb-2">
      <label for="unitFrom" class="col-2 control-label">Unit:</label>
      <q-select id="unitFrom" class="col-2 form-control" :value="settingsService.USUNITFROM" @change="onUnitFromChange($event)"
                :options="settingsService.units">
      </q-select>
      <q-select id="partFrom" class="col-2 form-control" :readonly="toTypeIsUnit" :disabled="toTypeIsUnit" :value="settingsService.USPARTFROM" @change="onPartFromChange($event)"
                :options="settingsService.parts">
      </q-select>
    </div>
    <div class="row mb-2">
      <q-select id="toType" class="col-1 form-control" v-model="settingsService.toType" @change="onToTypeChange($event)"
                :options="settingsService.toTypes">
      </q-select>
      <label class="col-1 control-label">
      </label>
      <q-select id="unitTo" class="col-2 form-control" :readonly="!toTypeIsTo" :disabled="!toTypeIsTo" :value="settingsService.USUNITTO" @change="onUnitToChange($event)"
                :options="settingsService.units">
      </q-select>
      <q-select id="partTo" class="col-2 form-control" :readonly="!toTypeIsTo" :disabled="!toTypeIsTo" :value="settingsService.USPARTTO" @change="onPartToChange($event)"
                :options="settingsService.parts">
      </q-select>
    </div>
    <div class="row mb-2">
      <label class="col-2 control-label"></label>
      <q-btn class="mr-2" color="primary" :readonly="toTypeIsTo" :disabled="toTypeIsTo" @click="previousUnitPart()" label="Previous"></q-btn>
      <q-btn class="mr-2" color="primary" :readonly="toTypeIsTo" :disabled="toTypeIsTo" @click="nextUnitPart()" label="Next"></q-btn>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { SettingsListener, SettingsService } from '@/view-models/misc/settings.service';
  import { MLanguage } from '@/models/misc/language';
  import { MDictionary } from '@/models/misc/dictionary';
  import { MTextbook } from '@/models/misc/textbook';
  import { MVoice } from '@/models/misc/voice';
  import { container } from 'tsyringe';

  @Component
  export default class Settings2 extends Vue implements SettingsListener {
    settingsService: SettingsService = container.resolve(SettingsService);

    get toTypeIsUnit() {
      return this.settingsService.toType === 0;
    }
    get toTypeIsPart() {
      return this.settingsService.toType === 1;
    }
    get toTypeIsTo() {
      return this.settingsService.toType === 2;
    }

    services = {};
    async created() {
      this.$set(this.services, 'settingsService', this.settingsService);
      this.settingsService.settingsListener = this;
      await this.settingsService.getData();
    }

    async onLangChange(value: MLanguage) {
      this.settingsService.selectedLang = value;
      await this.settingsService.updateLang();
    }

    async onVoiceChange(value: MVoice) {
      this.settingsService.selectedVoice = value;
      await this.settingsService.updateVoice();
    }

    async onDictReferenceChange(value: MDictionary) {
      this.settingsService.selectedDictReference = value;
      await this.settingsService.updateDictReference();
    }

    async onDictNoteChange(value: MDictionary) {
      this.settingsService.selectedDictNote = value;
      await this.settingsService.updateDictNote();
    }

    async onDictTranslationChange(value: MDictionary) {
      this.settingsService.selectedDictTranslation = value;
      await this.settingsService.updateDictTranslation();
    }

    async onTextbookChange(value: MTextbook) {
      this.settingsService.selectedTextbook = value;
      await this.settingsService.updateTextbook();
    }

    async onUnitFromChange(value: number) {
      await this.settingsService.updateUnitFrom(value);
    }

    async onPartFromChange(value: number) {
      await this.settingsService.updatePartFrom(value);
    }

    async onToTypeChange(value: number) {
      await this.settingsService.updateToType(value);
    }

    async previousUnitPart() {
      await this.settingsService.previousUnitPart();
    }

    async nextUnitPart() {
      await this.settingsService.nextUnitPart();
    }

    async onUnitToChange(value: number) {
      await this.settingsService.updateUnitTo(value);
    }

    async onPartToChange(value: number) {
      await this.settingsService.updateUnitTo(value);
    }

    onGetData(): void {
    }

    onUpdateDictReference(): void {
    }

    onUpdateDictNote(): void {
    }

    onUpdateDictTranslation(): void {
    }

    onUpdateLang(): void {
    }

    onUpdatePartFrom(): void {
    }

    onUpdatePartTo(): void {
    }

    onUpdateTextbook(): void {
    }

    onUpdateUnitFrom(): void {
    }

    onUpdateUnitTo(): void {
    }

    onUpdateVoice(): void {
    }
  }
</script>

<style>

.form-inline label{
  justify-content: left;
}

</style>
