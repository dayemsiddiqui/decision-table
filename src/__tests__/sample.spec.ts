import { cases } from '../testrunner/prep';

describe('This is a sample test', () => {
  describe('sample', async () => {
    it.each(cases)('%s', (description, expectedBooking, receivedBooking) => {
      expect(receivedBooking).toMatchObject(expectedBooking);
    });
  });
});
