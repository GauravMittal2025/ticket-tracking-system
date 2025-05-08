import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket, Search, Filter, Clock, MapPin, AlertCircle } from 'lucide-react';
import { useBus } from '../context/BusContext';
import TicketCard from '../components/tickets/TicketCard';

const TicketsPage: React.FC = () => {
  const { getUserTickets, cancelTicket } = useBus();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const userTickets = getUserTickets();
  
  // Filter tickets based on status and search term
  const filteredTickets = userTickets.filter(ticket => {
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      ticket.from.toLowerCase().includes(searchTerm.toLowerCase()) || 
      ticket.to.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const handleCancelTicket = async (ticketId: string) => {
    if (window.confirm('Are you sure you want to cancel this ticket?')) {
      setIsLoading(true);
      try {
        await cancelTicket(ticketId);
      } catch (error) {
        console.error('Error canceling ticket', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-900 mb-2">My Tickets</h1>
          <p className="text-gray-600">
            Manage your booked tickets and track your upcoming trips.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row justify-between mb-6">
              <div className="relative mb-4 sm:mb-0 sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div className="flex items-center space-x-1">
                <Filter className="h-5 w-5 text-gray-400 mr-1" />
                <span className="text-gray-600 mr-2">Filter:</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setFilterStatus('all')}
                    className={`px-3 py-1 rounded-full text-sm ${
                      filterStatus === 'all' 
                        ? 'bg-primary-600 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilterStatus('confirmed')}
                    className={`px-3 py-1 rounded-full text-sm ${
                      filterStatus === 'confirmed' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Confirmed
                  </button>
                  <button
                    onClick={() => setFilterStatus('cancelled')}
                    className={`px-3 py-1 rounded-full text-sm ${
                      filterStatus === 'cancelled' 
                        ? 'bg-red-600 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Cancelled
                  </button>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Processing your request...</p>
              </div>
            ) : filteredTickets.length > 0 ? (
              <div className="space-y-4">
                {filteredTickets.map(ticket => (
                  <TicketCard 
                    key={ticket.id} 
                    ticket={ticket} 
                    onCancel={handleCancelTicket} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Ticket className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-primary-900 mb-2">No Tickets Found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || filterStatus !== 'all' 
                    ? "No tickets match your search criteria. Try a different filter."
                    : "You haven't booked any tickets yet. Book a ticket to get started."}
                </p>
                <button
                  onClick={() => navigate('/routes')}
                  className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300"
                >
                  Browse Routes
                </button>
              </div>
            )}
          </div>
        </div>

        {userTickets.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start">
            <AlertCircle className="text-amber-500 w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-amber-800 mb-1">Important Information</h3>
              <p className="text-amber-700 text-sm">
                Tickets can be cancelled up to 2 hours before departure for a full refund. 
                After that, a 50% cancellation fee applies. No refunds are provided for 
                cancellations made less than 30 minutes before departure.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketsPage;