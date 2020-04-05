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
                :options="settingsService.dictsReference.map(o => {return {label:o.DICTNAME, value:o};})">
      </q-select>
    </div>
    <div class="row mb-2">
      <label for="dictNote" class="col-2 control-label">Dictionary(Note):</label>
      <q-select id="dictNote" class="col-4 form-control" :value="settingsService.selectedDictNote" @change="onDictNoteChange($event)"
                :options="settingsService.dictsNote.map(o => {return {label:o.DICTNAME, value:o};})">
      </q-select>
    </div>
    <div class="row mb-2">
      <label for="dictTranslation" class="col-2 control-label">Dictionary(Translation):</label>
      <q-select id="dictTranslation" class="col-4 form-control" :value="settingsService.selectedDictTranslation" @change="onDictTranslationChange($event)"
                :options="settingsService.dictsTranslation.map(o => {return {label:o.DICTNAME, value:o};})">
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
  import { inject } from 'vue-typescript-inject';
  import { SettingsListener, SettingsService } from '@/view-models/settings.service';
  import { MLanguage } from '@/models/language';
  import { MDictionary } from '@/models/dictionary';
  import { MTextbook } from '@/models/textbook';
  import { MVoice } from '@/models/voice';

  @Component
  export default class Settings2 extends Vue implements SettingsListener {
    @inject() settingsService!: SettingsService;

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
    created() {
      this.$set(this.services, 'settingsService', this.settingsService);
      this.settingsService.settingsListener = this;
      this.settingsService.getData().subscribe();
    }

    onLangChange(value: MLanguage) {
      this.settingsService.setSelectedLang(value).subscribe();
      this.settingsService.updateLang().subscribe();
    }

    onVoiceChange(value: MVoice) {
      this.settingsService.selectedVoice = value;
      this.settingsService.updateVoice().subscribe();
    }

    onDictReferenceChange(value: MDictionary) {
      this.settingsService.selectedDictReference = value;
      this.settingsService.updateDictReference().subscribe();
    }

    onDictNoteChange(value: MDictionary) {
      this.settingsService.selectedDictNote = value;
      this.settingsService.updateDictNote().subscribe();
    }

    onDictTranslationChange(value: MDictionary) {
      this.settingsService.selectedDictTranslation = value;
      this.settingsService.updateDictTranslation().subscribe();
    }

    onTextbookChange(value: MTextbook) {
      this.settingsService.selectedTextbook = value;
      this.settingsService.updateTextbook().subscribe();
    }

    onUnitFromChange(value: number) {
      this.settingsService.updateUnitFrom(value).subscribe();
    }

    onPartFromChange(value: number) {
      this.settingsService.updatePartFrom(value).subscribe();
    }

    onToTypeChange(value: number) {
      this.settingsService.updateToType(value).subscribe();
    }

    previousUnitPart() {
      this.settingsService.previousUnitPart().subscribe();
    }

    nextUnitPart() {
      this.settingsService.nextUnitPart().subscribe();
    }

    onUnitToChange(value: number) {
      this.settingsService.updateUnitTo(value).subscribe();
    }

    onPartToChange(value: number) {
      this.settingsService.updateUnitTo(value).subscribe();
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