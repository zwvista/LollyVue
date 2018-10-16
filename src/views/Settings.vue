<template>
  <div class="container">
    <div class="row">
      <label class="col-2 control-label">Languages:</label>
      <b-form-select class="col-4 form-control" :value="settingsService.selectedLang" @change="onLangChange($event)">
        <option v-for="lang in settingsService.languages" :value="lang">{{lang.NAME}}</option>
      </b-form-select>
    </div>
    <div class="row">
      <label class="col-2 control-label">Dictionary(Online):</label>
      <b-form-select class="col-4 form-control" :value="settingsService.selectedDictOnline" @change="onDictOnlineChange($event)">
    <div t.selectedIndex)">
        <option v-for="dict in settingsService.dictsOnline" :value="dict">{{dict.DICTNAME}}</option>
      </b-form-select>
    </div>
    <div class="row">
      <label class="col-2 control-label">Dictionary(Note):</label>
      <b-form-select class="col-4 form-control" :value="settingsService.selectedDictNote" @change="onDictNoteChange($event)">
        <option v-for="dict in settingsService.dictsNote" :value="dict">{{dict.DICTNAME}}</option>
      </b-form-select>
    </div>
    <div class="row">
      <label class="col-2 control-label">Textbook:</label>
      <b-form-select class="col-4 form-control" :value="settingsService.selectedTextbook" @change="onTextbookChange($event)">
        <option v-for="textbook in settingsService.textbooks" :value="textbook">{{textbook.NAME}}</option>
      </b-form-select>
    </div>
    <div class="row">
      <label class="col-2 control-label">Unit:</label>
      <b-form-select class="col-2 form-control" :value="unitFrom" @change="onUnitFromChange($event)">
        <option v-for="unit in settingsService.units" :value="unit">{{unit}}</option>
      </b-form-select>
      <b-form-select class="col-2 form-control" :value="partFrom" @change="onPartFromChange($event)">
        <option v-for="part in settingsService.parts" :value="part">{{part}}</option>
      </b-form-select>
    </div>
    <div class="row">
      <label class="col-2 control-label">
        <input type="checkbox" v-model="unitPartTo">To:
      </label>
      <b-form-select class="col-2 form-control" :disabled="!unitPartTo" :value="unitTo" @change="onUnitToChange($event)">
        <option v-for="unit in settingsService.units" :value="unit">{{unit}}</option>
      </b-form-select>
      <b-form-select class="col-2 form-control" :disabled="!unitPartTo" :value="partTo" @change="onPartToChange($event)">
        <option v-for="part in settingsService.parts" :value="part">{{part}}</option>
      </b-form-select>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { inject } from 'vue-typescript-inject';
import { SettingsService } from '../view-models/settings.service';
import { Language } from '../models/language';
import { DictNote, DictOnline } from '../models/dictionary';
import { Textbook } from '../models/textbook';


@Component
export default class Settings extends Vue {
  @inject() settingsService!: SettingsService;

  get unitFrom() {
    return this.settingsService.units[this.settingsService.USUNITFROM - 1];
  }
  get partFrom() {
    return this.settingsService.parts[this.settingsService.USPARTFROM - 1];
  }
  get unitTo() {
    return this.settingsService.units[this.settingsService.USUNITTO - 1];
  }
  get partTo() {
    return this.settingsService.parts[this.settingsService.USPARTTO - 1];
  }

  unitPartTo = false;

  services = {};
  created() {
    this.$set(this.services, 'settingsService', this.settingsService);
    this.settingsService.getData().subscribe(_ => this.updateTextbook());
  }

  onLangChange(value: Language) {
    const index = this.settingsService.languages.indexOf(value);
    this.settingsService.setSelectedLangIndex(index).subscribe();
    this.settingsService.updateLang().subscribe();
  }

  onDictOnlineChange(value: DictOnline) {
    const index = this.settingsService.dictsOnline.indexOf(value);
    this.settingsService.selectedDictOnlineIndex = index;
    this.settingsService.updateDictOnline().subscribe();
  }

  onDictNoteChange(value: DictNote) {
    const index = this.settingsService.dictsNote.indexOf(value);
    this.settingsService.selectedDictNoteIndex = index;
    this.settingsService.updateDictNote().subscribe();
  }

  onTextbookChange(value: Textbook) {
    const index = this.settingsService.textbooks.indexOf(value);
    this.settingsService.selectedTextbookIndex = index;
    this.settingsService.updateTextbook().subscribe();
    this.updateTextbook();
  }

  onUnitFromChange(value: number) {
    this.settingsService.USUNITFROM = value;
    this.settingsService.updateUnitFrom()
      .subscribe(_ => {
        if (!this.unitPartTo || this.settingsService.isInvalidUnitPart) {
          this.updateUnitPartTo();
        }
      });
  }

  onPartFromChange(value: number) {
    this.settingsService.USPARTFROM = value;
    this.settingsService.updatePartFrom()
      .subscribe(_ => {
        if (!this.unitPartTo || this.settingsService.isInvalidUnitPart) {
          this.updateUnitPartTo();
        }
      });
  }

  onUnitToChange(value: number) {
    this.settingsService.USUNITTO = value;
    this.settingsService.updateUnitTo()
      .subscribe(_ => {
        if (this.settingsService.isInvalidUnitPart) {
          this.updateUnitPartFrom();
        }
      });
  }

  onPartToChange(value: number) {
    this.settingsService.USPARTTO = value;
    this.settingsService.updatePartTo()
      .subscribe(_ => {
        if (this.settingsService.isInvalidUnitPart) {
          this.updateUnitPartFrom();
        }
      });
  }

  updateTextbook() {
    this.unitPartTo = !this.settingsService.isSingleUnitPart;
  }

  updateUnitPartFrom() {
    if (this.settingsService.USUNITFROM !== this.settingsService.USUNITTO) {
      this.settingsService.USUNITFROM = this.settingsService.USUNITTO;
      this.settingsService.updateUnitFrom().subscribe();
    }
    if (this.settingsService.USPARTFROM !== this.settingsService.USPARTTO) {
      this.settingsService.USPARTFROM = this.settingsService.USPARTTO;
      this.settingsService.updatePartFrom().subscribe();
    }
  }

  updateUnitPartTo() {
    if (this.settingsService.USUNITTO !== this.settingsService.USUNITFROM) {
      this.settingsService.USUNITTO = this.settingsService.USUNITFROM;
      this.settingsService.updateUnitTo().subscribe();
    }
    if (this.settingsService.USPARTTO !== this.settingsService.USPARTFROM) {
      this.settingsService.USPARTTO = this.settingsService.USPARTFROM;
      this.settingsService.updatePartTo().subscribe();
    }
  }
}
</script>
