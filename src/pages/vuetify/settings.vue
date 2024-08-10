<template>
  <div class="container">
    <div class="form-inline mb-2">
      <label for="lang" class="col-2 control-label">Language:</label>
      <b-form-select id="lang" class="col-4 form-control" :value="settingsService.selectedLang" @change="onLangChange($event)">
        <option v-for="o in settingsService.languages" :value="o" :key="o.ID">{{o.NAME}}</option>
      </b-form-select>
    </div>
    <div class="form-inline mb-2">
      <label for="voice" class="col-2 control-label">Voice:</label>
      <b-form-select id="voice" class="col-4 form-control" :value="settingsService.selectedVoice" @change="onVoiceChange($event)">
        <option v-for="o in settingsService.voices" :value="o" :key="o.ID">{{o.VOICENAME}}</option>
      </b-form-select>
    </div>
    <div class="form-inline mb-2">
      <label for="dictReference" class="col-2 control-label">Dictionary(Reference):</label>
      <b-form-select id="dictReference" class="col-4 form-control" :value="settingsService.selectedDictReference" @change="onDictReferenceChange($event)">
        <option v-for="o in settingsService.dictsReference" :value="o" :key="o.DICTID">{{o.NAME}}</option>
      </b-form-select>
    </div>
    <div class="form-inline mb-2">
      <label for="dictNote" class="col-2 control-label">Dictionary(Note):</label>
      <b-form-select id="dictNote" class="col-4 form-control" :value="settingsService.selectedDictNote" @change="onDictNoteChange($event)">
        <option v-for="o in settingsService.dictsNote" :value="o" :key="o.ID">{{o.NAME}}</option>
      </b-form-select>
    </div>
    <div class="form-inline mb-2">
      <label for="dictTranslation" class="col-2 control-label">Dictionary(Translation):</label>
      <b-form-select id="dictTranslation" class="col-4 form-control" :value="settingsService.selectedDictTranslation" @change="onDictTranslationChange($event)">
        <option v-for="o in settingsService.dictsTranslation" :value="o" :key="o.ID">{{o.NAME}}</option>
      </b-form-select>
    </div>
    <div class="form-inline mb-2">
      <label for="textbook" class="col-2 control-label">Textbook:</label>
      <b-form-select id="textbook" class="col-4 form-control" :value="settingsService.selectedTextbook" @change="onTextbookChange($event)">
        <option v-for="o in settingsService.textbooks" :value="o" :key="o.ID">{{o.NAME}}</option>
      </b-form-select>
    </div>
    <div class="form-inline mb-2">
      <label for="unitFrom" class="col-2 control-label">Unit:</label>
      <b-form-select id="unitFrom" class="col-2 form-control" :value="settingsService.USUNITFROM" @change="onUnitFromChange($event)">
        <option v-for="o in settingsService.units" :value="o.value" :key="o.value">{{o.label}}</option>
      </b-form-select>
      <b-form-select id="partFrom" class="col-2 form-control" :disabled="toTypeIsUnit" :value="settingsService.USPARTFROM" @change="onPartFromChange($event)">
        <option v-for="o in settingsService.parts" :value="o.value" :key="o.value">{{o.label}}</option>
      </b-form-select>
    </div>
    <div class="form-inline mb-2">
      <b-form-select id="toType" class="col-1 form-control" v-model="settingsService.toType" @change="onToTypeChange($event)">
        <option v-for="o in settingsService.toTypes" :value="o.value" :key="o.value">{{o.label}}</option>
      </b-form-select>
      <label class="col-1 control-label">
      </label>
      <b-form-select id="unitTo" class="col-2 form-control" :disabled="!toTypeIsTo" :value="settingsService.USUNITTO" @change="onUnitToChange($event)">
        <option v-for="o in settingsService.units" :value="o.value" :key="o.value">{{o.label}}</option>
      </b-form-select>
      <b-form-select id="partTo" class="col-2 form-control" :disabled="!toTypeIsTo" :value="settingsService.USPARTTO" @change="onPartToChange($event)">
        <option v-for="o in settingsService.parts" :value="o.value" :key="o.value">{{o.label}}</option>
      </b-form-select>
    </div>
    <div class="form-inline mb-2">
      <label class="col-2 control-label"></label>
      <button class="btn btn-primary mr-2" :disabled="toTypeIsTo" @click="previousUnitPart()">Previous</button>
      <button class="btn btn-primary mr-2" :disabled="toTypeIsTo" @click="nextUnitPart()">Next</button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { SettingsService } from '@/view-models/misc/settings.service';
  import { MLanguage } from '@/models/misc/language';
  import { MDictionary } from '@/models/misc/dictionary';
  import { MTextbook } from '@/models/misc/textbook';
  import { MVoice } from '@/models/misc/voice';
  import { container } from 'tsyringe';

  settingsService = container.resolve(SettingsService);

  get toTypeIsUnit() {
    return settingsService.toType === 0;
  };
  get toTypeIsPart() {
    return settingsService.toType === 1;
  };
  get toTypeIsTo() {
    return settingsService.toType === 2;
  };

  async created() {
    settingsService.settingsListener = this;
    await settingsService.getData();
  };

  async onLangChange(value: MLanguage) {
    settingsService.selectedLang = value;
    await settingsService.updateLang();
  };

  async onVoiceChange(value: MVoice) {
    settingsService.selectedVoice = value;
    await settingsService.updateVoice();
  };

  async onDictReferenceChange(value: MDictionary) {
    settingsService.selectedDictReference = value;
    await settingsService.updateDictReference();
  };

  async onDictNoteChange(value: MDictionary) {
    settingsService.selectedDictNote = value;
    await settingsService.updateDictNote();
  };

  async onDictTranslationChange(value: MDictionary) {
    settingsService.selectedDictTranslation = value;
    await settingsService.updateDictTranslation();
  };

  async onTextbookChange(value: MTextbook) {
    settingsService.selectedTextbook = value;
    await settingsService.updateTextbook();
  };

  async onUnitFromChange(value: number) {
    await settingsService.updateUnitFrom(value);
  };

  async onPartFromChange(value: number) {
    await settingsService.updatePartFrom(value);
  };

  async onToTypeChange(value: number) {
    await settingsService.updateToType(value);
  };

  async previousUnitPart() {
    await settingsService.previousUnitPart();
  };

  async nextUnitPart() {
    await settingsService.nextUnitPart();
  };

  async onUnitToChange(value: number) {
    await settingsService.updateUnitTo(value);
  };

  async onPartToChange(value: number) {
    await settingsService.updateUnitTo(value);
  };
</script>

<style>

.form-inline label{
  justify-content: left;
}

</style>
