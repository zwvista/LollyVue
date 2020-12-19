import { injectable } from 'vue-typescript-inject';
import { BaseService } from './base.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MUSMapping, MUSMappings } from '@/models/wpp/usmapping';

@injectable()
export class UsMappingService extends BaseService {

  getData(): Observable<MUSMapping[]> {
    const url = `${this.baseUrlAPI}USMAPPINGS`;
    return this.http.get<MUSMappings>(url)
      .pipe(
        map(result => result.records.map(value => Object.assign(new MUSMapping(), value))),
      );
  }
}
