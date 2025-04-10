import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge multiple class names with Tailwind CSS
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format date to display format (e.g., Apr 15, 2025)
 */
export function formatDateToDisplay(dateStr: string | Date): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Format time to display format (e.g., 10:30 AM)
 */
export function formatTimeToDisplay(dateStr: string | Date): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format date time to ISO format for API requests
 */
export function formatDateTimeForAPI(dateStr: string | Date): string {
  const date = new Date(dateStr);
  return date.toISOString();
}

/**
 * Truncate text with ellipsis if it exceeds the specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

/**
 * Get status color classes based on the status string
 */
export function getStatusColorClass(status: string): string {
  const statusLower = status.toLowerCase();
  
  if (statusLower === 'confirmed' || statusLower === 'done' || statusLower === 'active') {
    return 'bg-green-100 text-green-800';
  }
  
  if (statusLower === 'pending' || statusLower === 'upcoming') {
    return 'bg-yellow-100 text-yellow-800';
  }
  
  if (statusLower === 'cancelled' || statusLower === 'inactive') {
    return 'bg-red-100 text-red-800';
  }
  
  return 'bg-blue-100 text-blue-800';
}

/**
 * Calculate time difference between two dates and return it in a human-readable format
 */
export function getTimeDifference(date1: Date, date2: Date): string {
  const diffInMs = Math.abs(date2.getTime() - date1.getTime());
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''}`;
  }
  
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  
  if (diffInHours > 0) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''}`;
  }
  
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  
  return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`;
}

/**
 * Check if a reminder is in the past
 */
export function isReminderPast(dateTime: string | Date): boolean {
  const reminderDate = new Date(dateTime);
  return reminderDate.getTime() < Date.now();
}

/**
 * Check if a date is today
 */
export function isToday(dateStr: string | Date): boolean {
  const date = new Date(dateStr);
  const today = new Date();
  
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Format a number with commas for thousands
 */
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
