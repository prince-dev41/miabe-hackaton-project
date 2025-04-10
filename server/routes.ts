import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertUserSchema, insertAppointmentSchema, insertMedicalRecordSchema, insertReminderSchema, insertFeedbackSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  const apiRouter = app.route('/api');
  
  // AUTH
  app.post('/api/token/', async (req, res) => {
    try {
      // Mock JWT token auth - in a real scenario this would validate against the database
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ detail: "Username and password are required" });
      }
      
      // Return mock token - in real implementation this would generate a JWT
      return res.json({
        token_type: "access",
        exp: Math.floor(Date.now() / 1000) + 3600, // Expires in 1 hour
        access: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ0MzE5MDAxLCJpYXQiOjE3NDQzMTg3MDEsImp0aSI6IjIzZTBlMjljODQ5MzRmMTM4ZGJjNjA5MTE2YzUzNTkyIiwidXNlcl9pZCI6NH0.-Yg3_ymURgTRR1syOEhr_85UnVKv1hEbp3O5rBaYv8c"
      });
    } catch (error) {
      console.error("Auth error:", error);
      return res.status(500).json({ detail: "Internal server error" });
    }
  });
  
  // USERS
  // Get users
  app.get('/api/users/', async (req, res) => {
    try {
      const isPatient = req.query.is_patient === 'true';
      const isDoctor = req.query.is_doctor === 'true';
      
      // Get all users for now - in real implementation we'd filter by user type
      const users = await storage.getAllUsers();
      
      let filteredUsers = users;
      
      if (isPatient) {
        filteredUsers = users.filter(user => user.is_patient);
      } else if (isDoctor) {
        filteredUsers = users.filter(user => user.is_doctor);
      }
      
      // For doctors, add mock rating
      if (isDoctor) {
        filteredUsers = filteredUsers.map(user => ({
          ...user,
          rating: Math.floor(Math.random() * 2) + 3 + Math.random(),
          specialty: ['Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 'General'][Math.floor(Math.random() * 5)],
          patientCount: Math.floor(Math.random() * 50) + 10
        }));
      }
      
      // For patients, add mock last appointment and record count
      if (isPatient) {
        filteredUsers = filteredUsers.map(user => ({
          ...user,
          lastAppointment: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
          recordCount: Math.floor(Math.random() * 10)
        }));
      }
      
      return res.json(filteredUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({ detail: "Internal server error" });
    }
  });
  
  // Create user
  app.post('/api/users/', async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      return res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ detail: error.errors });
      }
      return res.status(500).json({ detail: "Internal server error" });
    }
  });
  
  // Get user by ID
  app.get('/api/users/:id', async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ detail: "User not found" });
      }
      
      return res.json(user);
    } catch (error) {
      return res.status(500).json({ detail: "Internal server error" });
    }
  });
  
  // APPOINTMENTS
  // Get appointments
  app.get('/api/appointments/', async (req, res) => {
    try {
      // Sample appointments data based on the schema
      const appointments = [
        {
          id: 1,
          patient: 1,
          patientName: "Jean Dupont",
          doctor: 2,
          doctorName: "Dr. Sophie Martin",
          datetime: "2025-04-15T10:30:00Z",
          mode: "video",
          status: "confirmed"
        },
        {
          id: 2,
          patient: 3,
          patientName: "Marie Leclerc",
          doctor: 2,
          doctorName: "Dr. Pierre Dubois",
          datetime: "2025-04-16T14:00:00Z",
          mode: "chat",
          status: "pending"
        },
        {
          id: 3,
          patient: 1,
          patientName: "Jean Dupont",
          doctor: 4,
          doctorName: "Dr. Thomas Bernard",
          datetime: "2025-04-17T09:00:00Z",
          mode: "video",
          status: "pending"
        }
      ];
      
      // Filter by status if provided
      const status = req.query.status as string | undefined;
      const filteredAppointments = status
        ? appointments.filter(a => a.status === status)
        : appointments;
        
      return res.json(filteredAppointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      return res.status(500).json({ detail: "Internal server error" });
    }
  });
  
  // Create appointment
  app.post('/api/appointments/', async (req, res) => {
    try {
      const appointmentData = insertAppointmentSchema.parse(req.body);
      
      // In a real implementation, we'd save to the database
      // For now, return a mock response with the ID
      return res.status(201).json({
        id: Math.floor(Math.random() * 1000) + 1,
        ...appointmentData
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ detail: error.errors });
      }
      return res.status(500).json({ detail: "Internal server error" });
    }
  });
  
  // Get appointment by ID
  app.get('/api/appointments/:id', async (req, res) => {
    try {
      const appointmentId = parseInt(req.params.id);
      
      // In a real implementation, we'd fetch from the database
      // For now, return a mock appointment
      return res.json({
        id: appointmentId,
        patient: 1,
        patientName: "Jean Dupont",
        doctor: 2,
        doctorName: "Dr. Sophie Martin",
        datetime: "2025-04-15T10:30:00Z",
        mode: "video",
        status: "confirmed"
      });
    } catch (error) {
      return res.status(500).json({ detail: "Internal server error" });
    }
  });
  
  // Update appointment
  app.patch('/api/appointments/:id', async (req, res) => {
    try {
      const appointmentId = parseInt(req.params.id);
      
      // In a real implementation, we'd update in the database
      // For now, return the updated appointment
      return res.json({
        id: appointmentId,
        ...req.body
      });
    } catch (error) {
      return res.status(500).json({ detail: "Internal server error" });
    }
  });
  
  // Delete appointment
  app.delete('/api/appointments/:id', async (req, res) => {
    try {
      // In a real implementation, we'd delete from the database
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ detail: "Internal server error" });
    }
  });
  
  // MEDICAL RECORDS
  // Get medical records
  app.get('/api/records/', async (req, res) => {
    try {
      // Sample medical records data based on the schema
      const records = [
        {
          id: 1,
          patient: 1,
          patientName: "Jean Dupont",
          created_at: "2025-04-10T15:30:00Z",
          diagnosis: "Grippe saisonnière",
          treatment: "Repos, paracétamol, hydratation",
          file: "prescription_1.pdf"
        },
        {
          id: 2,
          patient: 3,
          patientName: "Marie Leclerc",
          created_at: "2025-04-05T11:00:00Z",
          diagnosis: "Hypertension artérielle",
          treatment: "Régime pauvre en sel, médicaments antihypertenseurs",
          file: "ecg_results.pdf"
        }
      ];
      
      // Filter by patient ID if provided
      const patientId = req.query.patient ? parseInt(req.query.patient as string) : undefined;
      const filteredRecords = patientId
        ? records.filter(r => r.patient === patientId)
        : records;
        
      return res.json(filteredRecords);
    } catch (error) {
      console.error("Error fetching medical records:", error);
      return res.status(500).json({ detail: "Internal server error" });
    }
  });
  
  // Create medical record
  app.post('/api/records/', async (req, res) => {
    try {
      const recordData = insertMedicalRecordSchema.parse(req.body);
      
      // In a real implementation, we'd save to the database
      // For now, return a mock response with the ID
      return res.status(201).json({
        id: Math.floor(Math.random() * 1000) + 1,
        created_at: new Date().toISOString(),
        file: null,
        ...recordData
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ detail: error.errors });
      }
      return res.status(500).json({ detail: "Internal server error" });
    }
  });
  
  // REMINDERS
  // Get reminders
  app.get('/api/reminders/', async (req, res) => {
    try {
      // Sample reminders data based on the schema
      const reminders = [
        {
          id: 1,
          patient: 1,
          patientName: "Jean Dupont",
          message: "Prendre vos médicaments à 20h",
          date_time: "2025-04-15T20:00:00Z"
        },
        {
          id: 2,
          patient: 3,
          patientName: "Marie Leclerc",
          message: "Rendez-vous de suivi demain à 10h",
          date_time: "2025-04-14T10:00:00Z"
        },
        {
          id: 3,
          patient: 1,
          patientName: "Jean Dupont",
          message: "N'oubliez pas de mesurer votre tension artérielle",
          date_time: "2025-04-16T09:00:00Z"
        }
      ];
      
      return res.json(reminders);
    } catch (error) {
      console.error("Error fetching reminders:", error);
      return res.status(500).json({ detail: "Internal server error" });
    }
  });
  
  // Create reminder
  app.post('/api/reminders/', async (req, res) => {
    try {
      const reminderData = insertReminderSchema.parse(req.body);
      
      // In a real implementation, we'd save to the database
      // For now, return a mock response with the ID
      return res.status(201).json({
        id: Math.floor(Math.random() * 1000) + 1,
        ...reminderData,
        patientName: "Patient" // In real implementation, we'd look up the patient name
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ detail: error.errors });
      }
      return res.status(500).json({ detail: "Internal server error" });
    }
  });
  
  // Delete reminder
  app.delete('/api/reminders/:id', async (req, res) => {
    try {
      // In a real implementation, we'd delete from the database
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ detail: "Internal server error" });
    }
  });
  
  // FEEDBACK
  // Get feedback
  app.get('/api/feedbacks/', async (req, res) => {
    try {
      // Sample feedback data based on the schema
      const feedbacks = [
        {
          id: 1,
          patient: 1,
          patientName: "Jean Dupont",
          doctor: 2,
          doctorName: "Dr. Sophie Martin",
          rating: 5,
          comment: "Excellent médecin, très à l'écoute."
        },
        {
          id: 2,
          patient: 3,
          patientName: "Marie Leclerc",
          doctor: 2,
          doctorName: "Dr. Sophie Martin",
          rating: 4,
          comment: "Bon diagnostic, consultation un peu rapide mais efficace."
        },
        {
          id: 3,
          patient: 4,
          patientName: "Thomas Bernard",
          doctor: 5,
          doctorName: "Dr. Pierre Dubois",
          rating: 3,
          comment: "Compétent, mais temps d'attente trop long."
        }
      ];
      
      return res.json(feedbacks);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      return res.status(500).json({ detail: "Internal server error" });
    }
  });
  
  // Create feedback
  app.post('/api/feedbacks/', async (req, res) => {
    try {
      const feedbackData = insertFeedbackSchema.parse(req.body);
      
      // In a real implementation, we'd save to the database
      // For now, return a mock response with the ID
      return res.status(201).json({
        id: Math.floor(Math.random() * 1000) + 1,
        ...feedbackData
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ detail: error.errors });
      }
      return res.status(500).json({ detail: "Internal server error" });
    }
  });
  
  // STATS
  app.get('/api/stats/', async (req, res) => {
    try {
      // Return mock statistics for the dashboard
      return res.json({
        totalAppointments: 157,
        activePatients: 89,
        activeDoctors: 23,
        avgRating: 4.8
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      return res.status(500).json({ detail: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
