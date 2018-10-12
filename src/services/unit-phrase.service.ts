import VueTypeScriptInject, { injectable } from "vue-typescript-inject";
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Rxios } from 'rxios';
import { UnitPhrase, UnitPhrases } from '../models/unit-phrase';
import { BaseService } from './base.service';
import { Textbooks } from "@/models/textbook";

@injectable()
export class UnitPhraseService extends BaseService {
  
  getDataByTextbookUnitPart(textbookid: number, unitPartFrom: number, unitPartTo: number): Observable<UnitPhrase[]> {
    const url = `${this.baseUrl}VUNITPHRASES?transform=1&filter[]=TEXTBOOKID,eq,${textbookid}&filter[]=UNITPART,bt,${unitPartFrom},${unitPartTo}&order[]=UNITPART&order[]=SEQNUM`;
    return this.http.get<UnitPhrases>(url)
      .pipe(
        map(result => result.VUNITPHRASES.map(value => Object.assign(new UnitPhrase(), value)))
      );
  }

  create(item: UnitPhrase): Observable<number | any[]> {
    const url = `${this.baseUrl}UNITPHRASES`;
    return this.http.post<number | any[]>(url, item)
      .pipe(
      );
  }

  updateSeqNum(id: number, seqnum: number): Observable<number> {
    const url = `${this.baseUrl}UNITPHRASES/${id}`;
    return this.http.put<number>(url, {ID: id, SEQNUM: seqnum} as UnitPhrase).pipe(
    );
  }

  update(item: UnitPhrase): Observable<number> {
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
