export interface Booking {
  lineItems: any[];
  transportMode: TransportMode;
  transportType: TransportType;
  status: BookingStatus;
}

export enum TransportMode {
  sea = 'sea',
  air = 'air',
}

export enum TransportType {
  lcl = 'lcl',
  fcl = 'fcl',
}

export enum BookingStatus {
  open = 'open',
  complete = 'complete',
}

export const updateBookingStatus = (booking: Booking) => {
  if (booking.lineItems.length === 0) {
    booking.status = BookingStatus.open;
  }
};
