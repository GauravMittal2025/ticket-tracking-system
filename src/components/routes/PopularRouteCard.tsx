import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, MapPin, ChevronRight } from 'lucide-react';
import { BusRoute } from '../../data/busRoutes';

interface PopularRouteCardProps {
  route: BusRoute;
}

const PopularRouteCard: React.FC<PopularRouteCardProps> = ({ route }) => {
  const navigate = useNavigate();
  
  // Calculate tomorrow's date for default booking
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const formattedDate = tomorrow.toISOString().split('T')[0];

  // Get a random image for the route card
  const getRandomImage = () => {
    const images = [
      'https://images.pexels.com/photos/3996363/pexels-photo-3996363.jpeg',
      'https://images.pexels.com/photos/2225442/pexels-photo-2225442.jpeg',
      'https://images.pexels.com/photos/1036657/pexels-photo-1036657.jpeg',
      'https://images.pexels.com/photos/2064826/pexels-photo-2064826.jpeg',
      'https://images.pexels.com/photos/3874342/pexels-photo-3874342.jpeg',
      'https://images.pexels.com/photos/7242748/pexels-photo-7242748.jpeg'
    ];
    
    // Use route ID to consistently get the same image for the same route
    const index = parseInt(route.id.replace(/[^0-9]/g, '')) % images.length;
    return images[index];
  };
  
  const handleBookNow = () => {
    navigate(`/booking/${route.id}?date=${formattedDate}`);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
      <div 
        className="h-40 bg-cover bg-center" 
        style={{ backgroundImage: `url(${getRandomImage()})` }}
      ></div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-primary-900">{route.from} to {route.to}</h3>
          <div className="text-lg font-bold text-primary-600">${route.price}</div>
        </div>
        <div className="flex items-center text-gray-600 mb-2">
          <Clock className="w-4 h-4 mr-1 text-gray-400" />
          <span className="text-sm">Departure: {route.departureTime}</span>
        </div>
        <div className="flex items-center text-gray-600 mb-4">
          <MapPin className="w-4 h-4 mr-1 text-gray-400" />
          <span className="text-sm">Arrival: {route.arrivalTime}</span>
        </div>
        <button
          onClick={handleBookNow}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-md transition-colors duration-300 flex items-center justify-center"
        >
          Book Now
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
};

export default PopularRouteCard;