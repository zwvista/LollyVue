<template>
  <div>
    <v-toolbar>
      <v-btn color="info" @click="goBack()">Back</v-btn>
      <v-select :items="settingsService.dictsOnline" item-text="DICTNAME" v-model="selectedDictOnline"
                return-object="true" @change="refreshDict()"></v-select>
    </v-toolbar>
    <v-select :items="words" v-model="selectedWord" @change="refreshDict()"></v-select>
    <DictBrowser :url="dictUrl"></DictBrowser>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { inject } from 'vue-typescript-inject';
import { WordsUnitService } from '../view-models/words-unit.service';
import { SettingsService } from '../view-models/settings.service';
import { DictOnline } from '../models/dictionary';
import DictBrowser from '../components/DictBrowser.vue';

@Component({
  components: {DictBrowser},
})
export default class WordsDict extends Vue {
  @inject() wordsUnitService!: WordsUnitService;
  @inject() settingsService!: SettingsService;

  words: string[] | null = null;
  selectedWord: string | null = null;
  dictUrl = 'about:blank';
  selectedDictOnline: DictOnline | null = null;

  created() {
    this.words = this.wordsUnitService.unitWords.map(v  => v.WORD);
    this.selectedWord = this.words[+this.$route.params['index']];
    this.selectedDictOnline = this.settingsService.selectedDictOnline;
    if (this.selectedWord) this.refreshDict();
  }

  goBack(): void {
    this.$router.go(-1);
  }

  refreshDict() {
    this.dictUrl = this.selectedDictOnline!.urlString(this.selectedWord!);
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
