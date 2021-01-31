import { Repository } from '../repository';
import { TestRunner } from './TestRunner';
import { Mapper } from '../mappers';
import { Booking, BookingStatus, TransportMode, TransportType, updateBookingStatus } from './domain';
import { Action } from '../actions';

const setup = () => {
  const repo = new Repository();
  repo.rehydrateSync();
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
        return 'transport type is fcl';
      }
    });

  return runner.getJestTestCases();
};

export const cases = setup();
