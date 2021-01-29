import { DecisionTable } from '../models/DecisionTable';
import * as fs from "fs";

interface LockFile {
  contents: {
    table: DecisionTable;
  };
}

export class Repository {
  private filename = '.decision-lock.json';
  private table: DecisionTable = []

  persist(table: DecisionTable): void {
      const file = this.addTable(table).buildFile()
      const json = JSON.stringify(file)
      fs.writeFile(this.filename, json, (err) => {
          if(err) throw err;
          console.info('Lock file written')
      })
  }

  private addTable(table: DecisionTable): Repository {
    this.table = table
    return this;
  }

  private buildFile(): LockFile {
      return {
          contents: {
              table: this.table
          }
      }
  }

}
