import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  boolean,
  decimal,
  integer,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  isVolunteer: boolean("is_volunteer").default(false),
  volunteerRadius: integer("volunteer_radius").default(500), // in meters
  volunteerRating: decimal("volunteer_rating", { precision: 3, scale: 2 }).default("0.00"),
  totalResponses: integer("total_responses").default(0),
  shakeToAlert: boolean("shake_to_alert").default(true),
  silentMode: boolean("silent_mode").default(false),
  autoRecord: boolean("auto_record").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Trusted contacts for emergency notifications
export const trustedContacts = pgTable("trusted_contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name").notNull(),
  phone: varchar("phone").notNull(),
  email: varchar("email"),
  relationship: varchar("relationship"),
  isActive: boolean("is_active").default(true),
  priority: integer("priority").default(1), // 1-5, 1 being highest priority
  createdAt: timestamp("created_at").defaultNow(),
});

// Emergency alerts/SOS incidents
export const emergencyAlerts = pgTable("emergency_alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  address: text("address"),
  alertType: varchar("alert_type").notNull(), // 'general', 'harassment', 'assault', 'lost', 'panic'
  status: varchar("status").notNull().default("active"), // 'active', 'resolved', 'cancelled'
  description: text("description"),
  audioRecordingUrl: varchar("audio_recording_url"),
  photoUrl: varchar("photo_url"),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Volunteer responses to emergency alerts
export const volunteerResponses = pgTable("volunteer_responses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  alertId: varchar("alert_id").notNull().references(() => emergencyAlerts.id, { onDelete: "cascade" }),
  volunteerId: varchar("volunteer_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  status: varchar("status").notNull().default("pending"), // 'pending', 'accepted', 'declined', 'completed'
  estimatedArrival: integer("estimated_arrival"), // in minutes
  actualArrival: timestamp("actual_arrival"),
  completedAt: timestamp("completed_at"),
  rating: integer("rating"), // 1-5 rating given by the person in distress
  feedback: text("feedback"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Incident reports for unsafe areas/experiences
export const incidentReports = pgTable("incident_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  incidentType: varchar("incident_type").notNull(), // 'harassment', 'stalking', 'theft', 'unsafe_area', 'other'
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  address: text("address"),
  isPublic: boolean("is_public").default(false),
  severity: varchar("severity").default("medium"), // 'low', 'medium', 'high'
  photoUrl: varchar("photo_url"),
  tags: text("tags").array(), // array of tags like ['harassment', 'night', 'parking_lot']
  status: varchar("status").default("open"), // 'open', 'investigating', 'resolved'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Activity log for user actions
export const activityLogs = pgTable("activity_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  actionType: varchar("action_type").notNull(), // 'sos_triggered', 'location_shared', 'volunteer_response', 'safety_check'
  title: varchar("title").notNull(),
  description: text("description"),
  metadata: jsonb("metadata"), // additional data like contact names, locations, etc.
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = {
  trustedContacts: trustedContacts,
  emergencyAlerts: emergencyAlerts,
  volunteerResponses: volunteerResponses,
  incidentReports: incidentReports,
  activityLogs: activityLogs,
};

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTrustedContactSchema = createInsertSchema(trustedContacts).omit({
  id: true,
  createdAt: true,
});

export const insertEmergencyAlertSchema = createInsertSchema(emergencyAlerts).omit({
  id: true,
  createdAt: true,
});

export const insertVolunteerResponseSchema = createInsertSchema(volunteerResponses).omit({
  id: true,
  createdAt: true,
});

export const insertIncidentReportSchema = createInsertSchema(incidentReports).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertActivityLogSchema = createInsertSchema(activityLogs).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type TrustedContact = typeof trustedContacts.$inferSelect;
export type InsertTrustedContact = z.infer<typeof insertTrustedContactSchema>;
export type EmergencyAlert = typeof emergencyAlerts.$inferSelect;
export type InsertEmergencyAlert = z.infer<typeof insertEmergencyAlertSchema>;
export type VolunteerResponse = typeof volunteerResponses.$inferSelect;
export type InsertVolunteerResponse = z.infer<typeof insertVolunteerResponseSchema>;
export type IncidentReport = typeof incidentReports.$inferSelect;
export type InsertIncidentReport = z.infer<typeof insertIncidentReportSchema>;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;
