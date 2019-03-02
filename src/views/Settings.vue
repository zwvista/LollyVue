<template>
  <div class="container">
    <div class="form-inline mb-2">
      <label for="lang" class="col-2 control-label">Languages:</label>
      <b-form-select id="lang" class="col-4 form-control" :value="settingsService.selectedLang" @change="onLangChange($event)">
        <option v-for="o in settingsService.languages" :value="o" :key="o.ID">{{o.NAME}}</option>
      </b-form-select>
    </div>
    <div class="form-inline mb-2">
      <label for="dictItem" class="col-2 control-label">Dictionary(Word):</label>
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
      <b-form-select id="toType" class="col-1 form-control" v-model="toType" @change="onToTypeChange($event)">
        <option v-for="o in toTypes" :value="o.value" :key="o.value">{{o.label}}</option>
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
  import { SettingsService } from '@/view-models/settings.service';
  import { Language } from '@/models/language';
  import { DictItem, DictMean, DictNote } from '@/models/dictionary';
  import { Textbook } from '@/models/textbook';

  @Component
  export default class Settings extends Vue {
    @inject() settingsService!: SettingsService;

    get toTypeIsUnit() {
      return this.toType === 0;
    }
    get toTypeIsPart() {
      return this.toType === 1;
    }
    get toTypeIsTo() {
      return this.toType === 2;
    }

    toTypes = ['Unit', 'Part', 'To'].map((v, i) => ({value: i, label: v}));
    toType = 0;

    services = {};
    created() {
      this.$set(this.services, 'settingsService', this.settingsService);
      this.settingsService.getData().subscribe(_ => this.updateTextbook());
    }

    onLangChange(value: Language) {
      this.settingsService.setSelectedLang(value).subscribe();
      this.settingsService.updateLang().subscribe();
    }

    onDictItemChange(value: DictItem) {
      this.settingsService.selectedDictItem = value;
      this.settingsService.updateDictItem().subscribe();
    }

    onDictNoteChange(value: DictNote) {
      this.settingsService.selectedDictNote = value;
      this.settingsService.updateDictNote().subscribe();
    }

    onTextbookChange(value: Textbook) {
      this.settingsService.selectedTextbook = value;
      this.settingsService.updateTextbook().subscribe();
      this.updateTextbook();
    }

    onUnitFromChange(value: number) {
      if (!this.updateUnitFrom(value, false)) return;
      if (this.toType === 0)
        this.updateSingleUnit();
      else if (this.toType === 1 || this.settingsService.isInvalidUnitPart)
        this.updateUnitPartTo();
    }

    onPartFromChange(value: number) {
      if (!this.updatePartFrom(value, false)) return;
      if (this.toType === 1 || this.settingsService.isInvalidUnitPart)
        this.updateUnitPartTo();
    }

    onToTypeChange(value: number) {
      const index = value;
      if (index === 0)
        this.updateSingleUnit();
      else if (index === 1)
        this.updateUnitPartTo();
    }

    previousUnitPart() {
      if (this.toType === 0) {
        if (this.settingsService.USUNITFROM > 1) {
          this.updateUnitFrom(this.settingsService.USUNITFROM - 1);
          this.updateUnitTo(this.settingsService.USUNITFROM);
        }
      } else if (this.settingsService.USPARTFROM > 1) {
        this.updatePartFrom(this.settingsService.USPARTFROM - 1);
        this.updateUnitPartTo();
      } else if (this.settingsService.USUNITFROM > 1) {
        this.updateUnitFrom(this.settingsService.USUNITFROM - 1);
        this.updatePartFrom(this.settingsService.partCount);
        this.updateUnitPartTo();
      }
    }

    nextUnitPart() {
      if (this.toType === 0) {
        if (this.settingsService.USUNITFROM < this.settingsService.unitCount) {
          this.updateUnitFrom(this.settingsService.USUNITFROM + 1);
          this.updateUnitTo(this.settingsService.USUNITFROM);
        }
      } else if (this.settingsService.USPARTFROM < this.settingsService.partCount) {
        this.updatePartFrom(this.settingsService.USPARTFROM + 1);
        this.updateUnitPartTo();
      } else if (this.settingsService.USUNITFROM < this.settingsService.unitCount) {
        this.updateUnitFrom(this.settingsService.USUNITFROM + 1);
        this.updatePartFrom(1);
        this.updateUnitPartTo();
      }
    }

    onUnitToChange(value: number) {
      if (!this.updateUnitTo(value, false)) return;
      if (this.toType === 1 || this.settingsService.isInvalidUnitPart)
        this.updateUnitPartFrom();
    }

    onPartToChange(value: number) {
      if (!this.updatePartTo(value, false)) return;
      if (this.toType === 1 || this.settingsService.isInvalidUnitPart)
        this.updateUnitPartFrom();
    }

    updateTextbook() {
      this.toType = this.settingsService.isSingleUnit ? 0 : this.settingsService.isSingleUnitPart ? 1 : 2;
    }

    updateUnitPartFrom() {
      this.updateUnitFrom(this.settingsService.USUNITTO);
      this.updatePartFrom(this.settingsService.USPARTTO);
    }

    updateUnitPartTo() {
      this.updateUnitTo(this.settingsService.USUNITFROM);
      this.updatePartTo(this.settingsService.USPARTFROM);
    }

    updateSingleUnit() {
      this.updateUnitTo(this.settingsService.USUNITFROM);
      this.updatePartFrom(1);
      this.updatePartTo(this.settingsService.partCount);
    }

    updateUnitFrom(v: number, check: boolean = true): boolean {
      if (check && this.settingsService.USUNITFROM === v) return false;
      this.settingsService.USUNITFROM = v;
      this.settingsService.updateUnitFrom().subscribe();
      return true;
    }

    updatePartFrom(v: number, check: boolean = true): boolean {
      if (check && this.settingsService.USPARTFROM === v) return false;
      this.settingsService.USPARTFROM = v;
      this.settingsService.updatePartFrom().subscribe();
      return true;
    }

    updateUnitTo(v: number, check: boolean = true): boolean {
      if (check && this.settingsService.USUNITTO === v) return false;
      this.settingsService.USUNITTO = v;
      this.settingsService.updateUnitTo().subscribe();
      return true;
    }

    updatePartTo(v: number, check: boolean = true): boolean {
      if (check && this.settingsService.USPARTTO === v) return false;
      this.settingsService.USPARTTO = v;
      this.settingsService.updatePartTo().subscribe();
      return true;
    }
  }
</script>

<style>

.form-inline label{
  justify-content: left;
}

</style>