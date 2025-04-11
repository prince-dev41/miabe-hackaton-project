import { apiRequest } from '@/lib/queryClient';
import {
  User,
  Appointment,
  MedicalRecord,
  Reminder,
  Feedback,
  InsertReminder
} from '@shared/schema';

// API base URL
const API_BASE_URL = 'https://telemed-api-p8fx.onrender.com/api';

// Stats dashboard data
export interface DashboardStats {
  totalAppointments: number;
  activePatients: number;
  activeDoctors: number;
  avgRating: number;
}

// Auth API
export const login = async (username: string, password: string) => {
  const response = await apiRequest('POST', `${API_BASE_URL}/token/`, { username, password });
  return response.json();
};

// Users API
export const fetchPatients = async (): Promise<User[]> => {
  const response = await apiRequest('GET', `${API_BASE_URL}/users/?is_patient=true`);
  return response.json();
};

export const fetchDoctors = async (): Promise<User[]> => {
  const response = await apiRequest('GET', `${API_BASE_URL}/users/?is_doctor=true`);
  return response.json();
};

// Appointments API
export const fetchAppointments = async (status?: string): Promise<Appointment[]> => {
  const url = status 
    ? `${API_BASE_URL}/appointments/` 
    : `${API_BASE_URL}/appointments/`;
  const response = await apiRequest('GET', url);
  return response.json();
};

export const createAppointment = async (data: any): Promise<Appointment> => {
  const response = await apiRequest('POST', `${API_BASE_URL}/appointments/`, data);
  return response.json();
};

export const updateAppointment = async (id: number, data: any): Promise<Appointment> => {
  const response = await apiRequest('PATCH', `${API_BASE_URL}/appointments/${id}/`, data);
  return response.json();
};

export const deleteAppointment = async (id: number): Promise<void> => {
  await apiRequest('DELETE', `${API_BASE_URL}/appointments/${id}/`);
};

// Medical Records API
export const fetchMedicalRecords = async (): Promise<MedicalRecord[]> => {
  const response = await apiRequest('GET', `${API_BASE_URL}/records/`);
  return response.json();
};

export const fetchPatientRecords = async (patientId: number): Promise<MedicalRecord[]> => {
  const response = await apiRequest('GET', `${API_BASE_URL}/records/?patient=${patientId}`);
  return response.json();
};

export const createMedicalRecord = async (data: FormData): Promise<MedicalRecord> => {
  // Note: For file uploads, we need to use a different approach
  const response = await fetch(`${API_BASE_URL}/records/`, {
    method: 'POST',
    body: data,
    credentials: 'include'
  });
  
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`${response.status}: ${text}`);
  }
  
  return response.json();
};

// Reminders API
export const fetchReminders = async (): Promise<Reminder[]> => {
  const response = await apiRequest('GET', `${API_BASE_URL}/reminders/`);
  return response.json();
};

export const createReminder = async (data: InsertReminder): Promise<Reminder> => {
  const response = await apiRequest('POST', `${API_BASE_URL}/reminders/`, data);
  return response.json();
};

export const updateReminder = async (id: number, data: Partial<InsertReminder>): Promise<Reminder> => {
  const response = await apiRequest('PATCH', `${API_BASE_URL}/reminders/${id}/`, data);
  return response.json();
};

export const deleteReminder = async (id: number): Promise<void> => {
  await apiRequest('DELETE', `${API_BASE_URL}/reminders/${id}/`);
};

// Feedback API
export const fetchFeedback = async (): Promise<Feedback[]> => {
  const response = await apiRequest('GET', `${API_BASE_URL}/feedbacks/`);
  return response.json();
};

export const createFeedback = async (data: any): Promise<Feedback> => {
  const response = await apiRequest('POST', `${API_BASE_URL}/feedbacks/`, data);
  return response.json();
};

// Stats API
export const fetchStats = async (): Promise<DashboardStats> => {
  const response = await apiRequest('GET', `${API_BASE_URL}/stats/`);
  return response.json();
};
