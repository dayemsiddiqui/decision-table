import {DecisionRecord, DecisionRecordValue, DecisionTable} from "../tables";


interface ObjectDefinition {
  [key: string]: Array<DecisionRecordValue>;
}

export class TableGenerator {
  constructor(private objectDefinition: ObjectDefinition) {}

  generate(): DecisionTable {
    const rows = this.cartesian(...Object.values(this.objectDefinition));
    return this.mapHeader(rows);
  }

  private mapHeader(rows: any[][]): DecisionTable {
    const table: DecisionTable = rows.map((row) => {
      const decisionRecord: DecisionRecord = {};
      Object.keys(this.objectDefinition).map((key, index) => {
        decisionRecord[key] = row[index];
      });
      return decisionRecord;
    });
    return table;
  }

  private cartesian(...a: any[]): any[][] {
    return a.reduce((a, b) => a.flatMap((d: any) => b.map((e: any) => [d, e].flat())));
  }
}
