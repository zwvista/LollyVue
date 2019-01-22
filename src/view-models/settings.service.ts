
import {map, mergeMap} from 'rxjs/operators';
import VueTypeScriptInject, { injectable } from 'vue-typescript-inject';
import { LanguageService } from '../services/language.service';
import { UserSettingService } from '../services/user-setting.service';
import { UserSetting } from '../models/user-setting';
import { Language } from '../models/language';
import { DictNote, DictPicker, DictWord } from '../models/dictionary';
import { Textbook } from '../models/textbook';
import { forkJoin ,  Observable } from 'rxjs';
import { DictNoteService, DictWordService } from '../services/dictionary.service';
import { TextbookService } from '../services/textbook.service';
import { AutoCorrect } from '@/models/autocorrect';
import { AutoCorrectService } from '@/services/autocorrect.service';
import * as _ from 'lodash';

const userid = 1;

@injectable()
export class SettingsService {

  userSettings: UserSetting[] = new Array(0);
  private selectedUSUserIndex!: number;
  private get selectedUSUser(): UserSetting {
    return this.userSettings[this.selectedUSUserIndex];
  }
  private get USLANGID(): number {
    return +this.selectedUSUser.VALUE1;
  }
  private set USLANGID(newValue: number) {
    this.selectedUSUser.VALUE1 = String(newValue);
  }
  private selectedUSLangIndex!: number;
  private get selectedUSLang(): UserSetting {
    return this.userSettings[this.selectedUSLangIndex];
  }
  get USTEXTBOOKID(): number {
    return +this.selectedUSLang.VALUE1;
  }
  set USTEXTBOOKID(newValue: number) {
    this.selectedUSLang.VALUE1 = String(newValue);
  }
  get USDICTPICKER(): string {
    return this.selectedUSLang.VALUE2;
  }
  set USDICTPICKER(newValue: string) {
    this.selectedUSLang.VALUE2 = newValue;
  }
  get USDICTNOTEID(): number {
    return +this.selectedUSLang.VALUE3;
  }
  set USDICTNOTEID(newValue: number) {
    this.selectedUSLang.VALUE3 = String(newValue);
  }
  get USDICTSPICKER(): string {
    return this.selectedUSLang.VALUE4;
  }
  set USDICTSPICKER(newValue: string) {
    this.selectedUSLang.VALUE4 = newValue;
  }
  private selectedUSTextbookIndex!: number;
  get selectedUSTextbook(): UserSetting {
    return this.userSettings[this.selectedUSTextbookIndex];
  }
  get USUNITFROM(): number {
    return +this.selectedUSTextbook.VALUE1;
  }
  set USUNITFROM(newValue: number) {
    this.selectedUSTextbook.VALUE1 = String(newValue);
  }
  get USPARTFROM(): number {
    return +this.selectedUSTextbook.VALUE2;
  }
  set USPARTFROM(newValue: number) {
    this.selectedUSTextbook.VALUE2 = String(newValue);
  }
  get USUNITTO(): number {
    return +this.selectedUSTextbook.VALUE3;
  }
  set USUNITTO(newValue: number) {
    this.selectedUSTextbook.VALUE3 = String(newValue);
  }
  get USPARTTO(): number {
    return +this.selectedUSTextbook.VALUE4;
  }
  set USPARTTO(newValue: number) {
    this.selectedUSTextbook.VALUE4 = String(newValue);
  }
  get USUNITPARTFROM(): number {
    return this.USUNITFROM * 10 + this.USPARTFROM;
  }
  get USUNITPARTTO(): number {
    return this.USUNITTO * 10 + this.USPARTTO;
  }
  get isSingleUnitPart(): boolean {
    return this.USUNITPARTFROM === this.USUNITPARTTO;
  }
  get isInvalidUnitPart(): boolean {
    return this.USUNITPARTFROM > this.USUNITPARTTO;
  }

  languages: Language[] = new Array(0);
  private selectedLangIndex!: number;
  get selectedLang(): Language {
    return this.languages[this.selectedLangIndex];
  }

  dictsWord: DictWord[] = new Array(0);
  dictsPicker: DictPicker[] = new Array(0);
  private _selectedDictPickerIndex!: number;
  get selectedDictPickerIndex() {
    return this._selectedDictPickerIndex;
  }
  set selectedDictPickerIndex(newValue: number) {
    this._selectedDictPickerIndex = newValue;
    this.USDICTPICKER = this.selectedDictPicker.DICTID;
  }
  get selectedDictPicker(): DictPicker {
    return this.dictsPicker[this._selectedDictPickerIndex];
  }

  dictsNote: DictNote[] = new Array(0);
  private _selectedDictNoteIndex!: number;
  get selectedDictNoteIndex() {
    return this._selectedDictNoteIndex;
  }
  set selectedDictNoteIndex(newValue: number) {
    this._selectedDictNoteIndex = newValue;
    this.USDICTNOTEID = this.selectedDictNote!.ID;
  }
  get selectedDictNote(): DictNote | null {
    return this.dictsNote.length === 0 ? null : this.dictsNote[this._selectedDictNoteIndex];
  }

