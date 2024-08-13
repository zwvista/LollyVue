<template>
  <div class="h-100 d-flex align-items-center justify-content-center">
    <div class="container w-50" v-if="settingsService.selectedLang">
      <div class="row">
        <div class="col-4 col-label">
          <label for="lang">Language:</label>
        </div>
        <div class="col-8">
          <q-select map-options id="lang" :model-value="settingsService.selectedLang" @update:model-value="onLangChange($event)"
            :options="settingsService.languages" option-label="NAME" />
        </div>
      </div>
      <div class="row mt-n10">
        <div class="col-4 col-label">
          <label for="voice">Voice:</label>
        </div>
        <div class="col-8">
          <q-select map-options id="voice" :model-value="settingsService.selectedVoice" @update:model-value="onVoiceChange($event)"
            :options="settingsService.voices" option-label="VOICENAME" />
        </div>
      </div>
      <div class="row mt-n10">
        <div class="col-4 col-label">
          <label for="dictReference">Dictionary(Reference):</label>
        </div>
        <div class="col-8">
          <q-select map-options id="dictReference" :model-value="settingsService.selectedDictReference" @update:model-value="onDictReferenceChange($event)"
            :options="settingsService.dictsReference" option-label="NAME" />
        </div>
      </div>
      <div class="row mt-n10">
        <div class="col-4 col-label">
          <label for="dictNote">Dictionary(Note):</label>
        </div>
        <div class="col-8">
          <q-select map-options id="dictNote" :model-value="settingsService.selectedDictNote" @update:model-value="onDictNoteChange($event)"
            :options="settingsService.dictsNote" option-label="NAME" />
        </div>
      </div>
      <div class="row mt-n10">
        <div class="col-4 col-label">
          <label for="dictTranslation">Dictionary(Translation):</label>
        </div>
        <div class="col-8">
          <q-select map-options id="dictTranslation" :model-value="settingsService.selectedDictTranslation" @update:model-value="onDictTranslationChange($event)"
            :options="settingsService.dictsTranslation" option-label="NAME" />
        </div>
      </div>
      <div class="row mt-n10">
        <div class="col-4 col-label">
          <label for="textbook">Textbook:</label>
        </div>
        <div class="col-8">
          <q-select map-options id="textbook" :model-value="settingsService.selectedTextbook" @update:model-value="onTextbookChange($event)"
            :options="settingsService.textbooks" option-label="NAME" />
        </div>
      </div>
      <div class="row mt-n10">
        <div class="col-4 col-label">
          <label>Unit:</label>
        </div>
        <div class="col-4">
          <q-select map-options id="unitFrom" :model-value="settingsService.USUNITFROM" @update:model-value="onUnitFromChange($event)"
            :options="settingsService.units" />
        </div>
        <div class="col-4">
          <q-select map-options id="partFrom" :disabled="toTypeIsUnit" :model-value="settingsService.USPARTFROM" @update:model-value="onPartFromChange($event)"
            :options="settingsService.parts" />
        </div>
      </div>
      <div class="row mt-n10">
        <div class="col-4">
          <q-select map-options id="toType" :model-value="settingsService.toType" @update:model-value="onToTypeChange($event)"
             :options="settingsService.toTypes" />
        </div>
        <div class="col-4">
          <q-select map-options id="unitTo" :disabled="!toTypeIsTo" :model-value="settingsService.USUNITTO" @update:model-value="onUnitToChange($event)"
            :options="settingsService.units" />
        </div>
        <div class="col-4">
          <q-select map-options id="partTo" :disabled="!toTypeIsTo" :model-value="settingsService.USPARTTO" @update:model-value="onPartToChange($event)"
            :options="settingsService.parts" />
        </div>
      </div>
      <div class="row mt-n10">
        <div class="col-4">
        </div>
        <div>
          <q-btn class="btn btn-primary mr-2" :disabled="toTypeIsTo" @click="previousUnitPart()">Previous</q-btn>
          <q-btn class="btn btn-primary mr-2" :disabled="toTypeIsTo" @click="nextUnitPart()">Next</q-btn>
        </div>
      </div>
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

<style scoped>
.col-label {
  padding-top: 16px;
}
</style>
