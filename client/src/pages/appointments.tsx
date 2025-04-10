import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Plus, CalendarCheck, X, Eye, Edit, User, UserRound, Video, MessageCircle } from 'lucide-react';
import { AppointmentTable } from '@/components/dashboard/appointment-table';
import { Pagination } from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchAppointments } from '@/lib/api';

const statusFilters = [
  { label: 'All', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' }
];

export default function Appointments() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const itemsPerPage = 10;

  // Fetch appointments
  const { data: appointments, isLoading } = useQuery({
    queryKey: ['/api/appointments', statusFilter],
    queryFn: () => fetchAppointments(statusFilter)
  });

  // Filter appointments by search query
  const filteredAppointments = appointments?.filter(appointment => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    
    // Search in patient name or doctor name if available
    const patientMatch = appointment.patientName 
      ? appointment.patientName.toLowerCase().includes(searchLower)
      : String(appointment.patient).includes(searchLower);
      
    const doctorMatch = appointment.doctorName
      ? appointment.doctorName.toLowerCase().includes(searchLower)
      : String(appointment.doctor).includes(searchLower);
      
    return patientMatch || doctorMatch;
  }) || [];

  // Pagination
  const totalItems = filteredAppointments.length;
  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Card>
      <CardHeader className="border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <CardTitle className="flex items-center">
          <CalendarCheck className="h-5 w-5 mr-2 text-blue-500" />
          Appointments Management
        </CardTitle>
        <div className="mt-3 sm:mt-0 flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <Search className="h-4 w-4" />
            </div>
          </div>
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" /> New Appointment
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-2 mb-4">
          {statusFilters.map((filter) => (
            <Badge
              key={filter.value}
              variant={statusFilter === filter.value ? "default" : "outline"}
              className="cursor-pointer px-3 py-1"
              onClick={() => setStatusFilter(filter.value)}
            >
              {filter.label}
            </Badge>
          ))}
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mode
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-10"></div></td>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="h-10 bg-gray-200 rounded w-full"></div></td>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="h-10 bg-gray-200 rounded w-full"></div></td>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="h-8 bg-gray-200 rounded w-24"></div></td>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="h-6 bg-gray-200 rounded w-16"></div></td>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="h-6 bg-gray-200 rounded w-20"></div></td>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="h-8 bg-gray-200 rounded w-24"></div></td>
                  </tr>
                ))
              ) : paginatedAppointments.length > 0 ? (
                paginatedAppointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{appointment.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                          <User className="h-5 w-5" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {appointment.patientName || `Patient #${appointment.patient}`}
                          </div>
                          <div className="text-sm text-gray-500">
                            {/* Email would be here */}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                          <UserRound className="h-5 w-5" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {appointment.doctorName || `Doctor #${appointment.doctor}`}
                          </div>
                          <div className="text-sm text-gray-500">
                            {/* Specialty would be here */}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(appointment.datetime).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(appointment.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-blue-600">
                        {appointment.mode === 'video' ? (
                          <span className="flex items-center">
                            <Video className="h-4 w-4 mr-1" /> Video
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <MessageCircle className="h-4 w-4 mr-1" /> Chat
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge 
                        variant="outline" 
                        className={
                          appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }
                      >
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" className="text-blue-600 hover:text-blue-900" title="Edit">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-900" title="Cancel">
                          <X className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900" title="Details">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    No appointments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <Pagination
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </CardContent>
    </Card>
  );
}
