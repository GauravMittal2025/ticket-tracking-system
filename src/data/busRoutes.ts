export interface BusRoute {
  id: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  busId: string;
}

export const busRoutes: BusRoute[] = [
  {
    id: 'route-1',
    from: 'New York',
    to: 'Boston',
    departureTime: '08:00',
    arrivalTime: '12:00',
    price: 45,
    busId: 'bus-1'
  },
  {
    id: 'route-2',
    from: 'Boston',
    to: 'New York',
    departureTime: '14:00',
    arrivalTime: '18:00',
    price: 45,
    busId: 'bus-2'
  },
  {
    id: 'route-3',
    from: 'New York',
    to: 'Washington DC',
    departureTime: '09:30',
    arrivalTime: '13:30',
    price: 55,
    busId: 'bus-3'
  },
  {
    id: 'route-4',
    from: 'Washington DC',
    to: 'New York',
    departureTime: '15:00',
    arrivalTime: '19:00',
    price: 55,
    busId: 'bus-4'
  },
  {
    id: 'route-5',
    from: 'New York',
    to: 'Philadelphia',
    departureTime: '10:00',
    arrivalTime: '12:00',
    price: 35,
    busId: 'bus-5'
  },
  {
    id: 'route-6',
    from: 'Philadelphia',
    to: 'New York',
    departureTime: '16:00',
    arrivalTime: '18:00',
    price: 35,
    busId: 'bus-6'
  },
  {
    id: 'route-7',
    from: 'Boston',
    to: 'Washington DC',
    departureTime: '07:30',
    arrivalTime: '14:00',
    price: 75,
    busId: 'bus-7'
  },
  {
    id: 'route-8',
    from: 'Washington DC',
    to: 'Boston',
    departureTime: '16:30',
    arrivalTime: '23:00',
    price: 75,
    busId: 'bus-8'
  },
  {
    id: 'route-9',
    from: 'New York',
    to: 'Atlantic City',
    departureTime: '11:00',
    arrivalTime: '13:30',
    price: 40,
    busId: 'bus-1'
  },
  {
    id: 'route-10',
    from: 'Atlantic City',
    to: 'New York',
    departureTime: '15:30',
    arrivalTime: '18:00',
    price: 40,
    busId: 'bus-2'
  }
];