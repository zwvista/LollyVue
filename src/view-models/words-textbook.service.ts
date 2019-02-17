import VueTypeScriptInject, { injectable } from 'vue-typescript-inject';
import { SettingsService } from './settings.service';
import { AppService } from './app.service';
import { TextbookWordService } from '../services/textbook-word.service';
import { Observable } from 'rxjs';
import { TextbookWord } from '../models/textbook-word';
import { concatMap, map } from 'rxjs/operators';
import { UnitWordService } from '@/services/unit-word.service';
import { LangWordService } from '@/services/lang-word.service';
import { NoteService } from '@/view-models/note.service';

@injectable()
export class WordsTextbookService {

  textbookWords: TextbookWord[] = new Array(0);

  constructor(private textbookWordService: TextbookWordService,
              private langWordService: LangWordService,
              private settingsService: SettingsService,
              private appService: AppService,
              private noteService: NoteService) {
  }

  getData() {
    return this.appService.initializeComplete.pipe(
      concatMap(_ => this.textbookWordService.getDataByLang(this.settingsService.selectedLang.ID)),
      map(res => this.textbookWords = res),
    );
  }

  updateNote(wordid: number, note: string): Observable<number> {
    return this.langWordService.updateNote(wordid, note);
  }

  getNote(index: number): Observable<number> {
    const item = this.textbookWords[index];
    return this.noteService.getNote(item.WORD).pipe(
      concatMap(note => {
        item.NOTE = note;
        return this.updateNote(item.WORDID, note);
      }),
    );
  }
}