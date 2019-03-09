import { injectable } from 'vue-typescript-inject';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseService } from './base.service';
import { DictMean, MDictNote, MDictsMean, MDictsNote } from '../models/dictionary';

@injectable()
export class DictMeanService extends BaseService {

  getDataByLang(langid: number): Observable<DictMean[]> {
    const url = `${this.baseUrl}VDICTSMEAN?transform=1&filter[]=LANGIDFROM,eq,${langid}`;
    return this.http.get<MDictsMean>(url)
      .pipe(
        map(result => result.VDICTSMEAN.map(value => Object.assign(new DictMean(), value))),
      );
  }

}

@injectable()
export class DictNoteService extends BaseService {

  getDataByLang(langid: number): Observable<MDictNote[]> {
    const url = `${this.baseUrl}VDICTSNOTE?transform=1&filter=LANGIDFROM,eq,${langid}`;
    return this.http.get<MDictsNote>(url)
      .pipe(
        map(result => result.VDICTSNOTE.map(value => Object.assign(new MDictNote(), value))),
      );
  }

}
