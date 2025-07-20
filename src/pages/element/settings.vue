<template>
  <div class="h-100 d-flex align-items-center justify-content-center">
    <div class="w-50" v-if="settingsService.selectedLang">
      <el-row>
        <el-col :span="8">
          <label for="lang">Language:</label>
        </el-col>
        <el-col :span="16">
          <!-- https://stackoverflow.com/questions/64976435/element-ui-select-doesnt-work-with-object-as-value-->
          <el-select id="lang" value-key="ID" :model-value="settingsService.selectedLang" @update:model-value="onLangChange($event)">
            <el-option v-for="item in settingsService.languages" :label="item.NAME" :value="item" />
          </el-select>
        </el-col>
      </el-row>
      <el-row class="mt-n10">
        <el-col :span="8">
          <label for="voice">Voice:</label>
        </el-col>
        <el-col :span="16">
          <el-select id="voice" value-key="ID" :model-value="settingsService.selectedVoice" @update:model-value="onVoiceChange($event)">
            <el-option v-for="item in settingsService.voices" :label="item.VOICENAME" :value="item" />
          </el-select>
        </el-col>
      </el-row>
      <el-row class="mt-n10">
        <el-col :span="8">
          <label for="dictReference">Dictionary(Reference):</label>
        </el-col>
        <el-col :span="16">
          <el-select id="dictReference" value-key="ID" :model-value="settingsService.selectedDictReference" @update:model-value="onDictReferenceChange($event)">
            <el-option v-for="item in settingsService.dictsReference" :label="item.NAME" :value="item" />
          </el-select>
        </el-col>
      </el-row>
      <el-row class="mt-n10">
        <el-col :span="8">
          <label for="dictNote">Dictionary(Note):</label>
        </el-col>
        <el-col :span="16">
          <el-select id="dictNote" value-key="ID" :model-value="settingsService.selectedDictNote" @update:model-value="onDictNoteChange($event)">
            <el-option v-for="item in settingsService.dictsNote" :label="item.NAME" :value="item" />
          </el-select>
        </el-col>
      </el-row>
      <el-row class="mt-n10">
        <el-col :span="8">
          <label for="dictTranslation">Dictionary(Translation):</label>
        </el-col>
        <el-col :span="16">
          <el-select id="dictTranslation" value-key="ID" :model-value="settingsService.selectedDictTranslation" @update:model-value="onDictTranslationChange($event)">
            <el-option v-for="item in settingsService.dictsTranslation" :label="item.NAME" :value="item" />
          </el-select>
        </el-col>
      </el-row>
      <el-row class="mt-n10">
        <el-col :span="8">
          <label for="textbook">Textbook:</label>
        </el-col>
        <el-col :span="16">
          <el-select id="textbook" value-key="ID" :model-value="settingsService.selectedTextbook" @update:model-value="onTextbookChange($event)">
            <el-option v-for="item in settingsService.textbooks" :label="item.NAME" :value="item" />
          </el-select>
        </el-col>
      </el-row>
      <el-row class="mt-n10">
        <el-col :span="8">
          <label>Unit:</label>
        </el-col>
        <el-col :span="8">
          <el-select id="unitFrom" value-key="value" :model-value="settingsService.USUNITFROM" @update:model-value="onUnitFromChange($event)">
            <el-option v-for="item in settingsService.units" :label="item.label" :value="item.value" />
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-select id="partFrom" value-key="value" :disabled="toTypeIsUnit" :model-value="settingsService.USPARTFROM" @update:model-value="onPartFromChange($event)">
            <el-option v-for="item in settingsService.parts" :label="item.label" :value="item.value" />
          </el-select>
        </el-col>
      </el-row>
      <el-row class="mt-n10">
        <el-col :span="8">
          <el-select id="toType" value-key="value" :model-value="settingsService.toType" @update:model-value="onToTypeChange($event)">
            <el-option v-for="item in settingsService.toTypes" :label="item.label" :value="item.value" />
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-select id="unitTo" value-key="value" :disabled="!toTypeIsTo" :model-value="settingsService.USUNITTO" @update:model-value="onUnitToChange($event)">
            <el-option v-for="item in settingsService.units" :label="item.label" :value="item.value" />
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-select id="partTo" value-key="value" :disabled="!toTypeIsTo" :model-value="settingsService.USPARTTO" @update:model-value="onPartToChange($event)">
            <el-option v-for="item in settingsService.parts" :label="item.label" :value="item.value" />
          </el-select>
        </el-col>
      </el-row>
      <el-row class="mt-n10">
        <el-col :offset="8">
          <el-button class="btn btn-primary mr-2" :disabled="toTypeIsTo" @click="previousUnitPart()">Previous</el-button>
          <el-button class="btn btn-primary mr-2" :disabled="toTypeIsTo" @click="nextUnitPart()">Next</el-button>
        </el-col>
      </el-row>
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
label {
  margin-top: 16px;
}
</style>
