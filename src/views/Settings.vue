<template>
  <div class="container">
    <div class="form-inline mb-2">
      <label for="lang" class="col-2 control-label">Languages:</label>
      <b-form-select id="lang" class="col-4 form-control" :value="settingsService.selectedLang" @change="onLangChange($event)">
        <option v-for="lang in settingsService.languages" :value="lang" :key="lang.ID">{{lang.NAME}}</option>
      </b-form-select>
    </div>
    <div class="form-inline mb-2">
      <label for="dictItem" class="col-2 control-label">Dictionary(Word):</label>
      <b-form-select id="dictItem" class="col-4 form-control" :value="settingsService.selectedDictItem" @change="onDictItemChange($event)">
        <option v-for="dict in settingsService.dictItems" :value="dict" :key="dict.DICTID">{{dict.DICTNAME}}</option>
      </b-form-select>
    </div>
    <div class="form-inline mb-2">
      <label for="dictNote" class="col-2 control-label">Dictionary(Note):</label>
      <b-form-select id="dictNote" class="col-4 form-control" :value="settingsService.selectedDictNote" @change="onDictNoteChange($event)">
        <option v-for="dict in settingsService.dictsNote" :value="dict" :key="dict.ID">{{dict.DICTNAME}}</option>
      </b-form-select>
    </div>
    <div class="form-inline mb-2">
      <label for="textbook" class="col-2 control-label">Textbook:</label>
      <b-form-select id="textbook" class="col-4 form-control" :value="settingsService.selectedTextbook" @change="onTextbookChange($event)">
        <option v-for="textbook in settingsService.textbooks" :value="textbook" :key="textbook.ID">{{textbook.NAME}}</option>
      </b-form-select>
    </div>
    <div class="form-inline mb-2">
      <label for="unitFrom" class="col-2 control-label">Unit:</label>
      <b-form-select id="unitFrom" class="col-2 form-control" :value="unitFrom" @change="onUnitFromChange($event)">
        <option v-for="unit in settingsService.units" :value="unit" :key="unit">{{unit}}</option>
      </b-form-select>
      <b-form-select class="col-2 form-control" :value="partFrom" @change="onPartFromChange($event)">
        <option v-for="part in settingsService.parts" :value="part" :key="part">{{part}}</option>
      </b-form-select>
    </div>
    <div class="form-inline mb-2">
      <label for="unitTo" class="col-2 control-label">
        <input type="checkbox" v-model="unitPartTo">To:
      </label>
      <b-form-select id="unitTo" class="col-2 form-control" :disabled="!unitPartTo" :value="unitTo" @change="onUnitToChange($event)">
        <option v-for="unit in settingsService.units" :value="unit" :key="unit">{{unit}}</option>
      </b-form-select>
      <b-form-select class="col-2 form-control" :disabled="!unitPartTo" :value="partTo" @change="onPartToChange($event)">
        <option v-for="part in settingsService.parts" :value="part" :key="part">{{part}}</option>
      </b-form-select>
    </div>
    <div class="form-inline mb-2">
      <label class="col-2 control-label"></label>
      <button class="btn btn-primary mr-2" :disabled="unitPartTo" @click="previousUnitPart()">Previous</button>
      <button class="btn btn-primary mr-2" :disabled="unitPartTo" @click="nextUnitPart()">Next</button>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { inject } from 'vue-typescript-inject';
  import { SettingsService } from '@/view-models/settings.service';
  import { Language } from '@/models/language';
  import { DictMean, DictNote } from '@/models/dictionary';
  import { Textbook } from '@/models/textbook';
  import { concatMap } from 'rxjs/operators';


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

    onDictItemChange(value: DictMean) {
      const index = this.settingsService.dictsMean.indexOf(value);
      this.settingsService.selectedDictItemIndex = index;
      this.settingsService.updateDictItem().subscribe();
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

    previousUnitPart() {
      if (this.settingsService.USPARTFROM > 1) {
        this.settingsService.USPARTFROM--;
        this.updateUnitPartTo();
        this.settingsService.updatePartFrom().subscribe();
      } else if (this.settingsService.USUNITFROM > 1) {
        this.settingsService.USUNITFROM--;
        this.settingsService.USPARTFROM = this.settingsService.parts.length;
        this.updateUnitPartTo();
        this.settingsService.updateUnitFrom().pipe(
          concatMap(_ => this.settingsService.updatePartFrom()),
        ).subscribe();
      }
    }

    nextUnitPart() {
      if (this.settingsService.USPARTFROM < this.settingsService.parts.length) {
        this.settingsService.USPARTFROM++;
        this.updateUnitPartTo();
        this.settingsService.updatePartFrom().subscribe();
      } else if (this.settingsService.USUNITFROM > 1) {
        this.settingsService.USUNITFROM++;
        this.settingsService.USPARTFROM = 1;
        this.updateUnitPartTo();
        this.settingsService.updateUnitFrom().pipe(
          concatMap(_ => this.settingsService.updatePartFrom()),
        ).subscribe();
      }
    }
  }
</script>

<style>

.form-inline label{
  justify-content: left;
}

</style>