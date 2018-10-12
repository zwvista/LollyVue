import VueTypeScriptInject, { injectable } from "vue-typescript-inject";
import { BaseService } from './base.service';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Rxios } from 'rxios';
import { UserSetting, UserSettings } from '../models/user-setting';

@injectable()
export class UserSettingService extends BaseService {

  getDataByUser(userid: number): Observable<UserSetting[]> {
    const url = `${this.baseUrl}USERSETTINGS?transform=1&filter=USERID,eq,${userid}`;
    return (this.http.get(url) as Observable<UserSettings>)
      .pipe(
        map(result => result.USERSETTINGS.map(value => Object.assign(new UserSetting(), value)))
      );
  }

  updateLang(id: number, langid: number): Observable<number> {
    const url = `${this.baseUrl}USERSETTINGS/${id}`;
    return (this.http.put(url, {VALUE1: langid} as UserSetting) as Observable<number>).pipe(
    );
  }

  updateTextbook(id: number, textbookid: number): Observable<number> {
    const url = `${this.baseUrl}USERSETTINGS/${id}`;
    return (this.http.put(url, {VALUE1: textbookid} as UserSetting) as Observable<number>).pipe(
    );
  }

  updateDictOnline(id: number, dictonlineid: number): Observable<number> {
    const url = `${this.baseUrl}USERSETTINGS/${id}`;
    return (this.http.put(url, {VALUE2: dictonlineid} as UserSetting) as Observable<number>).pipe(
    );
  }

  updateDictNote(id: number, dictnoteid: number): Observable<number> {
    const url = `${this.baseUrl}USERSETTINGS/${id}`;
    return (this.http.put(url, {VALUE3: dictnoteid} as UserSetting) as Observable<number>).pipe(
    );
  }

  updateUnitFrom(id: number, unitfrom: number): Observable<number> {
    const url = `${this.baseUrl}USERSETTINGS/${id}`;
    return (this.http.put(url, {VALUE1: unitfrom} as UserSetting) as Observable<number>).pipe(
    );
  }

  updatePartFrom(id: number, partfrom: number): Observable<number> {
    const url = `${this.baseUrl}USERSETTINGS/${id}`;
    return (this.http.put(url, {VALUE2: partfrom} as UserSetting) as Observable<number>).pipe(
    );
  }

  updateUnitTo(id: number, unitto: number): Observable<number> {
    const url = `${this.baseUrl}USERSETTINGS/${id}`;
    return (this.http.put(url, {VALUE3: unitto} as UserSetting) as Observable<number>).pipe(
    );
  }

  updatePartTo(id: number, partto: number): Observable<number> {
    const url = `${this.baseUrl}USERSETTINGS/${id}`;
    return (this.http.put(url, {VALUE4: partto} as UserSetting) as Observable<number>).pipe(
    );
  }
}
