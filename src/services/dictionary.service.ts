import { injectable } from 'vue-typescript-inject';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseService } from './base.service';
import {
  DictReference,
  MDictNote,
  MDictsReference,
  MDictsNote,
  MDictsTranslation,
  MDictTranslation,
} from '@/models/dictionary';

@injectable()
export class DictReferenceService extends BaseService {

  getDataByLang(langid: number): Observable<DictReference[]> {
    const url = `${this.baseUrl}VDICTSREFERENCE?filter=LANGIDFROM,eq,${langid}&order=SEQNUM&order=DICTNAME`;
    return this.http.get<MDictsReference>(url)
      .pipe(
        map(result => result.records.map(value => Object.assign(new DictReference(), value))),
      );
  }

}

@injectable()
export class DictNoteService extends BaseService {

  getDataByLang(langid: number): Observable<MDictNote[]> {
    const url = `${this.baseUrl}VDICTSNOTE?filter=LANGIDFROM,eq,${langid}`;
    return this.http.get<MDictsNote>(url)
      .pipe(
        map(result => result.records.map(value => Object.assign(new MDictNote(), value))),
      );
  }

}

@injectable()
export class DictTranslationService extends BaseService {

  getDataByLang(langid: number): Observable<MDictTranslation[]> {
    const url = `${this.baseUrl}VDICTSTRANSLATION?filter=LANGIDFROM,eq,${langid}`;
    return this.http.get<MDictsTranslation>(url)
      .pipe(
        map(result => result.records.map(value => Object.assign(new MDictTranslation(), value))),
      );
  }

}
