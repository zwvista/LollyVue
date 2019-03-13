<template>
  <div>
    <v-toolbar>
      <v-btn color="info" @click="goBack()">Back</v-btn>
      <v-select :items="settingsService.dictItems" item-text="DICTNAME" v-model="selectedDictItem"
                return-object="true" @change="refreshDict()"></v-select>
    </v-toolbar>
    <v-select :items="words" v-model="selectedWord" @change="refreshDict()"></v-select>
    <DictBrowser :url="dictUrl" :htmlString="dictSrc"></DictBrowser>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { inject } from 'vue-typescript-inject';
  import { WordsUnitService } from '@/view-models/words-unit.service';
  import { SettingsService } from '@/view-models/settings.service';
  import { MDictItem } from '@/models/dictionary';
  import DictBrowser from '../components/DictBrowser.vue';
  import { HtmlService } from '@/services/html.service';
  import { WordsLangService } from '@/view-models/words-lang.service';

  @Component({
    components: {DictBrowser},
  })
  export default class WordsDict extends Vue {
    @inject() wordsUnitService!: WordsUnitService;
    @inject() wordsLangService!: WordsLangService;
    @inject() settingsService!: SettingsService;
    @inject() htmlService!: HtmlService;

    words: string[] | null = null;
    selectedWord: string | null = null;
    dictUrl = 'about:blank';
    dictSrc: string | null = null;
    selectedDictItem: MDictItem | null = null;

    created() {
      const dictType = this.$route.params['type'];
      this.words =
        dictType === 'unit' ? this.wordsUnitService.unitWords.map(v  => v.WORD) :
        dictType === 'textbook' ? this.wordsUnitService.textbookWords.map(v  => v.WORD) :
        this.wordsLangService.langWords.map(v  => v.WORD);
      this.selectedWord = this.words[+this.$route.params['index']];
      this.selectedDictItem = this.settingsService.selectedDictItem;
      if (this.selectedWord) this.refreshDict();
    }

    goBack(): void {
      this.$router.go(-1);
    }

    refreshDict() {
      const item = this.selectedDictItem!!;
      if (item.DICTNAME.startsWith('Custom'))
        this.dictSrc = this.settingsService.dictHtml(this.selectedWord!!, item.dictids());
      else {
        const item2 = this.settingsService.dictsMean.find(v => v.DICTNAME === item.DICTNAME)!!;
        const url = item2.urlString(this.selectedWord!, this.settingsService.autoCorrects);
        if (item2.DICTTYPENAME === 'OFFLINE') {
          this.dictUrl = 'about:blank';
          this.htmlService.getHtml(url).subscribe(html => {
            this.dictSrc = item2.htmlString(html, this.selectedWord!)
              .replace(/\n/g, ' ').replace(/"/g, '&quot;');
            console.log(this.dictSrc);
          });
        } else {
          this.dictSrc = null;
          this.dictUrl = url;
        }
      }
    }

    onload(event: Event) {
      // const iFrame = event.target as HTMLIFrameElement;
      // console.log(iFrame);
      // const iFrameBody = iFrame.contentWindow.document.body.innerHTML;
      // // if ( iFrame.contentDocument ) { // FF
      // //   iFrameBody = iFrame.contentDocument.getElementsByTagName('body')[0];
      // // } else if ( iFrame.contentWindow ) { // IE
      // //   iFrameBody = iFrame.contentWindow.document.getElementsByTagName('body')[0];
      // // }
      // console.log(iFrameBody);
    }
  }
</script>

<style>
  @import '../assets/common.css';
</style>
