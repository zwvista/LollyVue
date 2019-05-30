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
      <label for="dictItem" class="col-2 control-label">Dictionary(Reference):</label>
      <b-form-select id="dictItem" class="col-4 form-control" :value="settingsService.selectedDictItem" @change="onDictItemChange($event)">
        <option v-for="o in settingsService.dictItems" :value="o" :key="o.DICTID">{{o.DICTNAME}}</option>
      </b-form-select>
    </div>
    <div class="form-inline mb-2">
      <label for="dictNote" class="col-2 control-label">Dictionary(Note):</label>
      <b-form-select id="dictNote" class="col-4 form-control" :value="settingsService.selectedDictNote" @change="onDictNoteChange($event)">
        <option v-for="o in settingsService.dictsNote" :value="o" :key="o.ID">{{o.DICTNAME}}</option>
      </b-form-select>
    </div>
    <div class="form-inline mb-2">
      <label for="dictTranslation" class="col-2 control-label">Dictionary(Translation):</label>
      <b-form-select id="dictTranslation" class="col-4 form-control" :value="settingsService.selectedDictTranslation" @change="onDictTranslationChange($event)">
        <option v-for="o in settingsService.dictsTranslation" :value="o" :key="o.ID">{{o.DICTNAME}}</option>
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

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { inject } from 'vue-typescript-inject';
  import { SettingsListener, SettingsService } from '@/view-models/settings.service';
  import { MLanguage } from '@/models/language';
  import { MDictItem, DictReference, MDictNote, MDictTranslation } from '@/models/dictionary';
  import { MTextbook } from '@/models/textbook';
  import { MVoice } from '@/models/voice';

  @Component
  export default class Settings extends Vue implements SettingsListener {
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

    onDictItemChange(value: MDictItem) {
      this.settingsService.selectedDictItem = value;
      this.settingsService.updateDictItem().subscribe();
    }

    onDictNoteChange(value: MDictNote) {
      this.settingsService.selectedDictNote = value;
      this.settingsService.updateDictNote().subscribe();
    }

    onDictTranslationChange(value: MDictTranslation) {
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

    onUpdateDictItem(): void {
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