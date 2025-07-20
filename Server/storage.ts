import { 
  alerts, 
  safetyGuides, 
  emergencyContacts, 
  userSettings,
  type Alert, 
  type InsertAlert,
  type SafetyGuide,
  type InsertSafetyGuide,
  type EmergencyContact,
  type InsertEmergencyContact,
  type UserSettings,
  type InsertUserSettings
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gt, desc } from "drizzle-orm";

export interface IStorage {
  // Alerts
  getAlerts(): Promise<Alert[]>;
  getActiveAlerts(): Promise<Alert[]>;
  getAlertById(id: number): Promise<Alert | undefined>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  updateAlert(id: number, alert: Partial<InsertAlert>): Promise<Alert | undefined>;
  deleteAlert(id: number): Promise<boolean>;

  // Safety Guides
  getSafetyGuides(): Promise<SafetyGuide[]>;
  getSafetyGuideById(id: number): Promise<SafetyGuide | undefined>;
  getSafetyGuidesByCategory(category: string): Promise<SafetyGuide[]>;
  createSafetyGuide(guide: InsertSafetyGuide): Promise<SafetyGuide>;

  // Emergency Contacts
  getEmergencyContacts(): Promise<EmergencyContact[]>;
  getEmergencyContactById(id: number): Promise<EmergencyContact | undefined>;
  createEmergencyContact(contact: InsertEmergencyContact): Promise<EmergencyContact>;
  updateEmergencyContact(id: number, contact: Partial<InsertEmergencyContact>): Promise<EmergencyContact | undefined>;
  deleteEmergencyContact(id: number): Promise<boolean>;

  // User Settings
  getUserSettings(): Promise<UserSettings | undefined>;
  updateUserSettings(settings: Partial<InsertUserSettings>): Promise<UserSettings>;
}

