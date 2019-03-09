import { injectable } from 'vue-typescript-inject';
import { TextbookPhraseService } from '@/services/textbook-phrase.service';
import { SettingsService } from './settings.service';
import { AppService } from './app.service';
import { concatMap, map } from 'rxjs/operators';
import { MTextbookPhrase } from '@/models/textbook-phrase';

@injectable()
export class PhrasesTextbookService {

  textbookPhrases: MTextbookPhrase[] = [];
  textbookPhraseCount = 0;

  constructor(private textbookPhraseService: TextbookPhraseService,
              private settingsService: SettingsService,
              private appService: AppService) {
  }

  getData(page: number, rows: number) {
    return this.appService.initializeComplete.pipe(
      concatMap(_ => this.textbookPhraseService.getDataByLang(this.settingsService.selectedLang.ID,
        this.settingsService.textbooks, page, rows)),
      map(res => {
        this.textbookPhrases = res.VTEXTBOOKPHRASES;
        this.textbookPhraseCount = res._results;
      }),
    );
  }
}
