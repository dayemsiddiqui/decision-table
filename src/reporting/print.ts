import { DecisionTable } from '../models/DecisionTable';

export const printDecisionTable = (table: DecisionTable): void => {
  // ts-ignore
  console.table(table);
};
