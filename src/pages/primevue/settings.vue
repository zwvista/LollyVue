<template>
  <div class="h-full flex items-center justify-center">
    <div class="w-3/6" v-if="settingsService.selectedLang">
      <div class="flex items-center">
        <label class="w-1/3" for="lang">Language:</label>
        <Select class="w-2/3" id="lang" :model-value="settingsService.selectedLang" @update:model-value="onLangChange($event)"
          :options="settingsService.languages" optionLabel="NAME" />
      </div>
      <div class="flex items-center mt-2">
        <label class="w-1/3" for="voice">Voice:</label>
        <Select class="w-2/3" id="voice" :model-value="settingsService.selectedVoice" @update:model-value="onVoiceChange($event)"
          :options="settingsService.voices" optionLabel="VOICENAME" />
      </div>
      <div class="flex items-center mt-2">
        <label class="w-1/3" for="dictReference">Dictionary(Reference):</label>
        <Select class="w-2/3" id="dictReference" :model-value="settingsService.selectedDictReference" @update:model-value="onDictReferenceChange($event)"
          :options="settingsService.dictsReference" optionLabel="NAME" />
      </div>
      <div class="flex items-center mt-2">
        <label class="w-1/3" for="dictNote">Dictionary(Note):</label>
        <Select class="w-2/3" id="dictNote" :model-value="settingsService.selectedDictNote" @update:model-value="onDictNoteChange($event)"
          :options="settingsService.dictsNote" optionLabel="NAME" />
      </div>
      <div class="flex items-center mt-2">
        <label class="w-1/3" for="dictTranslation">Dictionary(Translation):</label>
        <Select class="w-2/3" id="dictTranslation" :model-value="settingsService.selectedDictTranslation" @update:model-value="onDictTranslationChange($event)"
          :options="settingsService.dictsTranslation" optionLabel="NAME" />
      </div>
      <div class="flex items-center mt-2">
        <label class="w-1/3" for="textbook">Textbook:</label>
        <Select class="w-2/3" id="textbook" :model-value="settingsService.selectedTextbook" @update:model-value="onTextbookChange($event)"
          :options="settingsService.textbooks" optionLabel="NAME" />
      </div>
      <div class="flex items-center mt-2">
        <label class="w-1/3">Unit:</label>
        <Select class="w-1/3" id="unitFrom" :model-value="settingsService.USUNITFROM" @update:model-value="onUnitFromChange($event)"
          :options="settingsService.units" optionLabel="label" optionValue="value" />
        <Select class="w-1/3" id="partFrom" :disabled="toTypeIsUnit" :model-value="settingsService.USPARTFROM" @update:model-value="onPartFromChange($event)"
          :options="settingsService.parts" optionLabel="label" optionValue="value" />
      </div>
      <div class="flex items-center mt-2">
        <Select class="w-1/3" id="toType" :model-value="settingsService.toType" @update:model-value="onToTypeChange($event)"
           :options="settingsService.toTypes" optionLabel="label" optionValue="value" />
        <Select class="w-1/3" id="unitTo" :disabled="!toTypeIsTo" :model-value="settingsService.USUNITTO" @update:model-value="onUnitToChange($event)"
          :options="settingsService.units" optionLabel="label" optionValue="value" />
        <Select class="w-1/3" id="partTo" :disabled="!toTypeIsTo" :model-value="settingsService.USPARTTO" @update:model-value="onPartToChange($event)"
          :options="settingsService.parts" optionLabel="label" optionValue="value" />
      </div>
      <div class="flex items-center mt-2">
        <div class="w-1/3"></div>
        <Button class="btn btn-primary mr-2" :disabled="toTypeIsTo" @click="previousUnitPart()">Previous</Button>
        <Button class="btn btn-primary mr-2" :disabled="toTypeIsTo" @click="nextUnitPart()">Next</Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { SettingsService } from '@/shared/view-models/misc/settings.service';
  import { MLanguage } from '@/shared/models/misc/language';
  import { MDictionary } from '@/shared/models/misc/dictionary';
  import { MTextbook } from '@/shared/models/misc/textbook';
  import { MVoice } from '@/shared/models/misc/voice';
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
html, body, #app {
  height: 100%;
}
</style>
