import { injectable } from 'vue-typescript-inject';
import { MUnitWord, MUnitWords } from '@/models/unit-word';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseService } from './base.service';
import { MTextbook } from '@/models/textbook';

@injectable()
export class UnitWordService extends BaseService {

  getDataByTextbookUnitPart(textbook: MTextbook, unitPartFrom: number, unitPartTo: number): Observable<MUnitWord[]> {
    const url = `${this.baseUrl}VUNITWORDS?filter=TEXTBOOKID,eq,${textbook.ID}&filter=UNITPART,bt,${unitPartFrom},${unitPartTo}&order=UNITPART&order=SEQNUM`;
    return this.http.get<MUnitWords>(url)
      .pipe(
        map(result => {
          const result2 = result.records.map(value => Object.assign(new MUnitWord(), value));
          result2.forEach(o => o.textbook = textbook);
          return result2;
        }),
      );
  }

  getDataByLang(langid: number, textbooks: MTextbook[], page: number, rows: number): Observable<MUnitWords> {
    const url = `${this.baseUrl}VUNITWORDS?filter=LANGID,eq,${langid}&order=TEXTBOOKID&order=UNIT&order=PART&order=SEQNUM&page=${page},${rows}`;
    return this.http.get<MUnitWords>(url)
      .pipe(
        map(result => ({
          records: result.records.map(value => {
            const v = Object.assign(new MUnitWord(), value);
            v.textbook = textbooks.find(o => o.ID === v.TEXTBOOKID)!;
            return v;
          }),
          results: result.results,
        })),
      );
  }

  getDataByLangWord(wordid: number): Observable<MUnitWord[]> {
    const url = `${this.baseUrl}VUNITWORDS?filter=WORDID,eq,${wordid}`;
    return this.http.get<MUnitWords>(url)
      .pipe(
        map(result => result.records.map(value => Object.assign(new MUnitWord(), value))),
      );
  }

  create(item: MUnitWord): Observable<number | any[]> {
    const url = `${this.baseUrl}UNITWORDS`;
    (item as any).ID = null;
    return this.http.post<number | any[]>(url, item)
      .pipe(
      );
  }

  updateSeqNum(id: number, seqnum: number): Observable<number> {
    const url = `${this.baseUrl}UNITWORDS/${id}`;
    return this.http.put<number>(url, {ID: id, SEQNUM: seqnum} as MUnitWord).pipe(
    );
  }

  update(item: MUnitWord): Observable<number> {
    const url = `${this.baseUrl}UNITWORDS/${item.ID}`;
    return this.http.put<number>(url, item).pipe(
    );
  }

  delete(id: number): Observable<number> {
    const url = `${this.baseUrl}UNITWORDS/${id}`;

    return (this.http.delete(url) as Observable<number>).pipe(
    );
  }

}
