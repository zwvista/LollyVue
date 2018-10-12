import VueTypeScriptInject, { injectable } from "vue-typescript-inject";
import { Rxios } from 'rxios';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Language, Languages } from '../models/language';

@injectable()
export class LanguageService extends BaseService {

  getData(): Observable<Language[]> {
    const url = `${this.baseUrl}LANGUAGES?transform=1&filter=ID,neq,0`;
    return this.http.get<Languages>(url)
      .pipe(
        // https://stackoverflow.com/questions/5873624/parse-json-string-into-a-particular-object-prototype-in-javascript
        map(result => result.LANGUAGES.map(value => Object.assign(new Language(), value)))
      );
  }
}
