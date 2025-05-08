export interface Ticket {
  id: string;
  userId: string;
  routeId: string;
  busId: string;
  seatNumbers: string[];
  status: 'confirmed' | 'cancelled';
  bookingDate: string;
  travelDate: string;
  price: number;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
}

export const tickets: Ticket[] = [
  {
    id: 'ticket-1',
    userId: '1',
    routeId: 'route-1',
    busId: 'bus-1',
    seatNumbers: ['A3', 'A4'],
    status: 'confirmed',
    bookingDate: '2025-05-01T10:30:00Z',
    travelDate: '2025-05-10',
    price: 90,
    from: 'New York',
    to: 'Boston',
    departureTime: '08:00',
    arrivalTime: '12:00'
  },
  {
    id: 'ticket-2',
    userId: '1',
    routeId: 'route-3',
    busId: 'bus-3',
    seatNumbers: ['B5'],
    status: 'cancelled',
    bookingDate: '2025-05-02T14:15:00Z',
    travelDate: '2025-05-15',
    price: 55,
    from: 'New York',
    to: 'Washington DC',
    departureTime: '09:30',
    arrivalTime: '13:30'
  },
  {
    id: 'ticket-3',
    userId: '2',
    routeId: 'route-2',
    busId: 'bus-2',
    seatNumbers: ['C2', 'C3', 'C4'],
    status: 'confirmed',
    bookingDate: '2025-05-03T09:45:00Z',
    travelDate: '2025-05-12',
    price: 135,
    from: 'Boston',
    to: 'New York',
    departureTime: '14:00',
    arrivalTime: '18:00'
  }
];