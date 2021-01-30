import { DecisionRecord, DecisionRecordValue, DecisionTable } from '../models';
import { Repository } from '../repository';

export class AutoComplete {
  private index = 0;
  private repo = new Repository();
  constructor(private table: DecisionTable) {}

  /**
   * Add or Update key/value pair on each record
   * @param key
   * @param value
   * @private
   */
  update(key: string, value: DecisionRecordValue): void {
    if (!this.hasNext()) {
      throw new Error('No records found');
    }
    this.table[this.index][key] = value;
    this.index++;
    return;
  }

  /**
   * Tells you whether there is an element in the iterator or not
   * @private
   */
  hasNext(): boolean {
    return this.index < this.table.length;
  }

  currentRecord(): DecisionRecord {
    const deepClone = JSON.stringify(this.table[this.index]);
    return JSON.parse(deepClone);
  }

  progress() {
    return {
      total: this.table.length,
      current: this.index,
    };
  }

  persist(): void {
    this.repo.override(this.table);
  }
}
