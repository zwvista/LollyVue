<template>
  <div id="app">
    <Toolbar>
      <template #start>
        {{ title }}
      </template>
      <template #end>
        <a href="/">
          <Button label="1. Veutify" />
        </a>
        <a href="/quasar">
          <Button label="2. Quasar" />
        </a>
        <a href="/material">
          <Button label="3. Material" />
        </a>
        <a href="/element">
          <Button label="4. Element" />
        </a>
        <a href="/primevue">
          <Button label="5. PrimeVUE" />
        </a>
      </template>
    </Toolbar>
    <TabMenu :model="items" />
    <router-view />
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { DictionaryService } from '@/services/misc/dictionary.service';
  import { HtmlService } from '@/services/misc/html.service';
  import { LanguageService } from '@/services/misc/language.service';
  import { TextbookService } from '@/services/misc/textbook.service';
  import { UnitWordService } from '@/services/wpp/unit-word.service';
  import { UnitPhraseService } from '@/services/wpp/unit-phrase.service';
  import { UserSettingService } from '@/services/misc/user-setting.service';
  import { AppService } from '@/view-models/misc/app.service';
  import { PhrasesUnitService } from '@/view-models/wpp/phrases-unit.service';
  import { WordsUnitService } from '@/view-models/wpp/words-unit.service';
  import { SettingsService } from '@/view-models/misc/settings.service';
  import { AutoCorrectService } from '@/services/misc/autocorrect.service';
  import { WordsLangService } from '@/view-models/wpp/words-lang.service';
  import { LangWordService } from '@/services/wpp/lang-word.service';
  import { PhrasesLangService } from '@/view-models/wpp/phrases-lang.service';
  import { LangPhraseService } from '@/services/wpp/lang-phrase.service';
  import { VoiceService } from '@/services/misc/voice.service';
  import { WordFamiService } from '@/services/wpp/word-fami.service';
  import { UsMappingService } from '@/services/misc/us-mapping.service';
  import { PatternService } from '@/services/wpp/pattern.service';
  import { PatternsService } from '@/view-models/wpp/patterns.service';
  import { container } from "tsyringe";

  @Component
  export default class App extends Vue {
    appService = container.resolve(AppService);
    items = [
      {
        icon: 'fa fa-bus fa-lg',
        label: 'Words in Unit',
        to: '/words-unit5',
      },
      {
        icon: 'fa fa-train fa-lg',
        label: 'Phrases in Unit',
        to: '/phrases-unit5',
      },
      {
        icon: 'fa fa-car fa-lg',
        label: 'Words in Textbook',
        to: '/words-textbook5',
      },
      {
        icon: 'fa fa-taxi fa-lg',
        label: 'Phrases in Textbook',
        to: '/phrases-textbook5',
      },
      {
        icon: 'fa fa-plane fa-lg',
        label: 'Words in Language',
        to: '/words-lang5',
      },
      {
        icon: 'fa fa-rocket fa-lg',
        label: 'Phrases in Language',
        to: '/phrases-lang5',
      },
      {
        icon: 'fa fa-motorcycle fa-lg',
        label: 'Patterns in Language',
        to: '/patterns5',
      },
      {
        icon: 'fa fa-cog fa-lg',
        label: 'Settings',
        to: '/settings',
      },
    ];
    title = 'Lolly Vue';

    constructor() {
      super();
      this.appService.getData();
    }
  }
</script>
