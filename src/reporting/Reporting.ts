import { DecisionTable } from '../tables/DecisionTable';

export class Reporting {
  print(table: DecisionTable): void {
    console.table(table);
  }
}
