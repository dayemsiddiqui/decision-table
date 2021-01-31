import { Mapper } from '../mappers';
import { Action } from '../actions';
import { DecisionRecord, DecisionTable } from '../tables';
import * as expect from '@fantasticfiasco/expect';
import { isEqual } from 'lodash';
import * as jsonDiff from 'json-diff';

type JestTestCase = [string, any, any];

export class TestRunner<T> {
  private actions: Array<Action<T>> = [];
  private passedTests: any[] = [];
  private failedTests: any[] = [];
  private outcomeKey = '';
  private descriptionGenerators: Array<(record: DecisionRecord) => string | undefined> = [];

  // TODO: later extend the outcome key to complete multiple attributes
  constructor(private table: DecisionTable, private mapper: Mapper<T>) {}

  registerAction(action: Action<T>): TestRunner<T> {
    this.actions.push(action);
    return this;
  }

  public run(): void {
    this.passedTests = [];
    this.failedTests = [];
    if (this.actions.length === 0) {
      throw new Error('No action registered');
    }
    this.actions.forEach((action) => {
      this.table.forEach((record) => {
        this.runTest(record, action);
      });
    });
  }

  private applyAction(record: DecisionRecord, action: Action<T>) {
    const domainObject = this.mapper.toDomainObject(record);
    const updatedDomainObject = action.apply(domainObject);
    const testRecord = this.mapper.toDecisionRecord(updatedDomainObject);
    return {
      testRecord,
      updatedDomainObject,
    };
  }

  private runTest(record: DecisionRecord, action: Action<T>) {
    const { testRecord } = this.applyAction(record, action);
    try {
      expect.toBeTrue(isEqual(record, testRecord), 'Test failed');
      this.passedTests.push({ status: 'Passed', expected: record, received: testRecord });
    } catch (err) {
      this.failedTests.push({ status: 'Failed', expected: record, received: testRecord });
    }
  }

  getJestTestCases(): any[][] {
    const cases: JestTestCase[] = [];
    if (this.actions.length === 0) {
      throw new Error('No action registered');
    }
    this.actions.forEach((action) => {
      this.table.forEach((record) => {
        const { updatedDomainObject } = this.applyAction(record, action);
        cases.push([this.getDescription(record), this.mapper.toDomainObject(record), updatedDomainObject]);
      });
    });

    return cases;
  }

  addOutcomeKey(key: string): TestRunner<T> {
    this.outcomeKey = key;
    return this;
  }

  addDescription(callback: (record: DecisionRecord) => string | undefined): TestRunner<T> {
    this.descriptionGenerators.push(callback);
    return this;
  }

  private getDescription(record: DecisionRecord): string {
    let desc = `${this.outcomeKey} should be ${record[this.outcomeKey]}`;
    this.descriptionGenerators.forEach((generator) => {
      const conditionDescription = generator(record);
      if (conditionDescription) {
        desc = desc + ' when:  \n' + conditionDescription;
      }
    });
    return desc;
  }

  summary() {
    console.log('==================================');
    console.log(`Passed: ${this.passedTests.length}`);
    console.log(`Failed: ${this.failedTests.length}`);
    console.log('==================================');

    this.failedTests.forEach((test) => {
      console.log('-------------------------------------------------------------');
      console.log();
      console.log(`${this.outcomeKey} should be ${test.expected[this.outcomeKey]} when: `);
      this.descriptionGenerators.forEach((generator) => {
        const conditionDescription = generator(test.expected);
        if (conditionDescription) {
          console.log(conditionDescription);
        }
      });
      console.log(
        jsonDiff.diffString(test.received, test.expected, {
          color: true,
        }),
      );
      console.log('-------------------------------------------------------------');
    });
  }
}
