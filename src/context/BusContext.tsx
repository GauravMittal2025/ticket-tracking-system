import React, { createContext, useState, useContext, useEffect } from 'react';
import { busRoutes, BusRoute } from '../data/busRoutes';
import { Bus, buses as initialBuses } from '../data/buses';
import { Ticket, tickets as initialTickets } from '../data/tickets';
import { useAuth } from './AuthContext';

interface BusContextType {
  routes: BusRoute[];
  buses: Bus[];
  tickets: Ticket[];
  bookTicket: (routeId: string, seatNumbers: string[], date: string) => Promise<Ticket>;
  cancelTicket: (ticketId: string) => Promise<void>;
  getUserTickets: () => Ticket[];
  getRouteById: (id: string) => BusRoute | undefined;
  getBusById: (id: string) => Bus | undefined;
  updateBusLocation: (busId: string, latitude: number, longitude: number) => void;
  getTicketById: (id: string) => Ticket | undefined;
  filterRoutes: (from?: string, to?: string, date?: string) => BusRoute[];
}

const BusContext = createContext<BusContextType | undefined>(undefined);

export const useBus = () => {
  const context = useContext(BusContext);
  if (context === undefined) {
    throw new Error('useBus must be used within a BusProvider');
  }
  return context;
};

export const BusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [routes] = useState<BusRoute[]>(busRoutes);
  const [buses, setBuses] = useState<Bus[]>(initialBuses);
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const { user } = useAuth();

  // Simulate real-time bus movements
  useEffect(() => {
    const interval = setInterval(() => {
      setBuses(prevBuses => 
        prevBuses.map(bus => {
          if (bus.status === 'in-transit') {
            // Simulate small movements in lat/long (random drift)
            return {
              ...bus,
              currentLocation: {
                latitude: bus.currentLocation.latitude + (Math.random() * 0.002 - 0.001),
                longitude: bus.currentLocation.longitude + (Math.random() * 0.002 - 0.001)
              }
            };
          }
          return bus;
        })
      );
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const bookTicket = async (routeId: string, seatNumbers: string[], date: string): Promise<Ticket> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (!user) throw new Error('User must be logged in to book tickets');
    
    const route = routes.find(r => r.id === routeId);
    if (!route) throw new Error('Route not found');
    
    const newTicket: Ticket = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      routeId,
      busId: route.busId,
      seatNumbers,
      status: 'confirmed',
      bookingDate: new Date().toISOString(),
      travelDate: date,
      price: route.price * seatNumbers.length,
      from: route.from,
      to: route.to,
      departureTime: route.departureTime,
      arrivalTime: route.arrivalTime
    };
    
    setTickets(prev => [...prev, newTicket]);
    return newTicket;
  };

  const cancelTicket = async (ticketId: string): Promise<void> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setTickets(prev => 
      prev.map(ticket => 
        ticket.id === ticketId 
          ? { ...ticket, status: 'cancelled' } 
          : ticket
      )
    );
  };

  const getUserTickets = (): Ticket[] => {
    if (!user) return [];
    return tickets.filter(ticket => ticket.userId === user.id);
  };

  const getRouteById = (id: string): BusRoute | undefined => {
    return routes.find(route => route.id === id);
  };

  const getBusById = (id: string): Bus | undefined => {
    return buses.find(bus => bus.id === id);
  };

  const updateBusLocation = (busId: string, latitude: number, longitude: number): void => {
    setBuses(prev => 
      prev.map(bus => 
        bus.id === busId 
          ? { 
              ...bus, 
              currentLocation: { latitude, longitude } 
            } 
          : bus
      )
    );
  };

  const getTicketById = (id: string): Ticket | undefined => {
    return tickets.find(ticket => ticket.id === id);
  };

  const filterRoutes = (from?: string, to?: string, date?: string): BusRoute[] => {
    return routes.filter(route => {
      const fromMatch = !from || route.from.toLowerCase().includes(from.toLowerCase());
      const toMatch = !to || route.to.toLowerCase().includes(to.toLowerCase());
      // In a real app, we would filter by date as well
      return fromMatch && toMatch;
    });
  };

  const value = {
    routes,
    buses,
    tickets,
    bookTicket,
    cancelTicket,
    getUserTickets,
    getRouteById,
    getBusById,
    updateBusLocation,
    getTicketById,
    filterRoutes
  };

  return (
    <BusContext.Provider value={value}>
      {children}
    </BusContext.Provider>
  );
};