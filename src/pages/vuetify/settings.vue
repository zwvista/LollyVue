<template>
  <div class="container" v-if="settingsService.selectedLang">
    <div class="form-inline mb-2">
      <label for="lang" class="col-2 control-label">Language:</label>
      <b-form-select id="lang" class="col-4 form-control" :model-value="settingsService.selectedLang" @update:model-value="onLangChange($event)"
        :options="settingsService.languages" value-field="" text-field="NAME" />
    </div>
    <div class="form-inline mb-2">
      <label for="voice" class="col-2 control-label">Voice:</label>
      <b-form-select id="voice" class="col-4 form-control" :model-value="settingsService.selectedVoice" @update:model-value="onVoiceChange($event)"
        :options="settingsService.voices" value-field="" text-field="VOICENAME" />
    </div>
    <div class="form-inline mb-2">
      <label for="dictReference" class="col-2 control-label">Dictionary(Reference):</label>
      <b-form-select id="dictReference" class="col-4 form-control" :model-value="settingsService.selectedDictReference" @update:model-value="onDictReferenceChange($event)"
        :options="settingsService.dictsReference" value-field="" text-field="NAME" />
    </div>
    <div class="form-inline mb-2">
      <label for="dictNote" class="col-2 control-label">Dictionary(Note):</label>
      <b-form-select id="dictNote" class="col-4 form-control" :model-value="settingsService.selectedDictNote" @update:model-value="onDictNoteChange($event)"
        :options="settingsService.dictsNote" value-field="" text-field="NAME" />
    </div>
    <div class="form-inline mb-2">
      <label for="dictTranslation" class="col-2 control-label">Dictionary(Translation):</label>
      <b-form-select id="dictTranslation" class="col-4 form-control" :model-value="settingsService.selectedDictTranslation" @update:model-value="onDictTranslationChange($event)"
        :options="settingsService.dictsTranslation" value-field="" text-field="NAME" />
    </div>
    <div class="form-inline mb-2">
      <label for="textbook" class="col-2 control-label">Textbook:</label>
      <b-form-select id="textbook" class="col-4 form-control" :model-value="settingsService.selectedTextbook" @update:model-value="onTextbookChange($event)"
        :options="settingsService.textbooks" value-field="" text-field="NAME" />
    </div>
    <div class="form-inline mb-2">
      <label for="unitFrom" class="col-2 control-label">Unit:</label>
      <b-form-select id="unitFrom" class="col-2 form-control" :model-value="settingsService.USUNITFROM" @update:model-value="onUnitFromChange($event)"
        :options="settingsService.units" text-field="label" />
      <b-form-select id="partFrom" class="col-2 form-control" :disabled="toTypeIsUnit" :model-value="settingsService.USPARTFROM" @update:model-value="onPartFromChange($event)"
        :options="settingsService.parts" text-field="label" />
    </div>
    <div class="form-inline mb-2">
      <b-form-select id="toType" class="col-1 form-control" :model-value="settingsService.toType" @update:model-value="onToTypeChange($event)"
        :options="settingsService.toTypes" text-field="label" />
      <label class="col-1 control-label">
      </label>
      <b-form-select id="unitTo" class="col-2 form-control" :disabled="!toTypeIsTo" :model-value="settingsService.USUNITTO" @update:model-value="onUnitToChange($event)"
        :options="settingsService.units" text-field="label" />
      <b-form-select id="partTo" class="col-2 form-control" :disabled="!toTypeIsTo" :model-value="settingsService.USPARTTO" @update:model-value="onPartToChange($event)"
        :options="settingsService.parts" text-field="label" />
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
  import { computed, ref } from "vue";

  const settingsService = ref(container.resolve(SettingsService));

  const toTypeIsUnit = computed(() => settingsService.value.toType === 0);
  const toTypeIsPart = computed(() => settingsService.value.toType === 1);
  const toTypeIsTo = computed(() => settingsService.value.toType === 2);

  (async () => {
    await settingsService.value.getData();
  })();

  const onLangChange = async (value: MLanguage) => {
    settingsService.value.selectedLang = value;
    await settingsService.value.updateLang();
  };

  const onVoiceChange = async (value: MVoice) => {
    settingsService.value.selectedVoice = value;
    await settingsService.value.updateVoice();
  };

  const onDictReferenceChange = async (value: MDictionary) => {
    settingsService.value.selectedDictReference = value;
    await settingsService.value.updateDictReference();
  };

  const onDictNoteChange = async (value: MDictionary) => {
    settingsService.value.selectedDictNote = value;
    await settingsService.value.updateDictNote();
  };

  const onDictTranslationChange = async (value: MDictionary) => {
    settingsService.value.selectedDictTranslation = value;
    await settingsService.value.updateDictTranslation();
  };

  const onTextbookChange = async (value: MTextbook) => {
    settingsService.value.selectedTextbook = value;
    await settingsService.value.updateTextbook();
  };

  const onUnitFromChange = async (value: number) => {
    await settingsService.value.updateUnitFrom(value);
  };

  const onPartFromChange = async (value: number) => {
    await settingsService.value.updatePartFrom(value);
  };

  const onToTypeChange = async (value: number) => {
    await settingsService.value.updateToType(value);
  };

  const previousUnitPart = async () => {
    await settingsService.value.previousUnitPart();
  };

  const nextUnitPart = async () => {
    await settingsService.value.nextUnitPart();
  };

  const onUnitToChange = async (value: number) => {
    await settingsService.value.updateUnitTo(value);
  };

  const onPartToChange = async (value: number) => {
    await settingsService.value.updateUnitTo(value);
  };
</script>

<style>

.form-inline label{
  justify-content: left;
}

</style>
