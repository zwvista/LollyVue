import { injectable } from 'vue-typescript-inject';
import { BaseService } from './base.service';
import { MVoice, MVoices } from '@/models/misc/voice';

@injectable()
export class VoiceService extends BaseService {

  async getDataByLang(langid: number): Promise<MVoice[]> {
    const url = `${this.baseUrlAPI}VVOICES?filter=LANGID,eq,${langid}&filter=VOICETYPEID,eq,5`;
    const result = await this.httpGet<MVoices>(url);
    return result.records.map(value => Object.assign(new MVoice(), value));
  }
}
