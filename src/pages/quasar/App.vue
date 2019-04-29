<template>
  <q-layout view="hHr LpR lFf">
    <q-layout-header>
      <q-toolbar :inverted="false">
        <q-btn flat round dense icon="menu" @click="showLeft=!showLeft"></q-btn>
        <q-toolbar-title>{{title}}</q-toolbar-title>
        <a href="/">
          <q-btn color="primary" label="1. Veutify"></q-btn>
        </a>
        <a href="/material">
          <q-btn color="primary" label="3. Material"></q-btn>
        </a>
        <a href="/element">
          <q-btn color="primary" label="4. Element"></q-btn>
        </a>
      </q-toolbar>
    </q-layout-header>
    <q-layout-drawer side="left" v-model="showLeft">
      <q-list no-border link inset-separator>
        <q-item v-for="item in items" :to="item.path">
          <q-item-side :icon="item.icon"></q-item-side>
          <q-item-main :label="item.title"></q-item-main>
        </q-item>
      </q-list>
    </q-layout-drawer>
    <q-page-container>
      <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" mode="out-in">
        <router-view />
      </transition>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { DictReferenceService, DictNoteService, DictTranslationService } from '@/services/dictionary.service';
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

  @Component({
    providers: [
      DictReferenceService, DictNoteService, DictTranslationService, HtmlService, LanguageService,
      TextbookService, UnitPhraseService, UnitWordService, UserSettingService, AppService,
      PhrasesUnitService, SettingsService, WordsUnitService, AutoCorrectService,
      LangPhraseService, LangWordService, PhrasesLangService, WordsLangService,
      NoteService, WordFamiService, WordsFamiService,
      VoicesService,
    ],
  })
  export default class App extends Vue {
    // @inject() appService!: AppService;
    showLeft = true;
    items = [
      {
        icon: 'fa fa-bus fa-lg',
        title: 'Words in Unit',
        path: '/words-unit2',
      },
      {
        icon: 'fa fa-train fa-lg',
        title: 'Phrases in Unit',
        path: '/phrases-unit2',
      },
      {
        icon: 'fa fa-plane fa-lg',
        title: 'Words in Language',
        path: '/words-lang2',
      },
      {
        icon: 'fa fa-rocket fa-lg',
        title: 'Phrases in Language',
        path: '/phrases-lang2',
      },
      {
        icon: 'fa fa-car fa-lg',
        title: 'Words in Textbook',
        path: '/words-textbook2',
      },
      {
        icon: 'fa fa-taxi fa-lg',
        title: 'Phrases in Textbook',
        path: '/phrases-textbook2',
      },
      {
        icon: 'fa fa-cog fa-lg',
        title: 'Settings',
        path: '/settings2',
      },
    ];
    title = 'Lolly Vue';
  }
</script>
