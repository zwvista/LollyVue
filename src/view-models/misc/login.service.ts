import { injectable } from 'vue-typescript-inject';
import { UserService } from '@/services/misc/user.service';
import { MUser } from '@/models/misc/user';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@injectable()
export class LoginService {

  item = new MUser();

  constructor(private userService: UserService) {
  }

  login(): Observable<string> {
    return this.userService.getDataByLang(this.item.USERNAME, this.item.PASSWORD).pipe(
      map(res => res.length === 0 ? '' : res[0].USERID),
    );
  }
}
