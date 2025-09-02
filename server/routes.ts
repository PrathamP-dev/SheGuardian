import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertTrustedContactSchema,
  insertEmergencyAlertSchema,
  insertVolunteerResponseSchema,
  insertIncidentReportSchema,
  insertActivityLogSchema,
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Trusted contacts routes
  app.get('/api/trusted-contacts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const contacts = await storage.getTrustedContacts(userId);
      res.json(contacts);
    } catch (error) {
      console.error("Error fetching trusted contacts:", error);
      res.status(500).json({ message: "Failed to fetch trusted contacts" });
    }
  });

  app.post('/api/trusted-contacts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const contactData = insertTrustedContactSchema.parse({
        ...req.body,
        userId,
      });
      
      // Check if user already has 5 contacts
      const existingContacts = await storage.getTrustedContacts(userId);
      if (existingContacts.length >= 5) {
        return res.status(400).json({ message: "Maximum of 5 trusted contacts allowed" });
      }

      const contact = await storage.addTrustedContact(contactData);
      
      // Log activity
      await storage.createActivityLog({
        userId,
        actionType: "contact_added",
        title: "Trusted contact added",
        description: `Added ${contact.name} as a trusted contact`,
        metadata: { contactId: contact.id, contactName: contact.name },
      });

      res.json(contact);
    } catch (error) {
      console.error("Error adding trusted contact:", error);
      res.status(500).json({ message: "Failed to add trusted contact" });
    }
  });

  app.put('/api/trusted-contacts/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const contactId = req.params.id;
      
      // Verify the contact belongs to the user
      const contacts = await storage.getTrustedContacts(userId);
      const contact = contacts.find(c => c.id === contactId);
      if (!contact) {
        return res.status(404).json({ message: "Contact not found" });
      }

      const updatedContact = await storage.updateTrustedContact(contactId, req.body);
      res.json(updatedContact);
    } catch (error) {
      console.error("Error updating trusted contact:", error);
      res.status(500).json({ message: "Failed to update trusted contact" });
    }
  });

  app.delete('/api/trusted-contacts/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const contactId = req.params.id;
      
      // Verify the contact belongs to the user
      const contacts = await storage.getTrustedContacts(userId);
      const contact = contacts.find(c => c.id === contactId);
      if (!contact) {
        return res.status(404).json({ message: "Contact not found" });
      }

      await storage.deleteTrustedContact(contactId);
      
      // Log activity
      await storage.createActivityLog({
        userId,
        actionType: "contact_removed",
        title: "Trusted contact removed",
        description: `Removed ${contact.name} from trusted contacts`,
        metadata: { contactName: contact.name },
      });

      res.json({ message: "Contact deleted successfully" });
    } catch (error) {
      console.error("Error deleting trusted contact:", error);
      res.status(500).json({ message: "Failed to delete trusted contact" });
    }
  });

  // Emergency alerts routes
  app.post('/api/emergency-alert', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const alertData = insertEmergencyAlertSchema.parse({
        ...req.body,
        userId,
      });

      const alert = await storage.createEmergencyAlert(alertData);
      
      // Log activity
      await storage.createActivityLog({
        userId,
        actionType: "sos_triggered",
        title: "Emergency SOS triggered",
        description: "Emergency alert sent to contacts and authorities",
        metadata: { 
          alertId: alert.id, 
          alertType: alert.alertType,
          location: alert.address || "Location unavailable"
        },
      });

      // In a real implementation, this would trigger notifications to:
      // - Trusted contacts via SMS/email
      // - Nearby volunteers via push notifications
      // - Emergency services via API integration
      // - Start audio/video recording if enabled

      res.json(alert);
    } catch (error) {
      console.error("Error creating emergency alert:", error);
      res.status(500).json({ message: "Failed to create emergency alert" });
    }
  });

  app.put('/api/emergency-alert/:id/status', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const alertId = req.params.id;
      const { status } = req.body;

      if (!['active', 'resolved', 'cancelled'].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      // Verify the alert belongs to the user
      const alert = await storage.getEmergencyAlert(alertId);
      if (!alert || alert.userId !== userId) {
        return res.status(404).json({ message: "Alert not found" });
      }

      const updatedAlert = await storage.updateEmergencyAlertStatus(alertId, status);
      
      // Log activity
      await storage.createActivityLog({
        userId,
        actionType: status === 'resolved' ? "safety_check" : "sos_cancelled",
        title: status === 'resolved' ? "Emergency resolved" : "Emergency cancelled",
        description: `Emergency alert ${status}`,
        metadata: { alertId: alertId, status },
      });

      res.json(updatedAlert);
    } catch (error) {
      console.error("Error updating emergency alert status:", error);
      res.status(500).json({ message: "Failed to update emergency alert status" });
    }
  });

  app.get('/api/emergency-alerts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const alerts = await storage.getUserEmergencyAlerts(userId);
      res.json(alerts);
    } catch (error) {
      console.error("Error fetching emergency alerts:", error);
      res.status(500).json({ message: "Failed to fetch emergency alerts" });
    }
  });

  // Volunteer routes
  app.get('/api/nearby-volunteers', isAuthenticated, async (req: any, res) => {
    try {
      const { latitude, longitude, radius = 1 } = req.query;
      
      if (!latitude || !longitude) {
        return res.status(400).json({ message: "Latitude and longitude are required" });
      }

      const volunteers = await storage.getNearbyVolunteers(
        parseFloat(latitude as string),
        parseFloat(longitude as string),
        parseFloat(radius as string)
      );
      
      res.json(volunteers);
    } catch (error) {
      console.error("Error fetching nearby volunteers:", error);
      res.status(500).json({ message: "Failed to fetch nearby volunteers" });
    }
  });

  app.put('/api/volunteer-status', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { isVolunteer, radius } = req.body;

      const user = await storage.updateUserVolunteerStatus(userId, isVolunteer, radius);
      
      // Log activity
      await storage.createActivityLog({
        userId,
        actionType: isVolunteer ? "volunteer_enabled" : "volunteer_disabled",
        title: isVolunteer ? "Volunteer status enabled" : "Volunteer status disabled",
        description: isVolunteer ? "Now available to respond to emergency alerts" : "No longer responding to emergency alerts",
        metadata: { isVolunteer, radius },
      });

      res.json(user);
    } catch (error) {
      console.error("Error updating volunteer status:", error);
      res.status(500).json({ message: "Failed to update volunteer status" });
    }
  });

  app.post('/api/volunteer-response', isAuthenticated, async (req: any, res) => {
    try {
      const volunteerId = req.user.claims.sub;
      const responseData = insertVolunteerResponseSchema.parse({
        ...req.body,
        volunteerId,
      });

      const response = await storage.createVolunteerResponse(responseData);
      
      // Log activity
      await storage.createActivityLog({
        userId: volunteerId,
        actionType: "volunteer_response",
        title: "Emergency response accepted",
        description: "Accepted emergency alert response",
        metadata: { 
          alertId: response.alertId,
          status: response.status,
          estimatedArrival: response.estimatedArrival 
        },
      });

      res.json(response);
    } catch (error) {
      console.error("Error creating volunteer response:", error);
      res.status(500).json({ message: "Failed to create volunteer response" });
    }
  });

  // Incident reports routes
  app.get('/api/incident-reports', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const reports = await storage.getIncidentReports(userId);
      res.json(reports);
    } catch (error) {
      console.error("Error fetching incident reports:", error);
      res.status(500).json({ message: "Failed to fetch incident reports" });
    }
  });

  app.post('/api/incident-reports', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const reportData = insertIncidentReportSchema.parse({
        ...req.body,
        userId,
      });

      const report = await storage.createIncidentReport(reportData);
      
      // Log activity
      await storage.createActivityLog({
        userId,
        actionType: "incident_reported",
        title: "Incident reported",
        description: `Reported ${report.incidentType}: ${report.title}`,
        metadata: { 
          reportId: report.id,
          incidentType: report.incidentType,
          isPublic: report.isPublic 
        },
      });

      res.json(report);
    } catch (error) {
      console.error("Error creating incident report:", error);
      res.status(500).json({ message: "Failed to create incident report" });
    }
  });

  app.get('/api/public-incidents', async (req, res) => {
    try {
      const reports = await storage.getPublicIncidentReports();
      res.json(reports);
    } catch (error) {
      console.error("Error fetching public incident reports:", error);
      res.status(500).json({ message: "Failed to fetch public incident reports" });
    }
  });

  // User preferences routes
  app.put('/api/user/preferences', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const preferences = req.body;

      // Only allow updating certain preference fields
      const allowedFields = ['shakeToAlert', 'silentMode', 'autoRecord'];
      const filteredPreferences = Object.keys(preferences)
        .filter(key => allowedFields.includes(key))
        .reduce((obj: any, key) => {
          obj[key] = preferences[key];
          return obj;
        }, {});

      const user = await storage.updateUserPreferences(userId, filteredPreferences);
      res.json(user);
    } catch (error) {
      console.error("Error updating user preferences:", error);
      res.status(500).json({ message: "Failed to update user preferences" });
    }
  });

  // Activity logs routes
  app.get('/api/activity-logs', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = parseInt(req.query.limit as string) || 10;
      const logs = await storage.getUserActivityLogs(userId, limit);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching activity logs:", error);
      res.status(500).json({ message: "Failed to fetch activity logs" });
    }
  });

  // Location sharing route
  app.post('/api/share-location', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { latitude, longitude, address, contactIds } = req.body;

      // Get trusted contacts to share with
      const contacts = await storage.getTrustedContacts(userId);
      const selectedContacts = contactIds 
        ? contacts.filter((c: any) => contactIds.includes(c.id))
        : contacts;

      // Log activity
      await storage.createActivityLog({
        userId,
        actionType: "location_shared",
        title: "Location shared",
        description: `Shared location with ${selectedContacts.length} contact(s)`,
        metadata: { 
          latitude,
          longitude,
          address,
          contactNames: selectedContacts.map((c: any) => c.name)
        },
      });

      // In a real implementation, this would send location to contacts via SMS/email

      res.json({ 
        message: "Location shared successfully",
        sharedWith: selectedContacts.length 
      });
    } catch (error) {
      console.error("Error sharing location:", error);
      res.status(500).json({ message: "Failed to share location" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
