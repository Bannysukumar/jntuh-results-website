import { 
  doc, 
  getDoc, 
  setDoc, 
  Timestamp
} from "firebase/firestore";
import { db } from "./firebase";

export interface SiteSettings {
  siteName?: string;
  siteUrl?: string;
  emailNotifications?: boolean;
  maintenanceMode?: boolean;
  allowRegistrations?: boolean;
  maxFileSize?: string;
  sessionTimeout?: string;
  adminEmail?: string;
  adsEnabled?: boolean;
  adsPublisherId?: string;
  adsSlotId?: string;
  updatedAt?: Date;
}

const SETTINGS_DOC_ID = "site-settings";

export async function getSettings(): Promise<SiteSettings | null> {
  try {
    if (typeof window === "undefined") {
      return null;
    }

    const settingsRef = doc(db, "settings", SETTINGS_DOC_ID);
    const settingsSnap = await getDoc(settingsRef);
    
    if (settingsSnap.exists()) {
      const data = settingsSnap.data();
      return {
        ...data,
        updatedAt: data.updatedAt?.toDate(),
      } as SiteSettings;
    }
    
    return null;
  } catch (error: any) {
    console.error("Error fetching settings:", error);
    throw new Error(error.message || "Failed to fetch settings");
  }
}

export async function saveSettings(settings: SiteSettings): Promise<void> {
  try {
    if (typeof window === "undefined") {
      throw new Error("Cannot save settings on server side");
    }

    const settingsRef = doc(db, "settings", SETTINGS_DOC_ID);
    await setDoc(settingsRef, {
      ...settings,
      updatedAt: Timestamp.now(),
    }, { merge: true });
  } catch (error: any) {
    console.error("Error saving settings:", error);
    throw new Error(error.message || "Failed to save settings");
  }
}

export async function getAdsEnabled(): Promise<boolean> {
  try {
    const settings = await getSettings();
    // Default to true if settings don't exist or adsEnabled is not set
    return settings?.adsEnabled !== false;
  } catch (error: any) {
    console.error("Error checking ads enabled status:", error);
    // Default to true if there's an error
    return true;
  }
}

export async function getAdsConfig(): Promise<{
  enabled: boolean;
  publisherId: string;
  slotId: string;
}> {
  try {
    const settings = await getSettings();
    return {
      enabled: settings?.adsEnabled !== false,
      publisherId: settings?.adsPublisherId || "ca-pub-1589551808134823",
      slotId: settings?.adsSlotId || "1398487082",
    };
  } catch (error: any) {
    console.error("Error getting ads config:", error);
    // Return defaults if there's an error
    return {
      enabled: true,
      publisherId: "ca-pub-1589551808134823",
      slotId: "1398487082",
    };
  }
}

