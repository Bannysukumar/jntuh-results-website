"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Settings, 
  Save,
  Bell,
  Shield,
  Globe,
  Database,
  Mail,
  Key,
  AlertTriangle,
  DollarSign
} from "lucide-react";
import toast from "react-hot-toast";
import Loading from "@/components/loading/loading";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { getSettings, saveSettings } from "@/lib/settings";
import { auth } from "@/lib/firebase";

export default function AdminSettings() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [savingMaintenanceMode, setSavingMaintenanceMode] = useState(false);
  const [savingRegistration, setSavingRegistration] = useState(false);
  const [savingEmailNotifications, setSavingEmailNotifications] = useState(false);
  const [savingAdsEnabled, setSavingAdsEnabled] = useState(false);
  const [showClearDataDialog, setShowClearDataDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [settings, setSettings] = useState({
    siteName: "Mana JNTUH Results",
    siteUrl: "https://manajntuhresults.vercel.app",
    emailNotifications: true,
    maintenanceMode: false,
    allowRegistrations: true,
    maxFileSize: "10",
    sessionTimeout: "30",
    adminEmail: "",
    adsEnabled: true,
    adsPublisherId: "ca-pub-1589551808134823",
    adsSlotId: "8618507332",
  });

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push("/admin/login");
    }
  }, [user, authLoading, isAdmin, router]);

  useEffect(() => {
    const loadSettings = async () => {
      if (user) {
        try {
          const loadedSettings = await getSettings();
          if (loadedSettings) {
            setSettings({
              siteName: loadedSettings.siteName || "Mana JNTUH Results",
              siteUrl: loadedSettings.siteUrl || "https://manajntuhresults.vercel.app",
              emailNotifications: loadedSettings.emailNotifications !== false,
              maintenanceMode: loadedSettings.maintenanceMode === true,
              allowRegistrations: loadedSettings.allowRegistrations !== false,
              maxFileSize: loadedSettings.maxFileSize || "10",
              sessionTimeout: loadedSettings.sessionTimeout || "30",
              adminEmail: loadedSettings.adminEmail || "",
              adsEnabled: loadedSettings.adsEnabled !== false,
              adsPublisherId: loadedSettings.adsPublisherId || "ca-pub-1589551808134823",
              adsSlotId: loadedSettings.adsSlotId || "8618507332",
            });
          }
        } catch (error: any) {
          console.error("Error loading settings:", error);
          toast.error("Failed to load settings");
        }
      }
    };
    loadSettings();
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      // Get ID token from current user
      const idToken = auth.currentUser ? await auth.currentUser.getIdToken() : undefined;
      await saveSettings(settings, idToken);
      toast.success("Settings saved successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  const handleClearData = async () => {
    setLoading(true);
    try {
      // Get ID token for authentication
      const idToken = auth.currentUser ? await auth.currentUser.getIdToken() : undefined;
      
      if (!idToken) {
        throw new Error("Authentication required");
      }

      // Call API to clear all data
      const response = await fetch("/api/admin/clear-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to clear data");
      }

      toast.success("All data cleared successfully!");
      setShowClearDataDialog(false);
    } catch (error: any) {
      console.error("Error clearing data:", error);
      toast.error(error.message || "Failed to clear data. This feature may not be fully implemented yet.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetSettings = async () => {
    setLoading(true);
    try {
      const defaultSettings = {
        siteName: "Mana JNTUH Results",
        siteUrl: "https://manajntuhresults.vercel.app",
        emailNotifications: true,
        maintenanceMode: false,
        allowRegistrations: true,
        maxFileSize: "10",
        sessionTimeout: "30",
        adminEmail: "",
        adsEnabled: true,
        adsPublisherId: "ca-pub-1589551808134823",
        adsSlotId: "8618507332",
      };
      
      // Update local state
      setSettings(defaultSettings);
      
      // Save to Firebase
      const idToken = auth.currentUser ? await auth.currentUser.getIdToken() : undefined;
      await saveSettings(defaultSettings, idToken);
      
      toast.success("Settings reset to default values and saved successfully!");
      setShowResetDialog(false);
    } catch (error: any) {
      console.error("Error resetting settings:", error);
      toast.error(error.message || "Failed to reset settings");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return <Loading />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <AdminSidebar />
      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Settings className="h-6 w-6" />
                  Settings
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Manage system settings and preferences
                </p>
              </div>
              <Button onClick={handleSave} disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {/* General Settings */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Globe className="h-5 w-5 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  General Settings
                </h2>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="siteUrl">Site URL</Label>
                  <Input
                    id="siteUrl"
                    value={settings.siteUrl}
                    onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="adminEmail">Admin Email</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    value={settings.adminEmail}
                    onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                    placeholder="admin@example.com"
                    className="mt-1"
                  />
                </div>
              </div>
            </Card>

            {/* Notification Settings */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Bell className="h-5 w-5 text-yellow-500" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Notification Settings
                </h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Receive email notifications for important events
                    </p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={settings.emailNotifications}
                    disabled={loading || savingEmailNotifications}
                    onCheckedChange={async (checked) => {
                      const updatedSettings = { ...settings, emailNotifications: checked };
                      setSettings(updatedSettings);
                      
                      // Auto-save email notifications setting immediately
                      setSavingEmailNotifications(true);
                      try {
                        const idToken = auth.currentUser ? await auth.currentUser.getIdToken() : undefined;
                        await saveSettings(updatedSettings, idToken);
                        toast.success(
                          `Email notifications ${checked ? "enabled" : "disabled"} successfully!`
                        );
                      } catch (error: any) {
                        console.error("Error saving email notifications setting:", error);
                        toast.error(error.message || "Failed to update email notifications setting");
                        // Revert on error
                        setSettings({ ...settings, emailNotifications: !checked });
                      } finally {
                        setSavingEmailNotifications(false);
                      }
                    }}
                  />
                </div>
              </div>
            </Card>

            {/* Security Settings */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="h-5 w-5 text-green-500" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Security Settings
                </h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Enable maintenance mode to restrict access
                    </p>
                  </div>
                  <Switch
                    id="maintenanceMode"
                    checked={settings.maintenanceMode}
                    disabled={loading || savingMaintenanceMode}
                    onCheckedChange={async (checked) => {
                      const updatedSettings = { ...settings, maintenanceMode: checked };
                      setSettings(updatedSettings);
                      
                      // Auto-save maintenance mode immediately
                      setSavingMaintenanceMode(true);
                      try {
                        // Get ID token from current user
                        const idToken = auth.currentUser ? await auth.currentUser.getIdToken() : undefined;
                        await saveSettings(updatedSettings, idToken);
                        toast.success(
                          `Maintenance mode ${checked ? "enabled" : "disabled"} successfully!`
                        );
                      } catch (error: any) {
                        console.error("Error saving maintenance mode:", error);
                        toast.error(error.message || "Failed to update maintenance mode");
                        // Revert on error
                        setSettings({ ...settings, maintenanceMode: !checked });
                      } finally {
                        setSavingMaintenanceMode(false);
                      }
                    }}
                  />
                  {savingMaintenanceMode && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Saving...
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="allowRegistrations">Allow User Registrations</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Allow new users to register for admin access
                    </p>
                  </div>
                  <Switch
                    id="allowRegistrations"
                    checked={settings.allowRegistrations}
                    disabled={loading || savingRegistration}
                    onCheckedChange={async (checked) => {
                      const updatedSettings = { ...settings, allowRegistrations: checked };
                      setSettings(updatedSettings);
                      
                      // Auto-save registration setting immediately
                      setSavingRegistration(true);
                      try {
                        // Get ID token from current user
                        const idToken = auth.currentUser ? await auth.currentUser.getIdToken() : undefined;
                        await saveSettings(updatedSettings, idToken);
                        toast.success(
                          `User registrations ${checked ? "enabled" : "disabled"} successfully!`
                        );
                      } catch (error: any) {
                        console.error("Error saving registration setting:", error);
                        toast.error(error.message || "Failed to update registration setting");
                        // Revert on error
                        setSettings({ ...settings, allowRegistrations: !checked });
                      } finally {
                        setSavingRegistration(false);
                      }
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => setSettings({ ...settings, sessionTimeout: e.target.value })}
                    className="mt-1"
                    min="5"
                    max="120"
                  />
                </div>
              </div>
            </Card>

            {/* System Settings */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Database className="h-5 w-5 text-purple-500" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  System Settings
                </h2>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
                  <Input
                    id="maxFileSize"
                    type="number"
                    value={settings.maxFileSize}
                    onChange={(e) => setSettings({ ...settings, maxFileSize: e.target.value })}
                    className="mt-1"
                    min="1"
                    max="100"
                  />
                </div>
              </div>
            </Card>

            {/* API Settings */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Key className="h-5 w-5 text-orange-500" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  API & Integration Settings
                </h2>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="googleAnalytics">Google Analytics ID</Label>
                  <Input
                    id="googleAnalytics"
                    value={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS || ""}
                    disabled
                    className="mt-1"
                    placeholder="G-XXXXXXXXXX"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Configured via environment variables
                  </p>
                </div>
              </div>
            </Card>

            {/* Ads Settings */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <DollarSign className="h-5 w-5 text-green-500" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Ads Settings
                </h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="adsEnabled">Enable Ads</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Show Google AdSense ads on your website
                    </p>
                  </div>
                  <Switch
                    id="adsEnabled"
                    checked={settings.adsEnabled}
                    disabled={loading || savingAdsEnabled}
                    onCheckedChange={async (checked) => {
                      const updatedSettings = { ...settings, adsEnabled: checked };
                      setSettings(updatedSettings);
                      
                      // Auto-save ads enabled setting immediately
                      setSavingAdsEnabled(true);
                      try {
                        const idToken = auth.currentUser ? await auth.currentUser.getIdToken() : undefined;
                        await saveSettings(updatedSettings, idToken);
                        toast.success(
                          `Ads ${checked ? "enabled" : "disabled"} successfully!`
                        );
                      } catch (error: any) {
                        console.error("Error saving ads enabled setting:", error);
                        toast.error(error.message || "Failed to update ads setting");
                        // Revert on error
                        setSettings({ ...settings, adsEnabled: !checked });
                      } finally {
                        setSavingAdsEnabled(false);
                      }
                    }}
                  />
                </div>
                {settings.adsEnabled && (
                  <>
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <p className="text-sm text-green-700 dark:text-green-300">
                        ✓ Ads are currently enabled. They will be displayed on your website.
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="adsPublisherId">AdSense Publisher ID</Label>
                      <Input
                        id="adsPublisherId"
                        value={settings.adsPublisherId}
                        onChange={(e) =>
                          setSettings({ ...settings, adsPublisherId: e.target.value })
                        }
                        placeholder="ca-pub-XXXXXXXXXXXXXXXXX"
                        className="mt-1"
                      />
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Your Google AdSense Publisher ID (starts with ca-pub-)
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="adsSlotId">AdSense Slot ID</Label>
                      <Input
                        id="adsSlotId"
                        value={settings.adsSlotId}
                        onChange={(e) =>
                          setSettings({ ...settings, adsSlotId: e.target.value })
                        }
                        placeholder="1234567890"
                        className="mt-1"
                      />
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Your Google AdSense Ad Slot ID
                      </p>
                    </div>
                  </>
                )}
                {!settings.adsEnabled && (
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Ads are currently disabled. They will not be displayed on your website.
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Danger Zone */}
            <Card className="p-6 border-red-200 dark:border-red-900">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="h-5 w-5 text-red-500" />
                <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">
                  Danger Zone
                </h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div>
                    <Label className="text-red-600 dark:text-red-400">Clear All Data</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Permanently delete all user data and feedback
                    </p>
                  </div>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => setShowClearDataDialog(true)}
                  >
                    Clear Data
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div>
                    <Label className="text-red-600 dark:text-red-400">Reset Settings</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Reset all settings to default values
                    </p>
                  </div>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => setShowResetDialog(true)}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>

      {/* Clear Data Confirmation Dialog */}
      <Dialog open={showClearDataDialog} onOpenChange={setShowClearDataDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertTriangle className="h-5 w-5" />
              Clear All Data
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete all user data and feedback from the system.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClearDataDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleClearData}>
              Yes, Clear All Data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Settings Confirmation Dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertTriangle className="h-5 w-5" />
              Reset Settings
            </DialogTitle>
            <DialogDescription>
              This will reset all settings to their default values. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResetDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleResetSettings}>
              Yes, Reset Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

