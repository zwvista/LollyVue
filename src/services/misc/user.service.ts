import { injectable } from 'vue-typescript-inject';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MUser, MUsers } from '@/models/misc/user';

@injectable()
export class UserService extends BaseService {

  getDataByLang(username: string, password: string): Observable<MUser[]> {
    const url = `${this.baseUrlAPI}USERS?filter=USERNAME,eq,${username}&filter=PASSWORD,eq,${password}`;
    return this.http.get<MUsers>(url).pipe(
      map(result => result.records.map(value => Object.assign(new MUser(), value))),
    );
  }
}
