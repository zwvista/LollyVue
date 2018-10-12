import VueTypeScriptInject, { injectable } from "vue-typescript-inject";
import { Rxios } from 'rxios';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Textbook, Textbooks } from '../models/textbook';

@injectable()
export class TextbookService extends BaseService {

  getDataByLang(langid: number): Observable<Textbook[]> {
    const url = `${this.baseUrl}TEXTBOOKS?transform=1&filter=LANGID,eq,${langid}`;
    return (this.http.get(url) as Observable<Textbooks>)
      .pipe(
        map(result => result.TEXTBOOKS.map(value => Object.assign(new Textbook(), value)))
      );
  }

}
