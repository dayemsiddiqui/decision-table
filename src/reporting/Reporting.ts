import { DecisionTable } from '../models/DecisionTable';

export class Reporting {
  print(table: DecisionTable): void {
    console.table(table);
  }
}
