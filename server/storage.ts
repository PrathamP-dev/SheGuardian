import {
  users,
  trustedContacts,
  emergencyAlerts,
  volunteerResponses,
  incidentReports,
  activityLogs,
  type User,
  type UpsertUser,
  type TrustedContact,
  type InsertTrustedContact,
  type EmergencyAlert,
  type InsertEmergencyAlert,
  type VolunteerResponse,
  type InsertVolunteerResponse,
  type IncidentReport,
  type InsertIncidentReport,
  type ActivityLog,
  type InsertActivityLog,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql, lt, or } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserVolunteerStatus(userId: string, isVolunteer: boolean, radius?: number): Promise<User>;
  updateUserPreferences(userId: string, preferences: Partial<User>): Promise<User>;

  // Trusted contacts operations
  getTrustedContacts(userId: string): Promise<TrustedContact[]>;
  addTrustedContact(contact: InsertTrustedContact): Promise<TrustedContact>;
  updateTrustedContact(contactId: string, contact: Partial<TrustedContact>): Promise<TrustedContact>;
  deleteTrustedContact(contactId: string): Promise<void>;

  // Emergency alerts operations
  createEmergencyAlert(alert: InsertEmergencyAlert): Promise<EmergencyAlert>;
  getEmergencyAlert(alertId: string): Promise<EmergencyAlert | undefined>;
  updateEmergencyAlertStatus(alertId: string, status: string): Promise<EmergencyAlert>;
  getActiveEmergencyAlerts(): Promise<EmergencyAlert[]>;
  getUserEmergencyAlerts(userId: string): Promise<EmergencyAlert[]>;

  // Volunteer response operations
  createVolunteerResponse(response: InsertVolunteerResponse): Promise<VolunteerResponse>;
  getVolunteerResponsesForAlert(alertId: string): Promise<VolunteerResponse[]>;
  updateVolunteerResponse(responseId: string, response: Partial<VolunteerResponse>): Promise<VolunteerResponse>;
  getNearbyVolunteers(latitude: number, longitude: number, radiusKm: number): Promise<User[]>;

  // Incident reports operations
  createIncidentReport(report: InsertIncidentReport): Promise<IncidentReport>;
  getIncidentReports(userId: string): Promise<IncidentReport[]>;
  getPublicIncidentReports(): Promise<IncidentReport[]>;
  updateIncidentReport(reportId: string, report: Partial<IncidentReport>): Promise<IncidentReport>;
  deleteIncidentReport(reportId: string): Promise<void>;

  // Activity log operations
  createActivityLog(log: InsertActivityLog): Promise<ActivityLog>;
  getUserActivityLogs(userId: string, limit?: number): Promise<ActivityLog[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserVolunteerStatus(userId: string, isVolunteer: boolean, radius?: number): Promise<User> {
    const updateData: Partial<User> = { isVolunteer };
    if (radius !== undefined) {
      updateData.volunteerRadius = radius;
    }

    const [user] = await db
      .update(users)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateUserPreferences(userId: string, preferences: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...preferences, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Trusted contacts operations
  async getTrustedContacts(userId: string): Promise<TrustedContact[]> {
    return await db
      .select()
      .from(trustedContacts)
      .where(and(eq(trustedContacts.userId, userId), eq(trustedContacts.isActive, true)))
      .orderBy(trustedContacts.priority);
  }

  async addTrustedContact(contact: InsertTrustedContact): Promise<TrustedContact> {
    const [newContact] = await db
      .insert(trustedContacts)
      .values(contact)
      .returning();
    return newContact;
  }

  async updateTrustedContact(contactId: string, contact: Partial<TrustedContact>): Promise<TrustedContact> {
    const [updatedContact] = await db
      .update(trustedContacts)
      .set(contact)
      .where(eq(trustedContacts.id, contactId))
      .returning();
    return updatedContact;
  }

  async deleteTrustedContact(contactId: string): Promise<void> {
    await db
      .update(trustedContacts)
      .set({ isActive: false })
      .where(eq(trustedContacts.id, contactId));
  }

  // Emergency alerts operations
  async createEmergencyAlert(alert: InsertEmergencyAlert): Promise<EmergencyAlert> {
    const [newAlert] = await db
      .insert(emergencyAlerts)
      .values(alert)
      .returning();
    return newAlert;
  }

  async getEmergencyAlert(alertId: string): Promise<EmergencyAlert | undefined> {
    const [alert] = await db
      .select()
      .from(emergencyAlerts)
      .where(eq(emergencyAlerts.id, alertId));
    return alert;
  }

  async updateEmergencyAlertStatus(alertId: string, status: string): Promise<EmergencyAlert> {
    const updateData: any = { status };
    if (status === 'resolved' || status === 'cancelled') {
      updateData.resolvedAt = new Date();
    }

    const [updatedAlert] = await db
      .update(emergencyAlerts)
      .set(updateData)
      .where(eq(emergencyAlerts.id, alertId))
      .returning();
    return updatedAlert;
  }

  async getActiveEmergencyAlerts(): Promise<EmergencyAlert[]> {
    return await db
      .select()
      .from(emergencyAlerts)
      .where(eq(emergencyAlerts.status, 'active'))
      .orderBy(desc(emergencyAlerts.createdAt));
  }

  async getUserEmergencyAlerts(userId: string): Promise<EmergencyAlert[]> {
    return await db
      .select()
      .from(emergencyAlerts)
      .where(eq(emergencyAlerts.userId, userId))
      .orderBy(desc(emergencyAlerts.createdAt));
  }

  // Volunteer response operations
  async createVolunteerResponse(response: InsertVolunteerResponse): Promise<VolunteerResponse> {
    const [newResponse] = await db
      .insert(volunteerResponses)
      .values(response)
      .returning();
    return newResponse;
  }

  async getVolunteerResponsesForAlert(alertId: string): Promise<VolunteerResponse[]> {
    return await db
      .select()
      .from(volunteerResponses)
      .where(eq(volunteerResponses.alertId, alertId))
      .orderBy(volunteerResponses.createdAt);
  }

  async updateVolunteerResponse(responseId: string, response: Partial<VolunteerResponse>): Promise<VolunteerResponse> {
    const [updatedResponse] = await db
      .update(volunteerResponses)
      .set(response)
      .where(eq(volunteerResponses.id, responseId))
      .returning();
    return updatedResponse;
  }

  async getNearbyVolunteers(latitude: number, longitude: number, radiusKm: number): Promise<User[]> {
    // Simple bounding box query for nearby volunteers
    // In production, you might want to use PostGIS for more accurate distance calculations
    const latRange = radiusKm / 111; // Rough conversion: 1 degree ≈ 111 km
    const lngRange = radiusKm / (111 * Math.cos(latitude * Math.PI / 180));

    return await db
      .select()
      .from(users)
      .where(and(
        eq(users.isVolunteer, true),
        // This is a simplified distance check - in production use proper geospatial queries
      ))
      .limit(10);
  }

  // Incident reports operations
  async createIncidentReport(report: InsertIncidentReport): Promise<IncidentReport> {
    const [newReport] = await db
      .insert(incidentReports)
      .values(report)
      .returning();
    return newReport;
  }

  async getIncidentReports(userId: string): Promise<IncidentReport[]> {
    return await db
      .select()
      .from(incidentReports)
      .where(eq(incidentReports.userId, userId))
      .orderBy(desc(incidentReports.createdAt));
  }

  async getPublicIncidentReports(): Promise<IncidentReport[]> {
    return await db
      .select()
      .from(incidentReports)
      .where(eq(incidentReports.isPublic, true))
      .orderBy(desc(incidentReports.createdAt))
      .limit(50);
  }

  async updateIncidentReport(reportId: string, report: Partial<IncidentReport>): Promise<IncidentReport> {
    const [updatedReport] = await db
      .update(incidentReports)
      .set({ ...report, updatedAt: new Date() })
      .where(eq(incidentReports.id, reportId))
      .returning();
    return updatedReport;
  }

  async deleteIncidentReport(reportId: string): Promise<void> {
    await db
      .delete(incidentReports)
      .where(eq(incidentReports.id, reportId));
  }

  // Activity log operations
  async createActivityLog(log: InsertActivityLog): Promise<ActivityLog> {
    const [newLog] = await db
      .insert(activityLogs)
      .values(log)
      .returning();
    return newLog;
  }

  async getUserActivityLogs(userId: string, limit: number = 10): Promise<ActivityLog[]> {
    return await db
      .select()
      .from(activityLogs)
      .where(eq(activityLogs.userId, userId))
      .orderBy(desc(activityLogs.createdAt))
      .limit(limit);
  }
}

export const storage = new DatabaseStorage();
