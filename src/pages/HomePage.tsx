import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { useBus } from '../context/BusContext';
import PopularRouteCard from '../components/routes/PopularRouteCard';
import FeatureCard from '../components/ui/FeatureCard';

const HomePage: React.FC = () => {
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [departDate, setDepartDate] = useState('');
  const navigate = useNavigate();
  const { routes } = useBus();

  const popularRoutes = routes.slice(0, 6);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/routes?from=${fromLocation}&to=${toLocation}&date=${departDate}`);
  };

  const features = [
    {
      title: 'Real-Time Tracking',
      description: 'Track your bus in real-time to know exactly when it will arrive.',
      icon: <Search className="w-10 h-10 text-primary-600" />,
    },
    {
      title: 'Secure Booking',
      description: 'Book your tickets securely with multiple payment options.',
      icon: <MapPin className="w-10 h-10 text-primary-600" />,
    },
    {
      title: 'Live Updates',
      description: 'Get notified about delays, changes, or any important information.',
      icon: <Calendar className="w-10 h-10 text-primary-600" />,
    },
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-900 to-primary-800 text-white py-32">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" 
             style={{ backgroundImage: `url('https://images.pexels.com/photos/2117696/pexels-photo-2117696.jpeg')` }}>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Book Bus Tickets & Track in Real-Time
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              The easiest way to book bus tickets and track your journey in real-time.
              Travel with confidence knowing exactly where your bus is.
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto transform transition-transform duration-500 hover:scale-[1.02]">
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
                    required
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
                    required
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
                    required
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
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary-900">
            Why Choose BusTracker?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-primary-900">Popular Routes</h2>
            <a href="/routes" className="text-primary-600 hover:text-primary-700 font-medium flex items-center">
              View all routes
              <ArrowRight className="w-4 h-4 ml-1" />
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularRoutes.map((route) => (
              <PopularRouteCard key={route.id} route={route} />
            ))}
          </div>
        </div>
      </section>

      {/* App Download Banner (Placeholder) */}
      <section className="bg-gradient-to-r from-primary-800 to-secondary-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-3xl font-bold mb-4">Download Our Mobile App</h2>
              <p className="text-lg mb-6">
                Get real-time updates, book tickets, and track your bus on the go.
                Download our mobile app for a seamless travel experience.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-black text-white py-3 px-6 rounded-lg flex items-center">
                  <span className="mr-2">🍎</span>
                  <span>App Store</span>
                </button>
                <button className="bg-black text-white py-3 px-6 rounded-lg flex items-center">
                  <span className="mr-2">🤖</span>
                  <span>Google Play</span>
                </button>
              </div>
            </div>
            <div className="md:w-1/3">
              <div className="relative h-96 w-full">
                <div className="absolute inset-0 bg-cover bg-center rounded-2xl shadow-2xl transform -rotate-6" 
                     style={{ backgroundImage: `url('https://images.pexels.com/photos/193004/pexels-photo-193004.jpeg')` }}>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;