export class DatabaseStorage implements IStorage {
  async initializeDefaultData() {
    // Check if data already exists
    const existingAlerts = await db.select().from(alerts).limit(1);
    if (existingAlerts.length > 0) return;

    // Insert default alerts
    await db.insert(alerts).values([
      {
        title: "Wildfire Evacuation Order",
        description: "Immediate evacuation required for zones A-C. Follow designated evacuation routes.",
        severity: "critical",
        type: "wildfire",
        location: "San Francisco Bay Area",
        latitude: "37.7749",
        longitude: "-122.4194",
        isActive: true,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        imageUrl: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        actionUrl: "/evacuation-routes"
      },
      {
        title: "Severe Wind Advisory",
        description: "Wind speeds up to 65 mph expected. Secure outdoor items and avoid travel.",
        severity: "warning",
        type: "storm",
        location: "San Francisco Bay Area",
        latitude: "37.7749",
        longitude: "-122.4194",
        isActive: true,
        expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000),
        imageUrl: "https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        actionUrl: "/safety-tips"
      },
      {
        title: "Flood Watch",
        description: "Heavy rainfall may cause flooding in low-lying areas. Monitor conditions.",
        severity: "watch",
        type: "flood",
        location: "San Francisco Bay Area",
        latitude: "37.7749",
        longitude: "-122.4194",
        isActive: true,
        expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000),
        imageUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        actionUrl: "/monitor"
      }
    ]);

    // Insert default safety guides
    await db.insert(safetyGuides).values([
      {
        title: "Emergency Kit Essentials",
        description: "72-hour supply checklist",
        category: "general",
        content: "Essential items for emergency preparedness including water, food, medications, flashlight, radio, batteries, first aid kit, and important documents.",
        imageUrl: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80",
        priority: 1
      },
      {
        title: "Earthquake Safety",
        description: "Drop, cover, and hold on",
        category: "earthquake",
        content: "During an earthquake: Drop to your hands and knees, take cover under a sturdy desk or table, and hold on until shaking stops.",
        imageUrl: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80",
        priority: 2
      },
      {
        title: "Evacuation Planning",
        description: "Routes and meeting points",
        category: "general",
        content: "Plan multiple evacuation routes from your home and workplace. Designate meeting points for family members.",
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80",
        priority: 3
      }
    ]);

    // Insert default emergency contacts
    await db.insert(emergencyContacts).values([
      {
        name: "Emergency Services",
        phone: "911",
        type: "emergency",
        description: "Fire, Police, Medical Emergency",
        isDefault: true
      },
      {
        name: "Poison Control",
        phone: "1-800-222-1222",
        type: "medical",
        description: "24/7 poison information and treatment advice",
        isDefault: true
      },
      {
        name: "Emergency Contact",
        phone: "(555) 123-4567",
        type: "personal",
        description: "Mom",
        isDefault: false
      }
    ]);

    // Insert default user settings
    await db.insert(userSettings).values({
      location: "San Francisco, CA",
      latitude: "37.7749",
      longitude: "-122.4194",
      notificationsEnabled: true,
      darkMode: false,
      emergencyContactId: 3
    });
  }



  // Alert methods
  async getAlerts(): Promise<Alert[]> {
    return await db.select().from(alerts).orderBy(desc(alerts.timestamp));
  }

  async getActiveAlerts(): Promise<Alert[]> {
    const now = new Date();
    const result = await db.select()
      .from(alerts)
      .where(
        eq(alerts.isActive, true)
      );

    // Filter out expired alerts and sort by severity
    const activeAlerts = result.filter(alert => !alert.expiresAt || alert.expiresAt > now);
    
    return activeAlerts.sort((a, b) => {
      const severityOrder = { critical: 0, warning: 1, watch: 2, info: 3 };
      return severityOrder[a.severity as keyof typeof severityOrder] - 
             severityOrder[b.severity as keyof typeof severityOrder];
    });
  }

  async getAlertById(id: number): Promise<Alert | undefined> {
    const result = await db.select().from(alerts).where(eq(alerts.id, id));
    return result[0];
  }

  async createAlert(insertAlert: InsertAlert): Promise<Alert> {
    const result = await db.insert(alerts).values(insertAlert).returning();
    return result[0];
  }

  async updateAlert(id: number, updateData: Partial<InsertAlert>): Promise<Alert | undefined> {
    const result = await db.update(alerts)
      .set(updateData)
      .where(eq(alerts.id, id))
      .returning();
    return result[0];
  }

  async deleteAlert(id: number): Promise<boolean> {
    const result = await db.delete(alerts).where(eq(alerts.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Safety Guide methods
  async getSafetyGuides(): Promise<SafetyGuide[]> {
    return await db.select().from(safetyGuides).orderBy(safetyGuides.priority);
  }

  async getSafetyGuideById(id: number): Promise<SafetyGuide | undefined> {
    const result = await db.select().from(safetyGuides).where(eq(safetyGuides.id, id));
    return result[0];
  }

  async getSafetyGuidesByCategory(category: string): Promise<SafetyGuide[]> {
    return await db.select()
      .from(safetyGuides)
      .where(eq(safetyGuides.category, category))
      .orderBy(safetyGuides.priority);
  }

  async createSafetyGuide(insertGuide: InsertSafetyGuide): Promise<SafetyGuide> {
    const result = await db.insert(safetyGuides).values(insertGuide).returning();
    return result[0];
  }

  // Emergency Contact methods
  async getEmergencyContacts(): Promise<EmergencyContact[]> {
    const result = await db.select().from(emergencyContacts);
    return result.sort((a, b) => {
      if (a.isDefault && !b.isDefault) return -1;
      if (!a.isDefault && b.isDefault) return 1;
      return a.name.localeCompare(b.name);
    });
  }

  async getEmergencyContactById(id: number): Promise<EmergencyContact | undefined> {
    const result = await db.select().from(emergencyContacts).where(eq(emergencyContacts.id, id));
    return result[0];
  }

  async createEmergencyContact(insertContact: InsertEmergencyContact): Promise<EmergencyContact> {
    const result = await db.insert(emergencyContacts).values(insertContact).returning();
    return result[0];
  }

  async updateEmergencyContact(id: number, updateData: Partial<InsertEmergencyContact>): Promise<EmergencyContact | undefined> {
    const result = await db.update(emergencyContacts)
      .set(updateData)
      .where(eq(emergencyContacts.id, id))
      .returning();
    return result[0];
  }

  async deleteEmergencyContact(id: number): Promise<boolean> {
    const result = await db.delete(emergencyContacts).where(eq(emergencyContacts.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // User Settings methods
  async getUserSettings(): Promise<UserSettings | undefined> {
    const result = await db.select().from(userSettings).limit(1);
    return result[0];
  }

  async updateUserSettings(updateData: Partial<InsertUserSettings>): Promise<UserSettings> {
    const existing = await this.getUserSettings();
    
    if (!existing) {
      const result = await db.insert(userSettings).values({
        location: null,
        latitude: null,
        longitude: null,
        notificationsEnabled: true,
        darkMode: false,
        emergencyContactId: null,
        ...updateData
      }).returning();
      return result[0];
    } else {
      const result = await db.update(userSettings)
        .set(updateData)
        .where(eq(userSettings.id, existing.id))
        .returning();
      return result[0];
    }
  }
}

const databaseStorage = new DatabaseStorage();

// Initialize default data on startup
databaseStorage.initializeDefaultData().catch(console.error);

export const storage = databaseStorage;
