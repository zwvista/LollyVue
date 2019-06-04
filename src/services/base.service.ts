import { Rxios } from '../common/rxios';

export class BaseService {
  protected readonly baseUrl = 'https://zwvista.tk/lolly/api.php/records/';
  protected readonly http = new Rxios();
}
