import { injectable } from 'vue-typescript-inject';
import { SettingsService } from './settings.service';
import { AppService } from './app.service';
import { LangWordService } from '@/services/lang-word.service';
import { Observable } from 'rxjs';
import { MLangWord } from '@/models/lang-word';
import { concatMap, map } from 'rxjs/operators';
import { NoteService } from '@/view-models/note.service';
import { WordsFamiService } from '@/view-models/words-fami.service';

@injectable()
export class WordsLangService {

  langWords: MLangWord[] = [];
  langWordsCount = 0;

  constructor(private langWordService: LangWordService,
              private wordsFamiService: WordsFamiService,
              private settingsService: SettingsService,
              private appService: AppService,
              private noteService: NoteService) {
  }

  getData(page: number, rows: number, filter: string, filterType: number): Observable<void> {
    return this.appService.initializeObject.pipe(
      concatMap(_ => this.langWordService.getDataByLang(this.settingsService.selectedLang.ID, page, rows, filter, filterType)),
      map(res => {
        this.settingsService.setColorStyles(res.records);
        this.langWords = res.records;
        this.langWordsCount = res.results;
      }),
    );
  }

  create(item: MLangWord): Observable<number | any[]> {
    return this.langWordService.create(item);
  }

  updateNote(id: number, note: string): Observable<number> {
    return this.langWordService.updateNote(id, note);
  }

  update(item: MLangWord): Observable<number> {
    return this.langWordService.update(item);
  }

  delete(item: MLangWord): Observable<string> {
    return this.langWordService.delete(item);
  }

  newLangWord(): MLangWord {
    const o = new MLangWord();
    o.LANGID = this.settingsService.selectedLang.ID;
    return o;
  }

  getNote(index: number): Observable<number> {
    const item = this.langWords[index];
    return this.noteService.getNote(item.WORD).pipe(
      concatMap(note => {
        item.NOTE = note;
        return this.updateNote(item.ID, note);
      }),
    );
  }
}
