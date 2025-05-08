import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, MapPin, Users, Info, ArrowRight } from 'lucide-react';
import { BusRoute } from '../../data/busRoutes';
import { useBus } from '../../context/BusContext';

interface RouteCardProps {
  route: BusRoute;
  date: string;
}

const RouteCard: React.FC<RouteCardProps> = ({ route, date }) => {
  const navigate = useNavigate();
  const { getBusById } = useBus();
  const [expanded, setExpanded] = useState(false);
  
  const bus = getBusById(route.busId);
  const isBusDelayed = bus?.status === 'delayed';
  
  // Placeholder for amenities
  const amenities = ['Wi-Fi', 'AC', 'USB Charging', 'Recliner Seats'];
  
  // Calculate journey duration
  const calculateDuration = () => {
    try {
      const startParts = route.departureTime.split(':');
      const endParts = route.arrivalTime.split(':');
      
      let startHour = parseInt(startParts[0]);
      let startMinute = parseInt(startParts[1]);
      let endHour = parseInt(endParts[0]);
      let endMinute = parseInt(endParts[1]);
      
      // Handle cross-day trips
      if (endHour < startHour) {
        endHour += 24;
      }
      
      let durationMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
      let hours = Math.floor(durationMinutes / 60);
      let minutes = durationMinutes % 60;
      
      return `${hours}h ${minutes}m`;
    } catch (error) {
      return 'Unknown';
    }
  };
  
  const handleBookNow = () => {
    navigate(`/booking/${route.id}?date=${date}`);
  };
  
  // Get a random number of available seats (between 5 and 30)
  const availableSeats = Math.floor(Math.random() * 26) + 5;
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300">
      <div className="p-5">
        <div className="flex flex-col md:flex-row justify-between">
          {/* Route and time info */}
          <div className="mb-4 md:mb-0">
            <div className="flex items-start">
              <div className="mr-4">
                <div className="w-2.5 h-2.5 rounded-full bg-primary-600 mb-1"></div>
                <div className="w-0.5 h-16 bg-gray-300 mx-auto"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-primary-600 mt-1"></div>
              </div>
              
              <div>
                <div className="mb-4">
                  <div className="text-lg font-semibold text-primary-900">{route.from}</div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-1 text-gray-400" />
                    <span className="text-sm">{route.departureTime}</span>
                  </div>
                </div>
                
                <div>
                  <div className="text-lg font-semibold text-primary-900">{route.to}</div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-1 text-gray-400" />
                    <span className="text-sm">{route.arrivalTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Duration and seats info */}
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-3 md:space-y-0 md:space-x-6">
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">Duration</div>
              <div className="font-medium text-primary-900">{calculateDuration()}</div>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">Available</div>
              <div className="flex items-center font-medium text-primary-900">
                <Users className="w-4 h-4 mr-1 text-gray-400" />
                {availableSeats} seats
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">Price</div>
              <div className="text-xl font-bold text-primary-600">${route.price}</div>
            </div>
          </div>
        </div>
        
        {/* Status indicator and book button */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-5 pt-4 border-t border-gray-100">
          <div className="mb-3 sm:mb-0">
            {isBusDelayed ? (
              <div className="flex items-center text-amber-600">
                <Info className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">Expected delay of 15-20 minutes</span>
              </div>
            ) : (
              <div className="flex items-center text-green-600">
                <Clock className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">On time</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={() => setExpanded(!expanded)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 transition-colors duration-300"
            >
              {expanded ? 'Hide Details' : 'View Details'}
            </button>
            
            <button
              onClick={handleBookNow}
              className="flex-1 sm:flex-none px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors duration-300 flex items-center justify-center"
            >
              Book Now
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
        
        {/* Expanded details */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-primary-900 mb-2">Bus Information</h4>
              <div className="bg-gray-50 rounded-md p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Bus Type</span>
                  <span className="font-medium">{bus?.name || 'Standard'}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Capacity</span>
                  <span className="font-medium">{bus?.capacity || 40} seats</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Status</span>
                  <span className={`font-medium ${isBusDelayed ? 'text-amber-600' : 'text-green-600'}`}>
                    {isBusDelayed ? 'Delayed' : 'On Schedule'}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-primary-900 mb-2">Amenities</h4>
              <div className="bg-gray-50 rounded-md p-4">
                <div className="grid grid-cols-2 gap-2">
                  {amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-primary-600 rounded-full mr-2"></div>
                      <span className="text-gray-600">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="font-medium text-primary-900 mb-2">Cancellation Policy</h4>
                <p className="text-sm text-gray-600">
                  Free cancellation up to 2 hours before departure. 50% refund if cancelled within 2 hours.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RouteCard;