<template>
  <el-container>
    <el-header>
      Lolly Vue
      <a href="/">
        <el-button type="primary">1. Vuetify</el-button>
      </a>
      <a href="/quasar">
        <el-button type="primary">2. Quasar</el-button>
      </a>
      <a href="/material">
        <el-button type="primary">3. Material</el-button>
      </a>
      <a href="/element">
        <el-button type="primary">4. Element</el-button>
      </a>
      <a href="/primevue">
        <el-button type="primary">5. PrimeVUE</el-button>
      </a>
    </el-header>
    <el-header>
      <el-menu :default-active="activeIndex" mode="horizontal" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
        <el-menu-item v-for="(item, i) in items" :to="item.path" :index="i">
          <router-link :to="item.path">
            {{item.title}}
          </router-link>
        </el-menu-item>
      </el-menu>
    </el-header>
    <el-main>
      <router-view />
    </el-main>
  </el-container>
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
    activeIndex = 0;
    items = [
      {
        icon: 'fa fa-bus fa-lg',
        title: 'Words in Unit',
        path: '/words-unit4',
      },
      {
        icon: 'fa fa-train fa-lg',
        title: 'Phrases in Unit',
        path: '/phrases-unit4',
      },
      {
        icon: 'fa fa-car fa-lg',
        title: 'Words in Textbook',
        path: '/words-textbook4',
      },
      {
        icon: 'fa fa-taxi fa-lg',
        title: 'Phrases in Textbook',
        path: '/phrases-textbook4',
      },
      {
        icon: 'fa fa-plane fa-lg',
        title: 'Words in Language',
        path: '/words-lang4',
      },
      {
        icon: 'fa fa-rocket fa-lg',
        title: 'Phrases in Language',
        path: '/phrases-lang4',
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

<style>
  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
</style>
