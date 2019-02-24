import { injectable } from 'vue-typescript-inject';
import { TextbookPhraseService } from '../services/textbook-phrase.service';
import { SettingsService } from './settings.service';
import { AppService } from './app.service';
import { concatMap, map } from 'rxjs/operators';
import { TextbookPhrase } from '../models/textbook-phrase';

@injectable()
export class PhrasesTextbookService {

  textbookPhrases: TextbookPhrase[] = new Array(0);

  constructor(private textbookPhraseService: TextbookPhraseService,
              private settingsService: SettingsService,
              private appService: AppService) {
  }

  getData() {
    return this.appService.initializeComplete.pipe(
      concatMap(_ => this.textbookPhraseService.getDataByLang(this.settingsService.selectedLang.ID)),
      map(res => this.textbookPhrases = res),
    );
  }
}
