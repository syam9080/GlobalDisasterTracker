import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAlertSchema, insertSafetyGuideSchema, insertEmergencyContactSchema, insertUserSettingsSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Alert routes
  app.get("/api/alerts", async (req, res) => {
    try {
      const alerts = await storage.getAlerts();
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch alerts" });
    }
  });

  app.get("/api/alerts/active", async (req, res) => {
    try {
      const activeAlerts = await storage.getActiveAlerts();
      res.json(activeAlerts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch active alerts" });
    }
  });

  app.get("/api/alerts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const alert = await storage.getAlertById(id);
      if (!alert) {
        return res.status(404).json({ message: "Alert not found" });
      }
      res.json(alert);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch alert" });
    }
  });

  app.post("/api/alerts", async (req, res) => {
    try {
      const alertData = insertAlertSchema.parse(req.body);
      const alert = await storage.createAlert(alertData);
      res.status(201).json(alert);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid alert data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create alert" });
    }
  });

  app.patch("/api/alerts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = insertAlertSchema.partial().parse(req.body);
      const alert = await storage.updateAlert(id, updateData);
      if (!alert) {
        return res.status(404).json({ message: "Alert not found" });
      }
      res.json(alert);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid alert data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update alert" });
    }
  });

  app.delete("/api/alerts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteAlert(id);
      if (!deleted) {
        return res.status(404).json({ message: "Alert not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete alert" });
    }
  });

  // Safety Guide routes
  app.get("/api/safety-guides", async (req, res) => {
    try {
      const { category } = req.query;
      let guides;
      if (category && typeof category === 'string') {
        guides = await storage.getSafetyGuidesByCategory(category);
      } else {
        guides = await storage.getSafetyGuides();
      }
      res.json(guides);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch safety guides" });
    }
  });

  app.get("/api/safety-guides/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const guide = await storage.getSafetyGuideById(id);
      if (!guide) {
        return res.status(404).json({ message: "Safety guide not found" });
      }
      res.json(guide);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch safety guide" });
    }
  });

  app.post("/api/safety-guides", async (req, res) => {
    try {
      const guideData = insertSafetyGuideSchema.parse(req.body);
      const guide = await storage.createSafetyGuide(guideData);
      res.status(201).json(guide);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid safety guide data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create safety guide" });
    }
  });

  // Emergency Contact routes
  app.get("/api/emergency-contacts", async (req, res) => {
    try {
      const contacts = await storage.getEmergencyContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch emergency contacts" });
    }
  });

  app.get("/api/emergency-contacts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const contact = await storage.getEmergencyContactById(id);
      if (!contact) {
        return res.status(404).json({ message: "Emergency contact not found" });
      }
      res.json(contact);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch emergency contact" });
    }
  });

  app.post("/api/emergency-contacts", async (req, res) => {
    try {
      const contactData = insertEmergencyContactSchema.parse(req.body);
      const contact = await storage.createEmergencyContact(contactData);
      res.status(201).json(contact);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid contact data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create emergency contact" });
    }
  });

  app.patch("/api/emergency-contacts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = insertEmergencyContactSchema.partial().parse(req.body);
      const contact = await storage.updateEmergencyContact(id, updateData);
      if (!contact) {
        return res.status(404).json({ message: "Emergency contact not found" });
      }
      res.json(contact);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid contact data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update emergency contact" });
    }
  });

  app.delete("/api/emergency-contacts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteEmergencyContact(id);
      if (!deleted) {
        return res.status(404).json({ message: "Emergency contact not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete emergency contact" });
    }
  });

  // User Settings routes
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getUserSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user settings" });
    }
  });

  app.patch("/api/settings", async (req, res) => {
    try {
      const updateData = insertUserSettingsSchema.partial().parse(req.body);
      const settings = await storage.updateUserSettings(updateData);
      res.json(settings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid settings data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update settings" });
    }
  });

  // Emergency actions
  app.post("/api/emergency/check-in", async (req, res) => {
    try {
      // In a real implementation, this would send notifications to emergency contacts
      res.json({ message: "Check-in sent successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to send check-in" });
    }
  });

  app.post("/api/emergency/report", async (req, res) => {
    try {
      const { type, description, location, latitude, longitude } = req.body;
      // In a real implementation, this would create an incident report
      res.json({ message: "Incident reported successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to report incident" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
