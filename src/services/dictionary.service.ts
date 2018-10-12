import VueTypeScriptInject, { injectable } from "vue-typescript-inject";
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Rxios } from '../common/rxios'
import { BaseService } from './base.service';
import { DictNote, DictOffline, DictOnline, DictsNote, DictsOffline, DictsOnline } from '../models/dictionary';

@injectable()
export class DictOnlineService extends BaseService {

  getDataByLang(langid: number): Observable<DictOnline[]> {
    const url = `${this.baseUrl}VDICTSONLINE?transform=1&filter=LANGIDFROM,eq,${langid}`;
    return this.http.get<DictsOnline>(url)
      .pipe(
        map(result => result.VDICTSONLINE.map(value => Object.assign(new DictOnline(), value)))
      );
  }

}

@injectable()
export class DictOfflineService extends BaseService {

  getDataByLang(langid: number): Observable<DictOffline[]> {
    const url = `${this.baseUrl}VDICTSOFFLINE?transform=1&filter=LANGIDFROM,eq,${langid}`;
    return this.http.get<DictsOffline>(url)
      .pipe(
        map(result => result.VDICTSOFFLINE.map(value => Object.assign(new DictOffline(), value)))
      );
  }

}

@injectable()
export class DictNoteService extends BaseService {

  getDataByLang(langid: number): Observable<DictNote[]> {
    const url = `${this.baseUrl}VDICTSNOTE?transform=1&filter=LANGIDFROM,eq,${langid}`;
    return this.http.get<DictsNote>(url)
      .pipe(
        map(result => result.VDICTSNOTE.map(value => Object.assign(new DictNote(), value)))
      );
  }

}
