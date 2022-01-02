import { injectable } from 'vue-typescript-inject';
import { ReplaySubject } from 'rxjs';
import { SettingsService } from './settings.service';

@injectable()
export class AppService {

  private _initializeObject: ReplaySubject<void> = new ReplaySubject<void>();
  get initializeObject() {
    return this._initializeObject.asObservable();
  }

  isInitialized = false;

  constructor(private settingsService: SettingsService) {
  }

  async getData() {
    await this.settingsService.getData();
    this.isInitialized = true;
    this._initializeObject.next();
  }

}
