import React from 'react';
import { Clock, MapPin, Bus as BusIcon, AlertTriangle, CheckCircle } from 'lucide-react';
import { Bus } from '../../data/buses';
import { BusRoute } from '../../data/busRoutes';

interface BusStatusCardProps {
  bus: Bus;
  route: BusRoute;
}

const BusStatusCard: React.FC<BusStatusCardProps> = ({ bus, route }) => {
  // Calculate estimated time of arrival
  const calculateETA = () => {
    // In a real app, this would be calculated based on current location and remaining distance
    const now = new Date();
    const [hours, minutes] = route.arrivalTime.split(':').map(Number);
    
    const arrivalTime = new Date();
    arrivalTime.setHours(hours, minutes, 0);
    
    if (bus.status === 'delayed') {
      // Add 15 minutes delay
      arrivalTime.setMinutes(arrivalTime.getMinutes() + 15);
    }
    
    // Calculate difference in minutes
    const diffMs = arrivalTime.getTime() - now.getTime();
    const diffMinutes = Math.round(diffMs / 60000);
    
    if (diffMinutes <= 0) {
      return 'Arrived';
    } else if (diffMinutes < 60) {
      return `${diffMinutes} minutes`;
    } else {
      const hours = Math.floor(diffMinutes / 60);
      const mins = diffMinutes % 60;
      return `${hours}h ${mins}m`;
    }
  };
  
  // Calculate progress percentage
  const calculateProgress = () => {
    const now = new Date();
    const [departHours, departMinutes] = route.departureTime.split(':').map(Number);
    const [arrivalHours, arrivalMinutes] = route.arrivalTime.split(':').map(Number);
    
    const departTime = departHours * 60 + departMinutes;
    const arrivalTime = arrivalHours * 60 + arrivalMinutes;
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    // Calculate progress (0 to 100) based on time
    if (currentTime < departTime) {
      return 0;
    } else if (currentTime > arrivalTime) {
      return 100;
    } else {
      return Math.round(((currentTime - departTime) / (arrivalTime - departTime)) * 100);
    }
  };
  
  return (
    <div className="p-5 bg-primary-800 text-white">
      <div className="flex flex-col md:flex-row justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-semibold flex items-center">
            <BusIcon className="w-5 h-5 mr-2" />
            {bus.name}
            {bus.status === 'delayed' && (
              <span className="ml-2 text-sm px-2 py-0.5 bg-amber-500 text-white rounded-full">
                Delayed
              </span>
            )}
          </h2>
          <div className="flex items-center mt-1 text-primary-200">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{route.from} to {route.to}</span>
          </div>
        </div>
        
        <div className="mt-2 md:mt-0">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1 text-primary-300" />
            <span className="text-primary-200">Estimated arrival in: </span>
            <span className="ml-1 font-medium">{calculateETA()}</span>
          </div>
        </div>
      </div>
      
      <div className="bg-primary-700 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 mr-2"></div>
            <span>{route.from}</span>
          </div>
          <div className="text-primary-300">{route.departureTime}</div>
        </div>
        
        <div className="relative h-2 bg-primary-600 rounded-full mb-2">
          <div 
            className="absolute top-0 left-0 h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
            style={{ width: `${calculateProgress()}%` }}
          ></div>
          
          {/* Bus position indicator */}
          <div 
            className={`absolute -top-2 h-6 w-6 rounded-full flex items-center justify-center text-xs ${
              bus.status === 'delayed' ? 'bg-amber-500' : 'bg-blue-500'
            }`}
            style={{ left: `calc(${calculateProgress()}% - 12px)` }}
          >
            🚌
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 mr-2"></div>
            <span>{route.to}</span>
          </div>
          <div className={`${bus.status === 'delayed' ? 'text-amber-300' : 'text-primary-300'}`}>
            {bus.status === 'delayed' 
              ? `${route.arrivalTime} (Delayed)`
              : route.arrivalTime
            }
          </div>
        </div>
      </div>
      
      {bus.status === 'delayed' ? (
        <div className="mt-4 flex items-start bg-amber-400 bg-opacity-20 p-3 rounded-md">
          <AlertTriangle className="w-5 h-5 text-amber-400 mr-2 flex-shrink-0" />
          <p className="text-sm">
            This bus is currently experiencing a delay of approximately 15-20 minutes due to traffic conditions.
            We apologize for any inconvenience.
          </p>
        </div>
      ) : (
        <div className="mt-4 flex items-start bg-green-400 bg-opacity-20 p-3 rounded-md">
          <CheckCircle className="w-5 h-5 text-green-400 mr-2 flex-shrink-0" />
          <p className="text-sm">
            Bus is currently running on schedule. Expected to arrive at destination on time.
          </p>
        </div>
      )}
    </div>
  );
};

export default BusStatusCard;