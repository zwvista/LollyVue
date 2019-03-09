import { injectable } from 'vue-typescript-inject';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MUnitPhrase, MUnitPhrases } from '@/models/unit-phrase';
import { BaseService } from './base.service';
import { MTextbook } from '@/models/textbook';

@injectable()
export class UnitPhraseService extends BaseService {

  getDataByTextbookUnitPart(textbook: MTextbook, unitPartFrom: number, unitPartTo: number): Observable<MUnitPhrase[]> {
    const url = `${this.baseUrl}VUNITPHRASES?transform=1&filter[]=TEXTBOOKID,eq,${textbook.ID}&filter[]=UNITPART,bt,${unitPartFrom},${unitPartTo}&order[]=UNITPART&order[]=SEQNUM`;
    return this.http.get<MUnitPhrases>(url)
      .pipe(
        map(result => {
          const result2 = result.VUNITPHRASES.map(value => Object.assign(new MUnitPhrase(), value));
          result2.forEach(o => {
            o.units = textbook.units;
            o.parts = textbook.parts;
          });
          return result2;
        }),
      );
  }

  getDataByLangPhrase(phraseid: number): Observable<MUnitPhrase[]> {
    const url = `${this.baseUrl}VUNITPHRASES?transform=1&filter=PHRASEID,eq,${phraseid}`;
    return this.http.get<MUnitPhrases>(url)
      .pipe(
        map(result => result.VUNITPHRASES.map(value => Object.assign(new MUnitPhrase(), value))),
      );
  }

  create(item: MUnitPhrase): Observable<number | any[]> {
    const url = `${this.baseUrl}UNITPHRASES`;
    return this.http.post<number | any[]>(url, item)
      .pipe(
      );
  }

  updateSeqNum(id: number, seqnum: number): Observable<number> {
    const url = `${this.baseUrl}UNITPHRASES/${id}`;
    return this.http.put<number>(url, {ID: id, SEQNUM: seqnum} as MUnitPhrase).pipe(
    );
  }

  update(item: MUnitPhrase): Observable<number> {
    const url = `${this.baseUrl}UNITPHRASES/${item.ID}`;
    return this.http.put<number>(url, item).pipe(
    );
  }

  delete(ID: number): Observable<number> {
    const url = `${this.baseUrl}UNITPHRASES/${ID}`;
    return (this.http.delete(url) as Observable<number>).pipe(
    );
  }

}
