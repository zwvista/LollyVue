import { injectable } from 'vue-typescript-inject';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { MLangWord, MLangWords } from '@/models/lang-word';
import { map } from 'rxjs/operators';

@injectable()
export class LangWordService extends BaseService {

  getDataByLang(langid: number, page: number, rows: number): Observable<MLangWords> {
    const url = `${this.baseUrl}VLANGWORDS?filter=LANGID,eq,${langid}&order=WORD&page=${page},${rows}`;
    return this.http.get<MLangWords>(url)
      .pipe(
        map(result => ({
          records: result.records.map(value => Object.assign(new MLangWord(), value)),
          _results: result._results,
        })),
      );
  }

  getDataByLangWord(langid: number, word: string): Observable<MLangWord[]> {
    const url = `${this.baseUrl}VLANGWORDS?filter=LANGID,eq,${langid}&filter=WORD,eq,${encodeURIComponent(word)}`;
    return this.http.get<MLangWords>(url)
      .pipe(
        map(result => result.records.map(value => Object.assign(new MLangWord(), value))
          // Api is case insensitive
          .filter(value => value.WORD === word),
        ),
      );
  }

  getDataById(id: number): Observable<MLangWord[]> {
    const url = `${this.baseUrl}VLANGWORDS?filter=ID,eq,${id}`;
    return this.http.get<MLangWords>(url)
      .pipe(
        map(result => result.records.map(value => Object.assign(new MLangWord(), value))),
      );
  }

  create(item: MLangWord): Observable<number | any[]> {
    const url = `${this.baseUrl}LANGWORDS`;
    (item as any).ID = null;
    return this.http.post<number | any[]>(url, item)
      .pipe(
      );
  }

  update(item: MLangWord): Observable<number> {
    const url = `${this.baseUrl}LANGWORDS/${item.ID}`;
    return this.http.put<number>(url, item).pipe(
    );
  }

  updateNote(id: number, note: string): Observable<number> {
    const url = `${this.baseUrl}LANGWORDS/${id}`;
    return this.http.put<number>(url, {ID: id, NOTE: note} as MLangWord).pipe(
    );
  }

  delete(id: number): Observable<number> {
    const url = `${this.baseUrl}LANGWORDS/${id}`;

    return (this.http.delete(url) as Observable<number>).pipe(
    );
  }
}
