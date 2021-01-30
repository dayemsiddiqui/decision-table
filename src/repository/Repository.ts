import { DecisionTable } from '../models/DecisionTable';
import * as fs from 'fs';
import * as path from 'path';

interface LockFile {
  contents: {
    table: DecisionTable;
  };
}

export class Repository {
  private filename = '.decision-lock.json';
  private filepath = path.join(__dirname, this.filename);
  private table: DecisionTable = [];

  override(table: DecisionTable): void {
    const file = this.addTable(table).buildFile();
    const json = JSON.stringify(file);
    fs.writeFile(
      this.filename,
      json,
      {
        encoding: 'utf-8',
      },
      (err) => {
        if (err) throw err;
      },
    );
  }

  async rehydrate(): Promise<DecisionTable> {
    console.log('Reading File... Please Wait...');
    return await this.readLockFile();
  }

  getTable(): DecisionTable {
    return this.table;
  }

  private addTable(table: DecisionTable): Repository {
    this.table = table;
    return this;
  }

  private buildFile(): LockFile {
    return {
      contents: {
        table: this.table,
      },
    };
  }

  private readLockFile(): Promise<DecisionTable> {
    return new Promise<DecisionTable>((resolve, reject) => {
      const data = fs.readFileSync(this.filename, {
        encoding: 'utf-8',
      });
      if (!data) {
        reject();
      }
      const file: LockFile = JSON.parse(data);
      this.addTable(file.contents.table);
      resolve(this.table);
    });
  }
}
