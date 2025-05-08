import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, Clock, ArrowRight, Info } from 'lucide-react';
import { useBus } from '../context/BusContext';
import BusMap from '../components/tracking/BusMap';
import BusStatusCard from '../components/tracking/BusStatusCard';

const TrackingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { buses, routes, getBusById } = useBus();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBus, setSelectedBus] = useState<string | null>(searchParams.get('busId'));
  
  const activeBuses = buses.filter(bus => bus.status !== 'maintenance');
  const selectedBusData = selectedBus ? getBusById(selectedBus) : null;
  const busRoute = selectedBusData 
    ? routes.find(route => route.busId === selectedBusData.id) 
    : null;

  // Filter buses based on search term
  const filteredBuses = searchTerm
    ? activeBuses.filter(bus => {
        const route = routes.find(r => r.busId === bus.id);
        if (!route) return false;
        
        return (
          bus.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bus.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          route.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
          route.to.toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
    : activeBuses;

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-900 mb-2">Live Bus Tracking</h1>
          <p className="text-gray-600">
            Track your bus in real-time to know its current location and estimated arrival time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar - Bus List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 bg-primary-800 text-white">
                <h2 className="font-semibold text-lg">Active Buses</h2>
              </div>
              
              <div className="p-4">
                <div className="relative mb-4">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search buses, routes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                
                {filteredBuses.length > 0 ? (
                  <div className="divide-y divide-gray-200 max-h-[460px] overflow-y-auto">
                    {filteredBuses.map(bus => {
                      const route = routes.find(r => r.busId === bus.id);
                      
                      return (
                        <div 
                          key={bus.id}
                          onClick={() => setSelectedBus(bus.id)}
                          className={`p-3 cursor-pointer transition-colors duration-200 hover:bg-gray-50 ${
                            selectedBus === bus.id ? 'bg-primary-50 border-l-4 border-primary-600' : ''
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-primary-900">{bus.name}</h3>
                              {route && (
                                <div className="flex items-center text-sm text-gray-600 mt-1">
                                  <MapPin className="w-4 h-4 mr-1" />
                                  <span>{route.from}</span>
                                  <ArrowRight className="w-3 h-3 mx-1" />
                                  <span>{route.to}</span>
                                </div>
                              )}
                            </div>
                            <div 
                              className={`px-2 py-1 text-xs font-medium rounded-full ${
                                bus.status === 'in-transit' 
                                  ? 'bg-green-100 text-green-800' 
                                  : bus.status === 'delayed'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {bus.status === 'in-transit' ? 'En Route' : 
                               bus.status === 'delayed' ? 'Delayed' : 'At Station'}
                            </div>
                          </div>
                          {route && (
                            <div className="flex items-center text-xs text-gray-500 mt-2">
                              <Clock className="w-3 h-3 mr-1" />
                              <span>Departure: {route.departureTime}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-2">
                      <Info className="w-12 h-12 mx-auto" />
                    </div>
                    <p className="text-gray-600 mb-2">No buses found</p>
                    <button
                      onClick={() => setSearchTerm('')}
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Show all buses
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content - Map and Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
              {selectedBusData && busRoute ? (
                <>
                  <BusStatusCard bus={selectedBusData} route={busRoute} />
                  <div className="flex-grow p-4 min-h-[400px]">
                    <BusMap bus={selectedBusData} route={busRoute} />
                  </div>
                </>
              ) : (
                <div className="flex-grow flex items-center justify-center p-6">
                  <div className="text-center max-w-lg">
                    <div className="text-gray-400 mb-4">
                      <MapPin className="w-16 h-16 mx-auto" />
                    </div>
                    <h3 className="text-xl font-semibold text-primary-900 mb-2">Select a Bus to Track</h3>
                    <p className="text-gray-600 mb-4">
                      Choose a bus from the list to see its real-time location and status information.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;