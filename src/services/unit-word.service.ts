import VueTypeScriptInject, { injectable } from "vue-typescript-inject";
import { Rxios } from 'rxios';
import { UnitWord, UnitWords } from '../models/unit-word';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { BaseService } from './base.service';
import { UnitPhrases } from "@/models/unit-phrase";

@injectable()
export class UnitWordService extends BaseService {

  getDataByTextbookUnitPart(textbookid: number, unitPartFrom: number, unitPartTo: number): Observable<UnitWord[]> {
    const url = `${this.baseUrl}VUNITWORDS?transform=1&filter[]=TEXTBOOKID,eq,${textbookid}&filter[]=UNITPART,bt,${unitPartFrom},${unitPartTo}&order[]=UNITPART&order[]=SEQNUM`;
    return (this.http.get(url) as Observable<UnitWords>)
      .pipe(
        map(result => result.VUNITWORDS.map(value => Object.assign(new UnitWord(), value)))
      );
  }

  create(item: UnitWord): Observable<number | any[]> {
    const url = `${this.baseUrl}UNITWORDS`;
    return (this.http.post<number | any[]>(url, item) as Observable<number | any[]>)
      .pipe(
      );
  }

  updateSeqNum(id: number, seqnum: number): Observable<number> {
    const url = `${this.baseUrl}UNITWORDS/${id}`;
    return (this.http.put(url, {ID: id, SEQNUM: seqnum} as UnitWord) as Observable<number>).pipe(
    );
  }

  updateNote(id: number, note: string): Observable<number> {
    const url = `${this.baseUrl}UNITWORDS/${id}`;
    return (this.http.put(url, {ID: id, NOTE: note} as UnitWord) as Observable<number>).pipe(
    );
  }

  update(item: UnitWord): Observable<number> {
    const url = `${this.baseUrl}UNITWORDS/${item.ID}`;
    return (this.http.put(url, item) as Observable<number>).pipe(
    );
  }

  delete(id: number): Observable<number> {
    const url = `${this.baseUrl}UNITWORDS/${id}`;

    return (this.http.delete(url) as Observable<number>).pipe(
    );
  }

}
