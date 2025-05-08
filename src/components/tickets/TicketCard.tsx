import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Clock, ChevronDown, ChevronUp, Bus, Ticket, CreditCard } from 'lucide-react';
import { Ticket as TicketType } from '../../data/tickets';
import { useBus } from '../../context/BusContext';

interface TicketCardProps {
  ticket: TicketType;
  onCancel: (ticketId: string) => Promise<void>;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket, onCancel }) => {
  const navigate = useNavigate();
  const { getBusById } = useBus();
  const [expanded, setExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const bus = getBusById(ticket.busId);
  
  // Check if the ticket is for future travel
  const isFutureTravel = () => {
    const today = new Date();
    const travelDate = new Date(ticket.travelDate);
    
    // If it's the same day, check if departure time is in the future
    if (today.toDateString() === travelDate.toDateString()) {
      const now = today.getHours() * 60 + today.getMinutes();
      const [departHours, departMinutes] = ticket.departureTime.split(':').map(Number);
      const departTime = departHours * 60 + departMinutes;
      
      return departTime > now;
    }
    
    return travelDate > today;
  };
  
  const isPastTravel = () => {
    const today = new Date();
    const travelDate = new Date(ticket.travelDate);
    
    // If it's the same day, check if arrival time is in the past
    if (today.toDateString() === travelDate.toDateString()) {
      const now = today.getHours() * 60 + today.getMinutes();
      const [arrivalHours, arrivalMinutes] = ticket.arrivalTime.split(':').map(Number);
      const arrivalTime = arrivalHours * 60 + arrivalMinutes;
      
      return arrivalTime < now;
    }
    
    return travelDate < today;
  };
  
  const isToday = () => {
    const today = new Date().toDateString();
    const travelDate = new Date(ticket.travelDate).toDateString();
    return today === travelDate;
  };
  
  const getStatusLabel = () => {
    if (ticket.status === 'cancelled') {
      return (
        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
          Cancelled
        </span>
      );
    } else if (isPastTravel()) {
      return (
        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
          Completed
        </span>
      );
    } else if (isToday()) {
      return (
        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
          Today
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
          Upcoming
        </span>
      );
    }
  };
  
  const handleCancel = async () => {
    setIsLoading(true);
    try {
      await onCancel(ticket.id);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleTrackBus = () => {
    navigate(`/tracking?busId=${ticket.busId}`);
  };
  
  return (
    <div className={`border rounded-lg overflow-hidden transition-all duration-300 ${
      ticket.status === 'cancelled' 
        ? 'border-red-200 bg-red-50' 
        : 'border-gray-200 bg-white hover:shadow-md'
    }`}>
      <div className="p-5">
        <div className="flex flex-col md:flex-row justify-between mb-4">
          <div className="mb-3 md:mb-0">
            <div className="flex items-center mb-2">
              <Ticket className="w-5 h-5 text-primary-600 mr-2" />
              <h3 className="text-lg font-semibold text-primary-900">
                Ticket #{ticket.id.substring(0, 8)}
              </h3>
              <div className="ml-3">
                {getStatusLabel()}
              </div>
            </div>
            
            <div className="flex items-center text-gray-600 mb-1">
              <MapPin className="w-4 h-4 mr-1 text-gray-400" />
              <span>{ticket.from} to {ticket.to}</span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <Calendar className="w-4 h-4 mr-1 text-gray-400" />
              <span>{ticket.travelDate}</span>
              <Clock className="w-4 h-4 ml-3 mr-1 text-gray-400" />
              <span>Departure: {ticket.departureTime}</span>
            </div>
          </div>
          
          <div className="flex md:flex-col items-center md:items-end justify-between">
            <div className="text-lg font-bold text-primary-600">
              ${ticket.price.toFixed(2)}
            </div>
            
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center text-primary-600 hover:text-primary-700"
            >
              {expanded ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">Hide Details</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">View Details</span>
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Expanded details */}
        {expanded && (
          <div className="mt-2 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-primary-900 mb-2">Ticket Details</h4>
                <div className="bg-gray-50 rounded-md p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Booking Date</span>
                    <span className="font-medium">{new Date(ticket.bookingDate).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Bus</span>
                    <span className="font-medium">{bus?.name || 'Standard Bus'}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Arrival Time</span>
                    <span className="font-medium">{ticket.arrivalTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Seats</span>
                    <span className="font-medium">{ticket.seatNumbers.join(', ')}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-primary-900 mb-2">Payment Details</h4>
                <div className="bg-gray-50 rounded-md p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Payment Method</span>
                    <div className="flex items-center">
                      <CreditCard className="w-4 h-4 text-gray-500 mr-1" />
                      <span className="font-medium">Credit Card</span>
                    </div>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${(ticket.price * 0.9).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">${(ticket.price * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span className="text-primary-900">${ticket.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {ticket.status === 'confirmed' && (
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                {isFutureTravel() && (
                  <button
                    onClick={handleCancel}
                    disabled={isLoading}
                    className={`px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 rounded-md transition-colors duration-300 ${
                      isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? 'Processing...' : 'Cancel Ticket'}
                  </button>
                )}
                
                {!isPastTravel() && (
                  <button
                    onClick={handleTrackBus}
                    className="px-4 py-2 flex items-center justify-center border border-primary-300 text-primary-600 hover:bg-primary-50 rounded-md transition-colors duration-300"
                  >
                    <Bus className="w-4 h-4 mr-1" />
                    Track Bus
                  </button>
                )}
                
                <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors duration-300">
                  Download Ticket
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketCard;