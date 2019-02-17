import VueTypeScriptInject, { injectable } from 'vue-typescript-inject';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TextbookWord, TextbookWords } from '../models/textbook-word';

@injectable()
export class TextbookWordService extends BaseService {

  getDataByLang(langid: number): Observable<TextbookWord[]> {
    const url = `${this.baseUrl}VTEXTBOOKWORDS?transform=1&filter=LANGID,eq,${langid}&order[]=UNIT&order[]=PART&order[]=SEQNUM`;
    return this.http.get<TextbookWords>(url)
      .pipe(
        map(result => result.VTEXTBOOKWORDS.map(value => Object.assign(new TextbookWord(), value))),
      );
  }
}
