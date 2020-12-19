import { injectable } from 'vue-typescript-inject';
import { WordFamiService } from '@/services/word-fami.service';
import { MWordFami } from '@/models/misc/word-fami';
import { EMPTY as empty, Observable } from 'rxjs';
import { concatMap } from 'rxjs/operators';

@injectable()
export class WordsFamiService {

  userid = 1;

  constructor(private wordFamiService: WordFamiService) { }

  delete(id: number): Observable<number> {
    return this.wordFamiService.delete(id);
  }


}

