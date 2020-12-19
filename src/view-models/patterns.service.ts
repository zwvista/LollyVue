import { injectable } from 'vue-typescript-inject';
import { SettingsService } from './settings.service';
import { AppService } from './app.service';
import { MPattern } from '../models/wpp/pattern';
import { concatMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { PatternService } from '../services/wpp/pattern.service';

@injectable()
export class PatternsService {

  patterns: MPattern[] = [];
  patternsCount = 0;

  constructor(private patternService: PatternService,
              private settingsService: SettingsService,
              private appService: AppService) {
  }

  getData(page: number, rows: number, filter: string, filterType: number) {
    return this.appService.initializeObject.pipe(
      concatMap(_ => this.patternService.getDataByLang(this.settingsService.selectedLang.ID, page, rows, filter, filterType)),
      map(res => {
        this.patterns = res.records;
        this.patternsCount = res.results;
      }),
    );
  }

  create(item: MPattern): Observable<number | any[]> {
    return this.patternService.create(item);
  }

  update(item: MPattern): Observable<number> {
    return this.patternService.update(item);
  }

  delete(id: number): Observable<number> {
    return this.patternService.delete(id);
  }

  newPattern(): MPattern {
    const o = new MPattern();
    o.LANGID = this.settingsService.selectedLang.ID;
    return o;
  }
}
