import { Mapper } from '../mappers';
import { Action } from '../actions';
import { DecisionRecord, DecisionTable } from '../models';
import * as expect from '@fantasticfiasco/expect';
import { isEqual } from 'lodash';
import * as jsonDiff from 'json-diff';
import { Reporting } from '../reporting';

export class TestRunner<T> {
  private actions: Array<Action<T>> = [];
  private passedTests: any[] = [];
  private failedTests: any[] = [];
  private reporting = new Reporting();

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

    this.summary();
  }

  private runTest(record: DecisionRecord, action: Action<T>) {
    const domainObject = this.mapper.toDomainObject(record);
    const updatedDomainObject = action.apply(domainObject);
    const testRecord = this.mapper.toDecisionRecord(updatedDomainObject);
    try {
      expect.toBeTrue(isEqual(record, testRecord), 'Test failed');
      this.passedTests.push({ status: 'Passed', expected: record, received: testRecord });
    } catch (err) {
      this.failedTests.push({ status: 'Failed', expected: record, received: testRecord });
    }
  }

  private summary() {
    console.log('==================================');
    console.log(`Passed: ${this.passedTests.length}`);
    console.log(`Failed: ${this.failedTests.length}`);
    console.log('==================================');

    this.failedTests.forEach((test) => {
      console.log('-------------------------------------------------------------');
      console.log(
        jsonDiff.diffString(test.received, test.expected, {
          color: true,
        }),
      );
      console.error('Received: ');
      this.reporting.print(test.received);
      console.info('Expected: ');
      this.reporting.print(test.expected);
      console.log('-------------------------------------------------------------');
    });
  }
}