  textbooks: Textbook[] = new Array(0);
  private _selectedTextbookIndex!: number;
  get selectedTextbookIndex() {
    return this._selectedTextbookIndex;
  }
  set selectedTextbookIndex(newValue: number) {
    this._selectedTextbookIndex = newValue;
    this.setSelectedTextbookIndex();
  }
  get selectedTextbook(): Textbook {
    return this.textbooks[this._selectedTextbookIndex];
  }

  units: string[] = new Array(0);
  parts: string[] = new Array(0);

  autoCorrects: AutoCorrect[] = new Array(0);

  constructor(private langService: LanguageService,
              private userSettingService: UserSettingService,
              private dictWordService: DictWordService,
              private dictNoteService: DictNoteService,
              private textbookService: TextbookService,
              private autoCorrectService: AutoCorrectService) { }

  getData(): Observable<void> {
    return forkJoin([this.langService.getData(), this.userSettingService.getDataByUser(userid)]).pipe(
      mergeMap(res => {
        this.languages = res[0] as Language[];
        this.userSettings = res[1] as UserSetting[];
        this.selectedUSUserIndex = this.userSettings.findIndex(value => value.KIND === 1);
        return this.setSelectedLangIndex(this.languages.findIndex(value => value.ID === this.USLANGID));
      }));
  }

  setSelectedLangIndex(langindex: number): Observable<void> {
    this.selectedLangIndex = langindex;
    this.USLANGID = this.selectedLang.ID;
    this.selectedUSLangIndex = this.userSettings.findIndex(value => value.KIND === 2 && value.ENTITYID === this.USLANGID);
    const dicts = this.USDICTSPICKER.split('\r\n');
    return forkJoin([
      this.dictWordService.getDataByLang(this.USLANGID),
      this.dictNoteService.getDataByLang(this.USLANGID),
      this.textbookService.getDataByLang(this.USLANGID),
      this.autoCorrectService.getDataByLang(this.USLANGID)]).pipe(
      map(res => {
        this.dictsWord = res[0] as DictWord[];
        let i = 0;
        this.dictsPicker = _.flatMap(dicts, d => {
          if (d === '0')
            return _.map(this.dictsWord, d2 => new DictPicker(String(d2.DICTID), d2.DICTNAME));
          else {
            i++;
            return [new DictPicker(d, `Custom${i}`)];
          }
        });
        this.selectedDictPickerIndex = this.dictsPicker.findIndex(value => value.DICTID === this.USDICTPICKER);
        this.dictsNote = res[1] as DictNote[];
        if (this.dictsNote.length > 0) {
          this.selectedDictNoteIndex = this.dictsNote.findIndex(value => value.ID === this.USDICTNOTEID);
        }
        this.textbooks = res[2] as Textbook[];
        this.selectedTextbookIndex = this.textbooks.findIndex(value => value.ID === this.USTEXTBOOKID);
        this.autoCorrects = res[3] as AutoCorrect[];
      }));
  }

  private setSelectedTextbookIndex() {
    this.USTEXTBOOKID = this.selectedTextbook.ID;
    this.selectedUSTextbookIndex = this.userSettings.findIndex(value => value.KIND === 3 && value.ENTITYID === this.USTEXTBOOKID);
    this.units = Array.from(Array(this.selectedTextbook.UNITS).keys()).map(value => String(value + 1));
    this.parts = this.selectedTextbook.PARTS.split(' ');
  }

  dictHtml(word: string, dictids: string[]): string {
    let s = '<html><body>\n';
    dictids.forEach((dictid, i) => {
      const item = this.dictsWord.find(v => String(v.DICTID) === dictid)!!;
      const ifrId = `ifr${i + 1}`;
      const url = item.urlString(word, this.autoCorrects);
      s += `<iframe id='$ifrId' frameborder='1' style='width:100%; height:500px; display:block' src='$url'></iframe>\n`;
    });
    s += '</body></html>\\n';
    return s;
  }

  updateLang(): Observable<number> {
    return this.userSettingService.updateLang(this.selectedUSUser.ID, this.USLANGID);
  }

  updateTextbook(): Observable<number> {
    return this.userSettingService.updateTextbook(this.selectedUSLang.ID, this.USTEXTBOOKID);
  }

  updateDictPicker(): Observable<number> {
    return this.userSettingService.updateDictPicker(this.selectedUSLang.ID, this.USDICTPICKER);
  }

  updateDictNote(): Observable<number> {
    return this.userSettingService.updateDictNote(this.selectedUSLang.ID, this.USDICTNOTEID);
  }

  updateUnitFrom(): Observable<number> {
    return this.userSettingService.updateUnitFrom(this.selectedUSTextbook.ID, this.USUNITFROM);
  }

  updatePartFrom(): Observable<number> {
    return this.userSettingService.updatePartFrom(this.selectedUSTextbook.ID, this.USPARTFROM);
  }

  updateUnitTo(): Observable<number> {
    return this.userSettingService.updateUnitTo(this.selectedUSTextbook.ID, this.USUNITTO);
  }

  updatePartTo(): Observable<number> {
    return this.userSettingService.updatePartTo(this.selectedUSTextbook.ID, this.USPARTTO);
  }

}
