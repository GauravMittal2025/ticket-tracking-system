import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, CreditCard, CheckCircle, MapPin, User, Info } from 'lucide-react';
import { useBus } from '../context/BusContext';
import { useAuth } from '../context/AuthContext';
import BusSeatSelector from '../components/booking/BusSeatSelector';

const BookingPage: React.FC = () => {
  const { routeId } = useParams<{ routeId?: string }>();
  const navigate = useNavigate();
  const { getRouteById, bookTicket } = useBus();
  const { isAuthenticated } = useAuth();
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [travelDate, setTravelDate] = useState<string>('');
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);

  const route = routeId ? getRouteById(routeId) : null;

  useEffect(() => {
    // Set default travel date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setTravelDate(tomorrow.toISOString().split('T')[0]);
    
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/booking/${routeId}` } });
    }
  }, []);

  if (!route) {
    return (
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Info className="w-16 h-16 text-primary-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-primary-900 mb-4">Route Not Found</h2>
            <p className="text-gray-600 mb-6">The route you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => navigate('/routes')}
              className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300"
            >
              Browse Available Routes
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalPrice = selectedSeats.length * route.price;

  const handleSeatSelect = (seatId: string) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else {
      // Limit to max 4 seats per booking
      if (selectedSeats.length < 4) {
        setSelectedSeats([...selectedSeats, seatId]);
      }
    }
  };

  const handleContinue = () => {
    if (currentStep === 1 && selectedSeats.length > 0) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/booking/${routeId}` } });
      return;
    }
    
    try {
      setIsSubmitting(true);
      const ticket = await bookTicket(route.id, selectedSeats, travelDate);
      setTicketId(ticket.id);
      setBookingSuccess(true);
    } catch (error) {
      console.error('Booking failed', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (bookingSuccess) {
    return (
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-primary-900 mb-2">Booking Confirmed!</h2>
              <p className="text-gray-600">
                Your ticket has been booked successfully. Check your email for details.
              </p>
            </div>
            
            <div className="border-t border-b border-gray-200 py-4 my-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-gray-500 text-sm">From</p>
                  <p className="font-medium text-primary-900">{route.from}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">To</p>
                  <p className="font-medium text-primary-900">{route.to}</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-gray-700">{travelDate}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-gray-700">{route.departureTime}</span>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium text-primary-900 mb-2">Booking Summary</h3>
              <div className="bg-gray-50 rounded-md p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Ticket ID</span>
                  <span className="font-medium">{ticketId}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Seats</span>
                  <span className="font-medium">{selectedSeats.join(', ')}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Price per seat</span>
                  <span className="font-medium">${route.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total Amount</span>
                  <span className="text-primary-900">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/tickets')}
                className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300 flex-1"
              >
                View My Tickets
              </button>
              <button
                onClick={() => navigate('/tracking')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-6 rounded-md transition-colors duration-300 flex-1"
              >
                Track Bus
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-900 mb-2">Book Your Ticket</h1>
          <p className="text-gray-600">
            Select your seat and complete your booking for {route.from} to {route.to}
          </p>
        </div>

        {/* Booking Steps Indicator */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex justify-between">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                1
              </div>
              <span className="text-sm mt-2 font-medium">Select Seats</span>
            </div>
            <div className="flex-1 flex items-center">
              <div className={`flex-1 h-1 ${currentStep >= 2 ? 'bg-primary-600' : 'bg-gray-200'}`}></div>
            </div>
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </div>
              <span className="text-sm mt-2 font-medium">Payment</span>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Route Info Header */}
            <div className="bg-primary-800 text-white p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">{route.from} to {route.to}</h2>
                  <div className="flex items-center text-primary-200 text-sm mt-1">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>Date: {travelDate}</span>
                    <Clock className="w-4 h-4 ml-3 mr-1" />
                    <span>Departure: {route.departureTime}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-semibold">${route.price}</div>
                  <div className="text-primary-200 text-sm">per seat</div>
                </div>
              </div>
            </div>

            {/* Step 1: Seat Selection */}
            {currentStep === 1 && (
              <div className="p-6">
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-primary-900">Select Your Seats</h3>
                    <div className="text-gray-600 text-sm">
                      Selected: {selectedSeats.length} / 4 max
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Travel Date
                    </label>
                    <input
                      type="date"
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div className="flex gap-8 flex-wrap">
                    <div className="flex-1 min-w-[280px]">
                      <BusSeatSelector 
                        selectedSeats={selectedSeats} 
                        onSeatSelect={handleSeatSelect} 
                      />
                    </div>
                    
                    <div className="w-full md:w-auto md:min-w-[250px]">
                      <div className="bg-gray-50 rounded-md p-4 mb-4">
                        <h4 className="font-medium text-primary-900 mb-2">Seat Status Guide</h4>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <div className="w-6 h-6 bg-gray-200 rounded-md mr-2"></div>
                            <span className="text-gray-600 text-sm">Available</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-6 h-6 bg-primary-600 rounded-md mr-2"></div>
                            <span className="text-gray-600 text-sm">Selected</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-6 h-6 bg-gray-400 rounded-md mr-2"></div>
                            <span className="text-gray-600 text-sm">Booked</span>
                          </div>
                        </div>
                      </div>
                      
                      {selectedSeats.length > 0 && (
                        <div className="bg-primary-50 border border-primary-100 rounded-md p-4">
                          <h4 className="font-medium text-primary-900 mb-2">Selected Seats</h4>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {selectedSeats.map(seat => (
                              <span 
                                key={seat} 
                                className="bg-primary-100 text-primary-700 px-2 py-1 rounded-md text-sm font-medium"
                              >
                                {seat}
                              </span>
                            ))}
                          </div>
                          <div className="text-primary-800 font-medium">
                            Total: ${totalPrice.toFixed(2)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={handleContinue}
                    disabled={selectedSeats.length === 0}
                    className={`py-2 px-6 rounded-md font-medium ${
                      selectedSeats.length > 0
                        ? 'bg-primary-600 hover:bg-primary-700 text-white'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    } transition-colors duration-300`}
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Payment */}
            {currentStep === 2 && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-primary-900 mb-4">Payment Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-medium text-primary-900 mb-3">Booking Summary</h4>
                    <div className="bg-gray-50 rounded-md p-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Route</span>
                        <span className="font-medium">{route.from} to {route.to}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Date</span>
                        <span className="font-medium">{travelDate}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Time</span>
                        <span className="font-medium">{route.departureTime}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Seats</span>
                        <span className="font-medium">{selectedSeats.join(', ')}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Price per seat</span>
                        <span className="font-medium">${route.price.toFixed(2)}</span>
                      </div>
                      <div className="border-t border-gray-200 my-2 pt-2"></div>
                      <div className="flex justify-between font-medium">
                        <span>Total Amount</span>
                        <span className="text-primary-900">${totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-primary-900 mb-3">Card Details</h4>
                    <form onSubmit={handleSubmit}>
                      <div className="mb-4">
                        <label htmlFor="cardName" className="block text-gray-700 text-sm font-medium mb-2">
                          Name on Card
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                          <input
                            id="cardName"
                            type="text"
                            placeholder="John Doe"
                            className="pl-10 w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="cardNumber" className="block text-gray-700 text-sm font-medium mb-2">
                          Card Number
                        </label>
                        <div className="relative">
                          <CreditCard className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                          <input
                            id="cardNumber"
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            className="pl-10 w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label htmlFor="expiry" className="block text-gray-700 text-sm font-medium mb-2">
                            Expiry Date
                          </label>
                          <input
                            id="expiry"
                            type="text"
                            placeholder="MM/YY"
                            className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="cvv" className="block text-gray-700 text-sm font-medium mb-2">
                            CVV
                          </label>
                          <input
                            id="cvv"
                            type="text"
                            placeholder="123"
                            className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center mb-6">
                        <input 
                          id="terms" 
                          type="checkbox" 
                          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" 
                          required
                        />
                        <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
                          I agree to the <a href="#" className="text-primary-600 hover:underline">terms and conditions</a>
                        </label>
                      </div>
                      
                      <div className="flex justify-between">
                        <button
                          type="button"
                          onClick={handleBack}
                          className="py-2 px-6 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors duration-300"
                        >
                          Back
                        </button>
                        
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className={`py-2 px-6 rounded-md font-medium bg-primary-600 hover:bg-primary-700 text-white transition-colors duration-300 ${
                            isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                          }`}
                        >
                          {isSubmitting ? 'Processing...' : 'Complete Booking'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;