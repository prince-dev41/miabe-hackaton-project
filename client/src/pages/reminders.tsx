import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Search, Plus, Bell, Calendar, Edit, Trash, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { fetchReminders, fetchPatients, createReminder, deleteReminder } from '@/lib/api';
import { queryClient } from '@/lib/queryClient';
import { Pagination } from '@/components/ui/pagination';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Extended schema with validation
const reminderFormSchema = {
  message: z.string().min(5, "Message must be at least 5 characters"),
  date_time: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Please enter a valid date and time"
  })
};

type ReminderFormValues = z.infer<typeof reminderFormSchema>;

export default function Reminders() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const itemsPerPage = 10;
  const { toast } = useToast();

  // Fetch reminders
  const { data: reminders, isLoading } = useQuery({
    queryKey: ['/api/reminders'],
    queryFn: fetchReminders
  });

  // Fetch patients for the form
  const { data: patients } = useQuery({
    queryKey: ['/api/patients'],
    queryFn: fetchPatients
  });

  // Create reminder mutation
  const createReminderMutation = useMutation({
    mutationFn: createReminder,
    onSuccess: () => {
      toast({
        title: "Reminder created",
        description: "The reminder has been created successfully.",
      });
      setIsAddDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['/api/reminders'] });
    },
    onError: (error) => {
      toast({
        title: "Error creating reminder",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  });

  // Delete reminder mutation
  const deleteReminderMutation = useMutation({
    mutationFn: deleteReminder,
    onSuccess: () => {
      toast({
        title: "Reminder deleted",
        description: "The reminder has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/reminders'] });
    },
    onError: (error) => {
      toast({
        title: "Error deleting reminder",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  });

  // Form for adding a new reminder
  const form = useForm<ReminderFormValues>({
    resolver: zodResolver(reminderFormSchema),
    defaultValues: {
      message: "",
      patient: 0,
      date_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16)
    }
  });

  const onSubmit = (data: ReminderFormValues) => {
    createReminderMutation.mutate({
      ...data,
      // Convert the string date to ISO format
      date_time: new Date(data.date_time).toISOString()
    });
  };

  // Filter reminders by search query
  const filteredReminders = reminders?.filter(reminder => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    
    const patientMatch = reminder.patientName 
      ? reminder.patientName.toLowerCase().includes(searchLower)
      : String(reminder.patient).includes(searchLower);
      
    const messageMatch = reminder.message.toLowerCase().includes(searchLower);
      
    return patientMatch || messageMatch;
  }) || [];

  // Sort reminders by date (upcoming first)
  const sortedReminders = [...filteredReminders].sort(
    (a, b) => new Date(a.date_time).getTime() - new Date(b.date_time).getTime()
  );

  // Pagination
  const totalItems = sortedReminders.length;
  const paginatedReminders = sortedReminders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Helper to check if reminder is in the past
  const isReminderPast = (dateTime: string) => {
    return new Date(dateTime).getTime() < Date.now();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2 text-yellow-500" />
            Reminder System
          </CardTitle>
          <div className="mt-3 sm:mt-0 flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search reminders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <Search className="h-4 w-4" />
              </div>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" /> New Reminder
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="mb-4">Create New Reminder</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="patient"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Patient</FormLabel>
                          <FormControl>
                            <select
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                              value={field.value}
                              onChange={e => field.onChange(parseInt(e.target.value, 10))}
                            >
                              <option value={0} disabled>Select a patient</option>
                              {patients?.map(patient => (
                                <option key={patient.id} value={patient.id}>
                                  {patient.username}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter reminder message" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="date_time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date & Time</FormLabel>
                          <FormControl>
                            <Input
                              type="datetime-local"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsAddDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit"
                        disabled={createReminderMutation.isPending}
                      >
                        {createReminderMutation.isPending ? "Creating..." : "Create Reminder"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        <CardContent className="p-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
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
                      <td className="px-6 py-4 whitespace-nowrap"><div className="h-10 bg-gray-200 rounded w-full"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
                      <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                      <td className="px-6 py-4 whitespace-nowrap"><div className="h-6 bg-gray-200 rounded w-16"></div></td>
                      <td className="px-6 py-4 whitespace-nowrap"><div className="h-8 bg-gray-200 rounded w-20"></div></td>
                    </tr>
                  ))
                ) : paginatedReminders.length > 0 ? (
                  paginatedReminders.map((reminder) => (
                    <tr key={reminder.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                            <User className="h-5 w-5" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {reminder.patientName || `Patient #${reminder.patient}`}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {reminder.message}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                          {new Date(reminder.date_time).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-gray-400" />
                          {new Date(reminder.date_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          variant="outline"
                          className={
                            isReminderPast(reminder.date_time)
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-green-100 text-green-800'
                          }
                        >
                          {isReminderPast(reminder.date_time) ? 'Past' : 'Upcoming'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon" className="text-blue-600 hover:text-blue-900" title="Edit">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-600 hover:text-red-900" 
                            title="Delete"
                            onClick={() => deleteReminderMutation.mutate(reminder.id)}
                            disabled={deleteReminderMutation.isPending}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      No reminders found
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Reminders</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {reminders ? (
              <div className="space-y-3">
                {reminders
                  .filter(r => !isReminderPast(r.date_time))
                  .sort((a, b) => new Date(a.date_time).getTime() - new Date(b.date_time).getTime())
                  .slice(0, 5)
                  .map(reminder => (
                    <Card key={reminder.id} className="border-l-4 border-blue-500">
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-900">{reminder.patientName || `Patient #${reminder.patient}`}</h3>
                            <p className="text-sm text-gray-600 mt-1">{reminder.message}</p>
                          </div>
                          <div className="text-xs text-gray-500 flex flex-col items-end">
                            <span>{new Date(reminder.date_time).toLocaleDateString()}</span>
                            <span>{new Date(reminder.date_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                {reminders.filter(r => !isReminderPast(r.date_time)).length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    No upcoming reminders
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                Loading...
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reminders by Type</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-64 flex items-center justify-center">
              <div className="w-full max-w-xs">
                <div className="relative h-64 w-64 mx-auto">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle r="35" cx="50" cy="50" fill="#3B82F6" />
                    <circle r="35" cx="50" cy="50" fill="transparent" stroke="#60A5FA" strokeWidth="30" strokeDasharray="55 170" />
                    <circle r="35" cx="50" cy="50" fill="transparent" stroke="#93C5FD" strokeWidth="30" strokeDasharray="30 195" />
                    <circle r="35" cx="50" cy="50" fill="transparent" stroke="#BFDBFE" strokeWidth="30" strokeDasharray="15 210" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-white text-lg font-medium">
                    Reminders
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
                    <span className="text-sm">Medication (40%)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-400 rounded-full mr-2"></div>
                    <span className="text-sm">Appointments (30%)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-300 rounded-full mr-2"></div>
                    <span className="text-sm">Follow-ups (20%)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-200 rounded-full mr-2"></div>
                    <span className="text-sm">Other (10%)</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
