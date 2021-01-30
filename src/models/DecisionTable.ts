export interface DecisionRecord {
  [key: string]: DecisionRecordValue
}

export type DecisionRecordValue =  string | null | undefined | boolean | number;


export type DecisionTable = DecisionRecord[];
