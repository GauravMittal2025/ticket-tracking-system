import React, { useState } from 'react';
import { Bus, MapPin, Users, Clock, AlertCircle, TrendingUp, BarChart2 } from 'lucide-react';
import { useBus } from '../context/BusContext';
import AdminBusList from '../components/admin/AdminBusList';
import AdminRouteList from '../components/admin/AdminRouteList';
import AdminTicketList from '../components/admin/AdminTicketList';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { buses, routes, tickets } = useBus();

  const activeBuses = buses.filter(bus => bus.status === 'in-transit').length;
  const totalPassengers = tickets.filter(ticket => ticket.status === 'confirmed').length;
  const totalRoutes = routes.length;
  const delayedBuses = buses.filter(bus => bus.status === 'delayed').length;

  // Calculate today's bookings
  const today = new Date().toISOString().split('T')[0];
  const todaysBookings = tickets.filter(ticket => {
    return ticket.bookingDate.split('T')[0] === today;
  }).length;

  // Calculate revenue
  const revenue = tickets
    .filter(ticket => ticket.status === 'confirmed')
    .reduce((sum, ticket) => sum + ticket.price, 0);

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">
            Manage buses, routes, and monitor real-time operations.
          </p>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-primary-100 p-3 rounded-full mr-4">
                <Bus className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Buses</p>
                <h3 className="text-2xl font-bold text-primary-900">{activeBuses}</h3>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full" 
                  style={{ width: `${(activeBuses / buses.length) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">{Math.round((activeBuses / buses.length) * 100)}% of fleet active</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Passengers</p>
                <h3 className="text-2xl font-bold text-primary-900">{totalPassengers}</h3>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-xs text-green-600">+{todaysBookings} new today</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-secondary-100 p-3 rounded-full mr-4">
                <MapPin className="w-6 h-6 text-secondary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Routes</p>
                <h3 className="text-2xl font-bold text-primary-900">{totalRoutes}</h3>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center">
                <BarChart2 className="w-4 h-4 text-secondary-500 mr-1" />
                <span className="text-xs text-gray-600">Across {routes.reduce((acc, route) => {
                  if (!acc.includes(route.from)) acc.push(route.from);
                  if (!acc.includes(route.to)) acc.push(route.to);
                  return acc;
                }, [] as string[]).length} locations</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-accent-100 p-3 rounded-full mr-4">
                <Clock className="w-6 h-6 text-accent-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <h3 className="text-2xl font-bold text-primary-900">${revenue.toFixed(2)}</h3>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center">
                {delayedBuses > 0 ? (
                  <>
                    <AlertCircle className="w-4 h-4 text-amber-500 mr-1" />
                    <span className="text-xs text-amber-600">{delayedBuses} delayed buses</span>
                  </>
                ) : (
                  <span className="text-xs text-gray-600">All buses on schedule</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'overview'
                    ? 'border-b-2 border-primary-600 text-primary-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('buses')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'buses'
                    ? 'border-b-2 border-primary-600 text-primary-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Buses
              </button>
              <button
                onClick={() => setActiveTab('routes')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'routes'
                    ? 'border-b-2 border-primary-600 text-primary-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Routes
              </button>
              <button
                onClick={() => setActiveTab('tickets')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'tickets'
                    ? 'border-b-2 border-primary-600 text-primary-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Tickets
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-xl font-semibold text-primary-900 mb-4">System Overview</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Activity Chart */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-primary-900 mb-4">Booking Activity</h3>
                    <div className="h-64 flex items-center justify-center">
                      <p className="text-gray-500">Booking chart goes here</p>
                    </div>
                  </div>
                  
                  {/* Route Performance */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-primary-900 mb-4">Route Performance</h3>
                    <div className="h-64 flex items-center justify-center">
                      <p className="text-gray-500">Route performance chart goes here</p>
                    </div>
                  </div>
                </div>
                
                {/* Recent Activity */}
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-primary-900 mb-4">Recent Activity</h3>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Event
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Time
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {[...tickets]
                          .sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime())
                          .slice(0, 5)
                          .map((ticket, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">Ticket Booking</div>
                                <div className="text-sm text-gray-500">{ticket.from} to {ticket.to}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">User {ticket.userId}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  ticket.status === 'confirmed' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {ticket.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(ticket.bookingDate).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'buses' && <AdminBusList buses={buses} routes={routes} />}
            {activeTab === 'routes' && <AdminRouteList routes={routes} />}
            {activeTab === 'tickets' && <AdminTicketList tickets={tickets} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;