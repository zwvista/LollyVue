import VueTypeScriptInject, { injectable } from "vue-typescript-inject";
import { ReplaySubject } from 'rxjs';
import { SettingsService } from './settings.service';

@injectable()
export class AppService {

  private _initializeComplete: ReplaySubject<void> = new ReplaySubject<void>();
  get initializeComplete() {
    return this._initializeComplete.asObservable();
  }

  isInitialized = false;

  constructor(private settingsService: SettingsService) {
    settingsService.getData().subscribe(_ => {
      this.isInitialized = true;
      this._initializeComplete.next(undefined);
    });
  }

}
