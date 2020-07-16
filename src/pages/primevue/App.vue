<template>
  <div id="app">
    <Toolbar>
      <template slot="right">
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
  import { DictionaryService } from '@/services/dictionary.service';
  import { HtmlService } from '@/services/html.service';
  import { LanguageService } from '@/services/language.service';
  import { TextbookService } from '@/services/textbook.service';
  import { UnitWordService } from '@/services/unit-word.service';
  import { UnitPhraseService } from '@/services/unit-phrase.service';
  import { UserSettingService } from '@/services/user-setting.service';
  import { AppService } from '@/view-models/app.service';
  import { PhrasesUnitService } from '@/view-models/phrases-unit.service';
  import { WordsUnitService } from '@/view-models/words-unit.service';
  import { SettingsService } from '@/view-models/settings.service';
  import { AutoCorrectService } from '@/services/autocorrect.service';
  import { WordsLangService } from '@/view-models/words-lang.service';
  import { LangWordService } from '@/services/lang-word.service';
  import { PhrasesLangService } from '@/view-models/phrases-lang.service';
  import { LangPhraseService } from '@/services/lang-phrase.service';
  import { NoteService } from '@/view-models/note.service';
  import { VoicesService } from '@/services/voices.service';
  import { WordFamiService } from '@/services/word-fami.service';
  import { WordsFamiService } from '@/view-models/words-fami.service';
  import { UsMappingService } from '@/services/us-mapping.service';

  @Component({
  providers: [
    DictionaryService, HtmlService, LanguageService,
    TextbookService, UnitPhraseService, UnitWordService, UserSettingService, AppService,
    PhrasesUnitService, SettingsService, WordsUnitService, AutoCorrectService,
    LangPhraseService, LangWordService, PhrasesLangService, WordsLangService,
    NoteService, WordFamiService, WordsFamiService,
    VoicesService, UsMappingService,
  ],
})
export default class App extends Vue {
  // @inject() appService!: AppService;
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
      icon: 'fa fa-cog fa-lg',
      label: 'Settings',
      path: '/settings',
    },
  ];
  title = 'Lolly Vue';
}
</script>
