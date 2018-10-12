import VueTypeScriptInject, { injectable } from 'vue-typescript-inject';
import { AppService } from './app.service';
import { SettingsService } from './settings.service';
import { UnitPhrase } from '../models/unit-phrase';
import { UnitPhraseService } from '../services/unit-phrase.service';
import { Observable } from 'rxjs';


@injectable()
export class PhrasesUnitService {

  unitPhrases: UnitPhrase[] = new Array(0);

  constructor(private unitPhraseService: UnitPhraseService,
              private settingsService: SettingsService,
              private appService: AppService) {
    appService.initializeComplete.subscribe(_ => this.getData());
  }

  getData() {
    if (this.appService.isInitialized) {
      this.unitPhraseService.getDataByTextbookUnitPart(this.settingsService.USTEXTBOOKID,
        this.settingsService.USUNITPARTFROM, this.settingsService.USUNITPARTTO)
        .subscribe(res => this.unitPhrases = res);
    }
  }

  create(item: UnitPhrase): Observable<number | any[]> {
    return this.unitPhraseService.create(item);
  }

  updateSeqNum(id: number, seqnum: number): Observable<number> {
    return this.unitPhraseService.updateSeqNum(id, seqnum);
  }

  update(item: UnitPhrase): Observable<number> {
    return this.unitPhraseService.update(item);
  }

  delete(id: number): Observable<number> {
    return this.unitPhraseService.delete(id);
  }

  reindex(onNext: (index: number) => void) {
    for (let i = 1; i <= this.unitPhrases.length; i++) {
      const item = this.unitPhrases[i - 1];
      if (item.SEQNUM === i) continue;
      item.SEQNUM = i;
      this.unitPhraseService.updateSeqNum(item.ID, item.SEQNUM).subscribe(_ => {
        onNext(i - 1);
      });
    }
  }

  newUnitPhrase(): UnitPhrase {
    const o = new UnitPhrase();
    o.TEXTBOOKID = this.settingsService.USTEXTBOOKID;
    const maxElem = this.unitPhrases.length === 0 ? null :
      this.unitPhrases.reduce((p, v) => p.unitPartSeqnum < v.unitPartSeqnum ? v : p);
    o.UNIT = maxElem ? maxElem.UNIT : this.settingsService.USUNITTO;
    o.PART = maxElem ? maxElem.PART : this.settingsService.USPARTTO;
    o.SEQNUM = (maxElem ? maxElem.SEQNUM : 0) + 1;
    return o;
  }

}
