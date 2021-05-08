<template>
  <div class="page-container">
    <md-app md-mode="reveal">
      <md-app-toolbar class="md-primary">
        <md-button class="md-icon-button" @click="menuVisible = !menuVisible">
          <md-icon>menu</md-icon>
        </md-button>
        <span class="md-title" style="flex: 1">{{title}}</span>
        <a href="/">
          <md-button class="md-raised md-primary">1. Vuetify</md-button>
        </a>
        <a href="/quasar">
          <md-button class="md-raised md-primary">2. Quasar</md-button>
        </a>
        <a href="/material">
          <md-button class="md-raised md-primary">3. Material</md-button>
        </a>
        <a href="/element">
          <md-button class="md-raised md-primary">4. Element</md-button>
        </a>
        <a href="/primevue">
          <md-button class="md-raised md-primary">5. PrimeVUE</md-button>
        </a>
      </md-app-toolbar>
      <md-app-drawer :md-active.sync="menuVisible">
        <md-list>
          <md-list-item v-for="item in items" @click="menuVisible = false; $router.push(item.path);">
            <md-icon :class="item.icon"></md-icon>
            <span class="md-list-item-text">{{item.title}}</span>
          </md-list-item>
        </md-list>
      </md-app-drawer>
      <md-app-content>
        <router-view />
      </md-app-content>
    </md-app>
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
  import { PatternsService } from '@/view-models/misc/patterns.service';

  @Component({
    providers: [
      DictionaryService, HtmlService, LanguageService,
      TextbookService, UnitPhraseService, UnitWordService, UserSettingService, AppService,
      PhrasesUnitService, SettingsService, WordsUnitService, AutoCorrectService,
      LangPhraseService, LangWordService, PhrasesLangService, WordsLangService,
      WordFamiService, VoiceService, UsMappingService, PatternService, PatternsService,
    ],
  })
  export default class App extends Vue {
    // @inject() appService!: AppService;
    menuVisible = false;
    items = [
      {
        icon: 'fa fa-bus fa-lg',
        title: 'Words in Unit',
        path: '/words-unit3',
      },
      {
        icon: 'fa fa-train fa-lg',
        title: 'Phrases in Unit',
        path: '/phrases-unit3',
      },
      {
        icon: 'fa fa-car fa-lg',
        title: 'Words in Textbook',
        path: '/words-textbook3',
      },
      {
        icon: 'fa fa-taxi fa-lg',
        title: 'Phrases in Textbook',
        path: '/phrases-textbook3',
      },
      {
        icon: 'fa fa-plane fa-lg',
        title: 'Words in Language',
        path: '/words-lang3',
      },
      {
        icon: 'fa fa-rocket fa-lg',
        title: 'Phrases in Language',
        path: '/phrases-lang3',
      },
      {
        icon: 'fa fa-motorcycle fa-lg',
        title: 'Patterns in Language',
        path: '/patterns3',
      },
      {
        icon: 'fa fa-cog fa-lg',
        title: 'Settings',
        path: '/settings',
      },
    ];
    title = 'Lolly Vue';
  }
</script>

<style lang="scss" scoped>
  .md-app {
    min-height: 1000px;
    border: 1px solid rgba(#000, .12);
  }

  // Demo purposes only
  .md-drawer {
    width: 230px;
    max-width: calc(100vw - 125px);
  }

</style>
