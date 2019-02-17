import { UnitWord } from '@/models/unit-word';
import { TextbookWord } from '@/models/textbook-word';

export class LangWords {
  VLANGWORDS!: LangWord[];
}
export class LangWord {
  ID = 0;
  LANGID = 0;
  WORD = '';
  NOTE: string | null = null;
  FAMIID = 0;
  LEVEL = 0;

  constructor() {}

  // https://stackoverflow.com/questions/47540501/typescript-constructor-overloading
  static fromUnit(item: UnitWord): LangWord {
    const o = new LangWord();
    o.ID = item.WORDID;
    o.LANGID = item.LANGID;
    o.WORD = item.WORD;
    o.NOTE = item.NOTE;
    return o;
  }
  static fromTextbook(item: TextbookWord): LangWord {
    const o = new LangWord();
    o.ID = item.WORDID;
    o.LANGID = item.LANGID;
    o.WORD = item.WORD;
    o.NOTE = item.NOTE;
    return o;
  }

  combineNote(note: string | null): boolean {
    const oldNote = this.NOTE;
    if (note) {
      if (!this.NOTE)
        this.NOTE = note;
      else {
        const arr = note.split(',');
        if (!arr.includes(note))
          arr.push(note);
        this.NOTE = arr.join(',');
      }
    }
    return oldNote !== this.NOTE;
  }
}
