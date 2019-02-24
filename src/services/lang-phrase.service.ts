import { injectable } from 'vue-typescript-inject';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { LangPhrase, LangPhrases } from '../models/lang-phrase';
import { map } from 'rxjs/operators';

@injectable()
export class LangPhraseService extends BaseService {

  getDataByLang(langid: number, page: number, rows: number): Observable<LangPhrases> {
    const url = `${this.baseUrl}LANGPHRASES?transform=1&filter=LANGID,eq,${langid}&order=PHRASE&page=${page},${rows}`;
    return this.http.get<LangPhrases>(url)
      .pipe(
        map(result => ({
          LANGPHRASES: result.LANGPHRASES.map(value => Object.assign(new LangPhrase(), value)),
          _results: result._results,
        })),
      );
  }

  getDataByLangPhrase(langid: number, phrase: string): Observable<LangPhrase[]> {
    const url = `${this.baseUrl}LANGPHRASES?transform=1&filter[]=LANGID,eq,${langid}&filter[]=PHRASE,eq,${encodeURIComponent(phrase)}`;
    return this.http.get<LangPhrases>(url)
      .pipe(
        map(result => result.LANGPHRASES.map(value => Object.assign(new LangPhrase(), value))
          // Api is case insensitive
          .filter(value => value.PHRASE === phrase),
        ),
      );
  }

  getDataById(id: number): Observable<LangPhrase[]> {
    const url = `${this.baseUrl}LANGPHRASES?transform=1&filter=ID,eq,${id}`;
    return this.http.get<LangPhrases>(url)
      .pipe(
        map(result => result.LANGPHRASES.map(value => Object.assign(new LangPhrase(), value))),
      );
  }

  create(item: LangPhrase): Observable<number | any[]> {
    const url = `${this.baseUrl}LANGPHRASES`;
    return this.http.post<number | any[]>(url, item)
      .pipe(
      );
  }

  update(item: LangPhrase): Observable<number> {
    const url = `${this.baseUrl}LANGPHRASES/${item.ID}`;
    return this.http.put<number>(url, item).pipe(
    );
  }

  updateTranslation(id: number, translation: string): Observable<number> {
    const url = `${this.baseUrl}LANGPHRASES/${id}`;
    return this.http.put<number>(url, {ID: id, TRANSLATION: translation} as LangPhrase).pipe(
    );
  }

  delete(ID: number): Observable<number> {
    const url = `${this.baseUrl}LANGPHRASES/${ID}`;
    return (this.http.delete(url) as Observable<number>).pipe(
    );
  }
}
