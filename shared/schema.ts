import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  is_patient: boolean("is_patient").default(false),
  is_doctor: boolean("is_doctor").default(false),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  is_patient: true,
  is_doctor: true,
});

// Appointment model
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  patient: integer("patient").notNull().references(() => users.id),
  doctor: integer("doctor").notNull().references(() => users.id),
  datetime: timestamp("datetime").notNull(),
  mode: varchar("mode", { length: 10 }).notNull(), // video or chat
  status: varchar("status", { length: 20 }).notNull().default("pending"), // pending, done, etc.
});

export const insertAppointmentSchema = createInsertSchema(appointments);

// Medical Record model
export const medicalRecords = pgTable("medical_records", {
  id: serial("id").primaryKey(),
  patient: integer("patient").notNull().references(() => users.id),
  created_at: timestamp("created_at").defaultNow(),
  diagnosis: text("diagnosis").notNull(),
  treatment: text("treatment").notNull(),
  file: text("file"),
});

export const insertMedicalRecordSchema = createInsertSchema(medicalRecords).omit({
  created_at: true
});

// Reminder model
export const reminders = pgTable("reminders", {
  id: serial("id").primaryKey(),
  patient: integer("patient").notNull().references(() => users.id),
  message: text("message").notNull(),
  date_time: timestamp("date_time").notNull(),
});

export const insertReminderSchema = createInsertSchema(reminders);

// Feedback model
export const feedbacks = pgTable("feedbacks", {
  id: serial("id").primaryKey(),
  patient: integer("patient").notNull().references(() => users.id),
  doctor: integer("doctor").notNull().references(() => users.id),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
});

export const insertFeedbackSchema = createInsertSchema(feedbacks);

// Type definitions
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;

export type MedicalRecord = typeof medicalRecords.$inferSelect;
export type InsertMedicalRecord = z.infer<typeof insertMedicalRecordSchema>;

export type Reminder = typeof reminders.$inferSelect;
export type InsertReminder = z.infer<typeof insertReminderSchema>;

export type Feedback = typeof feedbacks.$inferSelect;
export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;
