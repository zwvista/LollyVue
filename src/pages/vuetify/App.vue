<template>
  <v-app>
    <v-navigation-drawer
      persistent
      :mini-variant="miniVariant"
      :clipped="clipped"
      v-model="drawer"
      enable-resize-watcher
      fixed
      app
    >
      <v-list>
        <v-list-item
          value="true"
          v-for="(item, i) in items"
          :key="i"
          :to="{path: item.path}"
        >
          <v-list-item-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      app
      :clipped-left="clipped"
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>
      </v-btn>
      <v-btn icon @click.stop="clipped = !clipped">
        <v-icon>web</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <a href="/">
        <v-btn color="info">1. Veutify</v-btn>
      </a>
      <a href="/quasar">
        <v-btn color="info">2. Quasar</v-btn>
      </a>
      <a href="/material">
        <v-btn color="info">3. Material</v-btn>
      </a>
      <a href="/element">
        <v-btn color="info">4. Element</v-btn>
      </a>
      <a href="/primevue">
        <v-btn color="info">5. PrimeVUE</v-btn>
      </a>
    </v-app-bar>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
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
  import { inject } from "vue-typescript-inject";

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
    @inject() appService!: AppService;
    clipped = true;
    drawer = true;
    items = [
      {
        icon: 'fa-bus fa-lg',
        title: 'Words in Unit',
        path: '/words-unit',
      },
      {
        icon: 'fa-train fa-lg',
        title: 'Phrases in Unit',
        path: '/phrases-unit',
      },
      {
        icon: 'fa-car fa-lg',
        title: 'Words in Textbook',
        path: '/words-textbook',
      },
      {
        icon: 'fa-taxi fa-lg',
        title: 'Phrases in Textbook',
        path: '/phrases-textbook',
      },
      {
        icon: 'fa-plane fa-lg',
        title: 'Words in Language',
        path: '/words-lang',
      },
      {
        icon: 'fa-rocket fa-lg',
        title: 'Phrases in Language',
        path: '/phrases-lang',
      },
      {
        icon: 'fa-motorcycle fa-lg',
        title: 'Patterns in Language',
        path: '/patterns',
      },
      {
        icon: 'fa-cog fa-lg',
        title: 'Settings',
        path: '/settings',
      },
    ];
    miniVariant = false;
    title = 'Lolly Vue';

    constructor() {
      super();
      this.appService.getData();
    }
  }
</script>
