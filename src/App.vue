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
        <v-list-tile
          value="true"
          v-for="(item, i) in items"
          :key="i"
          :to="{path: item.path}"
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      app
      :clipped-left="clipped"
    >
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>
      </v-btn>
      <v-btn icon @click.stop="clipped = !clipped">
        <v-icon>web</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title"></v-toolbar-title>
    </v-toolbar>
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { DictMeanService, DictNoteService } from './services/dictionary.service';
  import { HtmlService } from './services/html.service';
  import { LanguageService } from './services/language.service';
  import { TextbookService } from './services/textbook.service';
  import { UnitWordService } from './services/unit-word.service';
  import { UnitPhraseService } from './services/unit-phrase.service';
  import { UserSettingService } from './services/user-setting.service';
  import { AppService } from './view-models/app.service';
  import { PhrasesUnitService } from './view-models/phrases-unit.service';
  import { WordsUnitService } from './view-models/words-unit.service';
  import { SettingsService } from './view-models/settings.service';
  import { AutoCorrectService } from './services/autocorrect.service';
  import { WordsLangService } from './view-models/words-lang.service';
  import { LangWordService } from './services/lang-word.service';
  import { PhrasesLangService } from './view-models/phrases-lang.service';
  import { LangPhraseService } from './services/lang-phrase.service';
  import { NoteService } from '@/view-models/note.service';
  import { WordsTextbookService } from '@/view-models/words-textbook.service';
  import { PhrasesTextbookService } from '@/view-models/phrases-textbook.service';
  import { VoicesService } from '@/services/voices.service';

  @Component({
  providers: [
    DictMeanService, DictNoteService, HtmlService, LanguageService,
    TextbookService, UnitPhraseService, UnitWordService, UserSettingService, AppService,
    PhrasesUnitService, SettingsService, WordsUnitService, AutoCorrectService,
    LangPhraseService, LangWordService, PhrasesLangService, WordsLangService,
    NoteService, WordsTextbookService, PhrasesTextbookService,
    VoicesService,
  ],
})
export default class App extends Vue {
  // @inject() appService!: AppService;
  clipped = true;
  drawer = true;
  items = [
    {
      icon: 'fa-bus fa-lg',
      title: 'Words in Unit',
      path: '/words-unit',
    },
    {
      icon: 'fa-bus fa-lg',
      title: 'Phrases in Unit',
      path: '/phrases-unit',
    },
    {
      icon: 'fa-plane fa-lg',
      title: 'Words in Language',
      path: '/words-lang',
    },
    {
      icon: 'fa-plane fa-lg',
      title: 'Phrases in Language',
      path: '/phrases-lang',
    },
    {
      icon: 'fa-taxi fa-lg',
      title: 'Words in Textbook',
      path: '/words-textbook',
    },
    {
      icon: 'fa-taxi fa-lg',
      title: 'Phrases in Textbook',
      path: '/phrases-textbook',
    },
    {
      icon: 'fa-cog fa-lg',
      title: 'Settings',
      path: '/settings',
    },
  ];
  miniVariant = false;
  title = 'Lolly Vue';
}
</script>
