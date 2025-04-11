import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, User, UserRound, Star } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/stats-card';
import { AppointmentTable } from '@/components/dashboard/appointment-table';
import { ReminderList } from '@/components/dashboard/reminder-list';
import { fetchAppointments, fetchReminders, fetchStats } from '@/lib/api';

export default function Dashboard() {
  // Fetch data
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['/api/stats'],
    queryFn: fetchStats
  });

  const { data: appointments, isLoading: isLoadingAppointments } = useQuery({
    queryKey: ['/api/appointments'],
    queryFn: fetchAppointments
  });

  const { data: reminders, isLoading: isLoadingReminders } = useQuery({
    queryKey: ['/api/reminders'],
    queryFn: fetchReminders
  });

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard
          title="Total RDV"
          value={isLoadingStats ? '...' : stats?.totalAppointments || 0}
          icon={<Calendar className="h-5 w-5 text-blue-600" />}
          iconBgColor="bg-blue-100"
          percentageChange={12}
        />
        
        <StatsCard
          title="Patients Actives"
          value={isLoadingStats ? '...' : stats?.activePatients || 0}
          icon={<User className="h-5 w-5 text-green-600" />}
          iconBgColor="bg-green-100"
          percentageChange={8}
        />
        
        <StatsCard
          title="Docteurs Actives"
          value={isLoadingStats ? '...' : stats?.activeDoctors || 0}
          icon={<UserRound className="h-5 w-5 text-indigo-600" />}
          iconBgColor="bg-indigo-100"
          percentageChange={-3}
        />
        
        <StatsCard
          title="Moyenne des notes"
          value={isLoadingStats ? '...' : stats?.avgRating || 0}
          icon={<Star className="h-5 w-5 text-yellow-600" />}
          iconBgColor="bg-yellow-100"
          percentageChange={5}
        />
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AppointmentTable
            appointments={appointments || []}
            isLoading={isLoadingAppointments}
            limit={5}
          />
        </div>
        
        <div>
          <ReminderList
            reminders={reminders || []}
            isLoading={isLoadingReminders}
            limit={3}
          />
        </div>
      </div>
    </div>
  );
}
