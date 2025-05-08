import React, { useState } from 'react';
import { Edit, Trash, Check, X, AlertTriangle, Search } from 'lucide-react';
import { Bus } from '../../data/buses';
import { BusRoute } from '../../data/busRoutes';

interface AdminBusListProps {
  buses: Bus[];
  routes: BusRoute[];
}

const AdminBusList: React.FC<AdminBusListProps> = ({ buses, routes }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredBuses = buses.filter(bus => 
    bus.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bus.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRouteForBus = (busId: string) => {
    return routes.find(route => route.busId === busId);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-primary-900">Manage Buses</h2>
        <button className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-md transition-colors duration-300">
          Add New Bus
        </button>
      </div>

      <div className="mb-4 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search buses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 w-full md:w-80 py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bus ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Current Route
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Capacity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBuses.map((bus) => {
              const route = getRouteForBus(bus.id);
              return (
                <tr key={bus.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {bus.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {bus.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      bus.status === 'in-transit' 
                        ? 'bg-green-100 text-green-800' 
                        : bus.status === 'delayed'
                          ? 'bg-amber-100 text-amber-800'
                          : bus.status === 'maintenance'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                    }`}>
                      {bus.status === 'in-transit' ? 'En Route' : 
                       bus.status === 'delayed' ? 'Delayed' : 
                       bus.status === 'maintenance' ? 'Maintenance' : 'At Station'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {route ? `${route.from} to ${route.to}` : 'Not assigned'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {bus.capacity} seats
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Edit className="w-4 h-4" />
                      </button>
                      {bus.status === 'in-transit' && (
                        <button className="text-amber-600 hover:text-amber-900">
                          <AlertTriangle className="w-4 h-4" />
                        </button>
                      )}
                      <button className="text-red-600 hover:text-red-900">
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {filteredBuses.length === 0 && (
        <div className="text-center py-4">
          <p className="text-gray-500">No buses found matching your search.</p>
        </div>
      )}
      
      <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
        <div>Showing {filteredBuses.length} of {buses.length} buses</div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border border-gray-300 rounded-md bg-white">Previous</button>
          <button className="px-3 py-1 border border-gray-300 rounded-md bg-white">Next</button>
        </div>
      </div>
    </div>
  );
};

export default AdminBusList;