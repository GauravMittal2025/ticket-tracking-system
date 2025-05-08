import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Search, Filter, Clock, ArrowRight } from 'lucide-react';
import { useBus } from '../context/BusContext';
import RouteCard from '../components/routes/RouteCard';

const RoutesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { filterRoutes } = useBus();
  
  const initialFrom = searchParams.get('from') || '';
  const initialTo = searchParams.get('to') || '';
  const initialDate = searchParams.get('date') || '';
  
  const [fromLocation, setFromLocation] = useState(initialFrom);
  const [toLocation, setToLocation] = useState(initialTo);
  const [departDate, setDepartDate] = useState(initialDate);
  const [filteredRoutes, setFilteredRoutes] = useState(filterRoutes(initialFrom, initialTo));
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState(100);
  const [timeOfDay, setTimeOfDay] = useState('all');

  useEffect(() => {
    let routes = filterRoutes(fromLocation, toLocation);
    
    // Apply additional filters
    if (timeOfDay !== 'all') {
      routes = routes.filter(route => {
        const hour = parseInt(route.departureTime.split(':')[0]);
        if (timeOfDay === 'morning' && hour >= 5 && hour < 12) return true;
        if (timeOfDay === 'afternoon' && hour >= 12 && hour < 17) return true;
        if (timeOfDay === 'evening' && hour >= 17 && hour < 21) return true;
        if (timeOfDay === 'night' && (hour >= 21 || hour < 5)) return true;
        return false;
      });
    }
    
    // Apply price filter
    routes = routes.filter(route => route.price <= priceRange);
    
    setFilteredRoutes(routes);
  }, [fromLocation, toLocation, timeOfDay, priceRange]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Update URL with search params
    navigate(`/routes?from=${fromLocation}&to=${toLocation}&date=${departDate}`);
    
    // Filter routes
    setFilteredRoutes(filterRoutes(fromLocation, toLocation));
  };

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-900 mb-2">Available Bus Routes</h1>
          <p className="text-gray-600">
            Find and book bus tickets for your journey with real-time tracking.
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <label htmlFor="from" className="block text-gray-700 text-sm font-medium mb-1">From</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  id="from"
                  type="text"
                  placeholder="Departure City"
                  value={fromLocation}
                  onChange={(e) => setFromLocation(e.target.value)}
                  className="pl-10 w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            
            <div className="relative">
              <label htmlFor="to" className="block text-gray-700 text-sm font-medium mb-1">To</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  id="to"
                  type="text"
                  placeholder="Arrival City"
                  value={toLocation}
                  onChange={(e) => setToLocation(e.target.value)}
                  className="pl-10 w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="date" className="block text-gray-700 text-sm font-medium mb-1">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  id="date"
                  type="date"
                  value={departDate}
                  onChange={(e) => setDepartDate(e.target.value)}
                  className="pl-10 w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
            
            <div className="flex items-end">
              <button 
                type="submit" 
                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-6 rounded-md transition-colors duration-300 flex items-center justify-center"
              >
                <Search className="w-5 h-5 mr-2" />
                <span>Search</span>
              </button>
            </div>
          </form>
          
          {/* Advanced Filters */}
          <div className="mt-4">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center text-primary-600 hover:text-primary-700 font-medium"
            >
              <Filter className="w-4 h-4 mr-1" />
              {showFilters ? 'Hide Filters' : 'Show Advanced Filters'}
            </button>
            
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 p-4 bg-gray-50 rounded-md">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Price Range (Max $) - ${priceRange}
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="200"
                    step="5"
                    value={priceRange}
                    onChange={(e) => setPriceRange(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Time of Day
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setTimeOfDay('all')}
                      className={`px-3 py-1 rounded-full text-sm ${
                        timeOfDay === 'all' 
                          ? 'bg-primary-600 text-white' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Any Time
                    </button>
                    <button
                      type="button"
                      onClick={() => setTimeOfDay('morning')}
                      className={`px-3 py-1 rounded-full text-sm ${
                        timeOfDay === 'morning' 
                          ? 'bg-primary-600 text-white' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Morning
                    </button>
                    <button
                      type="button"
                      onClick={() => setTimeOfDay('afternoon')}
                      className={`px-3 py-1 rounded-full text-sm ${
                        timeOfDay === 'afternoon' 
                          ? 'bg-primary-600 text-white' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Afternoon
                    </button>
                    <button
                      type="button"
                      onClick={() => setTimeOfDay('evening')}
                      className={`px-3 py-1 rounded-full text-sm ${
                        timeOfDay === 'evening' 
                          ? 'bg-primary-600 text-white' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Evening
                    </button>
                    <button
                      type="button"
                      onClick={() => setTimeOfDay('night')}
                      className={`px-3 py-1 rounded-full text-sm ${
                        timeOfDay === 'night' 
                          ? 'bg-primary-600 text-white' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Night
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-primary-900">
            {filteredRoutes.length} Routes Found
          </h2>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1 text-gray-500" />
            <span className="text-gray-600 text-sm">
              Sort by: 
              <select className="ml-2 border-none bg-transparent text-gray-600 focus:outline-none">
                <option>Departure Time</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Duration</option>
              </select>
            </span>
          </div>
        </div>

        {/* Routes List */}
        <div className="space-y-4">
          {filteredRoutes.length > 0 ? (
            filteredRoutes.map((route) => (
              <RouteCard key={route.id} route={route} date={departDate} />
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-primary-900 mb-2">No Routes Found</h3>
              <p className="text-gray-600 mb-4">
                We couldn't find any routes matching your search criteria. Please try with different locations or dates.
              </p>
              <button
                onClick={() => {
                  setFromLocation('');
                  setToLocation('');
                  setFilteredRoutes(filterRoutes('', ''));
                }}
                className="text-primary-600 hover:text-primary-700 font-medium flex items-center justify-center mx-auto"
              >
                View all available routes
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoutesPage;