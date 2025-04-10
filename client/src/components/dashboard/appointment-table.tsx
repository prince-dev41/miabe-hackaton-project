import { FC } from 'react';
import { CalendarCheck, Users, Video, MessageCircle } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { Appointment } from '@shared/schema';
import { formatDateToDisplay, formatTimeToDisplay } from '@/lib/utils';

interface AppointmentRowProps {
  appointment: Appointment & {
    patientName?: string;
    doctorName?: string;
  };
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'confirmed':
    case 'done':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-blue-100 text-blue-800';
  }
};

const AppointmentRow: FC<AppointmentRowProps> = ({ appointment }) => {
  return (
    <TableRow className="hover:bg-gray-50">
      <TableCell>
        <div className="flex items-center">
          <Avatar className="h-10 w-10 bg-gray-200 text-gray-500">
            <AvatarFallback>
              <Users className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{appointment.patientName || `Patient #${appointment.patient}`}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="text-sm text-gray-900">{appointment.doctorName || `Doctor #${appointment.doctor}`}</div>
      </TableCell>
      <TableCell>
        <div className="text-sm text-gray-900">{formatDateToDisplay(appointment.datetime)}</div>
        <div className="text-sm text-gray-500">{formatTimeToDisplay(appointment.datetime)}</div>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className={getStatusColor(appointment.status)}>
          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="text-sm text-gray-900">
          {appointment.mode === 'video' ? (
            <span className="flex items-center text-blue-600">
              <Video className="h-4 w-4 mr-1" /> Video
            </span>
          ) : (
            <span className="flex items-center text-blue-600">
              <MessageCircle className="h-4 w-4 mr-1" /> Chat
            </span>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};

interface AppointmentTableProps {
  appointments: (Appointment & {
    patientName?: string;
    doctorName?: string;
  })[];
  isLoading?: boolean;
  showViewAll?: boolean;
  limit?: number;
}

export function AppointmentTable({ 
  appointments, 
  isLoading = false, 
  showViewAll = true,
  limit = 5
}: AppointmentTableProps) {
  const displayedAppointments = limit ? appointments.slice(0, limit) : appointments;
  
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold text-lg flex items-center">
          <CalendarCheck className="h-5 w-5 mr-2 text-blue-500" />
          Recent Appointments
        </h2>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Mode</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                </TableRow>
              ))
            ) : displayedAppointments.length > 0 ? (
              displayedAppointments.map((appointment) => (
                <AppointmentRow key={appointment.id} appointment={appointment} />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No appointments found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {showViewAll && (
        <div className="p-4 border-t border-gray-200 text-right">
          <Link to="/appointments" className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center">
            View all appointments
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
}
