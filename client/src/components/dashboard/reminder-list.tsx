import { Bell } from "lucide-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Reminder } from "@shared/schema";
import { formatDateToDisplay, formatTimeToDisplay } from "@/lib/utils";

interface ReminderCardProps {
  reminder: Reminder & {
    patientName?: string;
  };
  colorScheme?: "blue" | "primary" | "yellow";
}

function ReminderCard({
  reminder,
  colorScheme = "primary",
}: ReminderCardProps) {
  const borderColors = {
    blue: "border-blue-500 bg-blue-50",
    primary: "border-primary-500 bg-primary-50",
    yellow: "border-yellow-500 bg-yellow-50",
  };

  const borderColor = borderColors[colorScheme];

  return (
    <div className={`mb-4 p-3 border-l-4 ${borderColor} rounded-r-md`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-gray-900">{reminder.message.substring(0, 30)}...</h3>
          <p className="text-sm text-gray-600 mt-1">{reminder.message}</p>
        </div>
        <span className="text-xs text-gray-500">
          {formatDateToDisplay(reminder.date_time)}, {formatTimeToDisplay(reminder.date_time)}
        </span>
      </div>
      <div className="mt-2 text-xs text-gray-500">
        <span>For: {reminder.patientName || `Patient #${reminder.patient}`}</span>
      </div>
    </div>
  );
}

interface ReminderListProps {
  reminders: (Reminder & {
    patientName?: string;
  })[];
  isLoading?: boolean;
  showViewAll?: boolean;
  limit?: number;
}

export function ReminderList({
  reminders,
  isLoading = false,
  showViewAll = true,
  limit = 3,
}: ReminderListProps) {
  const displayedReminders = limit ? reminders.slice(0, limit) : reminders;
  const colorSchemes: ("blue" | "primary" | "yellow")[] = ["primary", "blue", "yellow"];

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold text-lg flex items-center">
          <Bell className="h-5 w-5 mr-2 text-yellow-500" />
          Upcoming Reminders
        </h2>
      </div>
      <div className="p-4">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="mb-4">
              <Skeleton className="h-24 w-full rounded-md" />
            </div>
          ))
        ) : displayedReminders.length > 0 ? (
          displayedReminders.map((reminder, index) => (
            <ReminderCard 
              key={reminder.id} 
              reminder={reminder} 
              colorScheme={colorSchemes[index % colorSchemes.length]}
            />
          ))
        ) : (
          <div className="text-center py-6 text-gray-500">
            No upcoming reminders
          </div>
        )}
      </div>
      {showViewAll && (
        <div className="p-4 border-t border-gray-200 text-right">
          <Link to="/reminders" className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center">
            Manage all reminders
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
