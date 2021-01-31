import { TableGenerator } from './generator';
import { Repository } from './repository';
import { Reporting } from './reporting';
import { TestRunner } from './testrunner';
import { Booking, BookingStatus, TransportMode, TransportType, updateBookingStatus } from './testrunner/domain';
import { Mapper } from './mappers';
import { Action } from './actions';
import { DecisionTable } from './tables';

const generator = new TableGenerator({
  hasConflict: [true, false],
  transportMode: ['sea', 'air'],
  transportType: ['lcl', 'fcl'],
});

const table: DecisionTable = generator.generate();

const reporting = new Reporting();

const repo = new Repository();
const test = async () => {
  await repo.rehydrate();
  reporting.print(repo.getTable());

  const runner = new TestRunner(
    repo.getTable(),
    new Mapper<Booking>(
      (record) => ({
        status: record.status as BookingStatus,
        transportType: record.transportType as TransportType,
        transportMode: record.transportMode as TransportMode,
        lineItems: !record.hasConflict ? [] : [{ id: '1' }],
      }),
      (booking) => ({
        status: booking.status,
        transportMode: booking.transportMode,
        transportType: booking.transportType,
        hasConflict: booking.lineItems.length !== 0,
      }),
    ),
  )
    .registerAction(
      new Action<Booking>((booking) => {
        updateBookingStatus(booking);
        return booking;
      }),
    )
    .addOutcomeKey('status')
    .addDescription((record) => {
      if (record.transportType === TransportType.fcl) {
        return 'when transport type is fcl';
      }
    });

  runner.run();

  runner.summary();
};

test();

