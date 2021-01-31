import { DecisionRecord } from '../tables';

export class Mapper<T> {
  constructor(
    public readonly toDomainObject: (table: DecisionRecord) => T,
    public readonly toDecisionRecord: (domainObject: T) => DecisionRecord,
  ) {}
}
