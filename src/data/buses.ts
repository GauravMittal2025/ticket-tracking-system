export interface Bus {
  id: string;
  name: string;
  capacity: number;
  currentLocation: {
    latitude: number;
    longitude: number;
  };
  status: 'in-transit' | 'at-station' | 'delayed' | 'maintenance';
}

export const buses: Bus[] = [
  {
    id: 'bus-1',
    name: 'Express Liner A1',
    capacity: 45,
    currentLocation: {
      latitude: 40.7128,
      longitude: -74.006
    },
    status: 'in-transit'
  },
  {
    id: 'bus-2',
    name: 'City Cruiser B2',
    capacity: 35,
    currentLocation: {
      latitude: 40.7328,
      longitude: -73.9860
    },
    status: 'delayed'
  },
  {
    id: 'bus-3',
    name: 'Metro Transit C3',
    capacity: 40,
    currentLocation: {
      latitude: 40.6928,
      longitude: -74.026
    },
    status: 'at-station'
  },
  {
    id: 'bus-4',
    name: 'Urban Connector D4',
    capacity: 38,
    currentLocation: {
      latitude: 40.7528,
      longitude: -74.046
    },
    status: 'in-transit'
  },
  {
    id: 'bus-5',
    name: 'Regional Express E5',
    capacity: 50,
    currentLocation: {
      latitude: 40.7028,
      longitude: -73.986
    },
    status: 'maintenance'
  },
  {
    id: 'bus-6',
    name: 'Highway Voyager F6',
    capacity: 42,
    currentLocation: {
      latitude: 40.7228,
      longitude: -74.026
    },
    status: 'in-transit'
  },
  {
    id: 'bus-7',
    name: 'Night Rider G7',
    capacity: 36,
    currentLocation: {
      latitude: 40.7428,
      longitude: -73.996
    },
    status: 'at-station'
  },
  {
    id: 'bus-8',
    name: 'Comfort Cruiser H8',
    capacity: 44,
    currentLocation: {
      latitude: 40.7328,
      longitude: -74.016
    },
    status: 'in-transit'
  }
];