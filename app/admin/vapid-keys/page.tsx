"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key, Save, Loader2, Eye, EyeOff, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import Loading from "@/components/loading/loading";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminVapidKeys() {
  const { user, loading, isAdmin, adminChecked } = useAuth();
  const router = useRouter();
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [email, setEmail] = useState("mailto:admin@manajntuhresults.vercel.app");
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [source, setSource] = useState<"firestore" | "environment" | null>(null);

  useEffect(() => {
    if (!loading && adminChecked) {
      if (!user) {
        router.replace("/admin/login");
      } else if (user && !isAdmin) {
        router.replace("/admin/login");
      }
    }
  }, [user, loading, isAdmin, adminChecked, router]);

  const fetchKeys = async () => {
    if (!user || !isAdmin) return;

    setIsLoading(true);
    try {
      const idToken = await user.getIdToken();
      const response = await fetch("/api/admin/vapid-keys", {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPublicKey(data.publicKey || "");
        setPrivateKey(data.privateKey || "");
        setEmail(data.email || "mailto:admin@manajntuhresults.vercel.app");
        setSource(data.source || "firestore");
      } else {
        toast.error("Failed to load VAPID keys");
      }
    } catch (error: any) {
      console.error("Error fetching VAPID keys:", error);
      toast.error("Failed to load VAPID keys");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && isAdmin) {
      fetchKeys();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isAdmin]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!publicKey.trim() || !privateKey.trim()) {
      toast.error("Public key and private key are required");
      return;
    }

    if (email && !email.startsWith("mailto:")) {
      toast.error("Email must start with 'mailto:'");
      return;
    }

    setIsSaving(true);
    try {
      const idToken = await user?.getIdToken();
      if (!idToken) {
        toast.error("Authentication required");
        setIsSaving(false);
        return;
      }

      const response = await fetch("/api/admin/vapid-keys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          publicKey: publicKey.trim(),
          privateKey: privateKey.trim(),
          email: email.trim() || "mailto:admin@manajntuhresults.vercel.app",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("VAPID keys updated successfully!");
        setSource("firestore");
        fetchKeys(); // Refresh to show updated data
      } else {
        toast.error(data.error || "Failed to update VAPID keys");
      }
    } catch (error: any) {
      console.error("Error saving VAPID keys:", error);
      toast.error("Failed to update VAPID keys");
    } finally {
      setIsSaving(false);
    }
  };

  const generateNewKeys = async () => {
    if (!confirm("Generate new VAPID keys? This will invalidate existing subscriptions. Continue?")) {
      return;
    }

    try {
      // Call a server endpoint to generate keys, or use client-side generation
      // For simplicity, we'll show instructions
      toast("Generating new keys...", { icon: "ℹ️" });
      
      // In a real scenario, you might want to call an API endpoint
      // For now, we'll just show a message
      window.open("https://web-push-codelab.glitch.me/", "_blank");
      toast("Please generate new keys and paste them here", { duration: 5000 });
    } catch (error) {
      toast.error("Failed to generate keys");
    }
  };

  if (loading || !adminChecked) {
    return <Loading />;
  }

  if (!user || !isAdmin) {
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
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  VAPID Keys Management
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Manage push notification VAPID keys
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Info Card */}
          <Card className="p-6 mb-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  About VAPID Keys
                </h3>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• VAPID keys are used for web push notifications</li>
                  <li>• Public key is used by clients to subscribe to notifications</li>
                  <li>• Private key is kept secret and used to send notifications</li>
                  <li>• Keys stored here override environment variables</li>
                  {source === "environment" && (
                    <li className="flex items-center gap-2 mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <span>Currently using environment variables</span>
                    </li>
                  )}
                  {source === "firestore" && (
                    <li className="flex items-center gap-2 mt-2">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Using keys from database</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </Card>

          {/* VAPID Keys Form */}
          <Card className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : (
              <form onSubmit={handleSave} className="space-y-6">
                <div>
                  <Label htmlFor="publicKey" className="text-base font-medium">
                    Public Key *
                  </Label>
                  <Input
                    id="publicKey"
                    type="text"
                    value={publicKey}
                    onChange={(e) => setPublicKey(e.target.value)}
                    placeholder="Enter VAPID public key"
                    required
                    className="mt-2 font-mono text-sm"
                    disabled={isSaving}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    This key is used by clients to subscribe to push notifications
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="privateKey" className="text-base font-medium">
                      Private Key *
                    </Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPrivateKey(!showPrivateKey)}
                      className="h-8"
                    >
                      {showPrivateKey ? (
                        <>
                          <EyeOff className="h-4 w-4 mr-1" />
                          Hide
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-1" />
                          Show
                        </>
                      )}
                    </Button>
                  </div>
                  <Input
                    id="privateKey"
                    type={showPrivateKey ? "text" : "password"}
                    value={privateKey}
                    onChange={(e) => setPrivateKey(e.target.value)}
                    placeholder="Enter VAPID private key"
                    required
                    className="mt-2 font-mono text-sm"
                    disabled={isSaving}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Keep this key secret! It's used to send push notifications
                  </p>
                </div>

                <div>
                  <Label htmlFor="email" className="text-base font-medium">
                    Email (Optional)
                  </Label>
                  <Input
                    id="email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="mailto:admin@manajntuhresults.vercel.app"
                    className="mt-2"
                    disabled={isSaving}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Must start with &quot;mailto:&quot;
                  </p>
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={isSaving || !publicKey.trim() || !privateKey.trim()}
                    className="flex items-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save VAPID Keys
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={fetchKeys}
                    disabled={isSaving || isLoading}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generateNewKeys}
                    disabled={isSaving}
                  >
                    <Key className="h-4 w-4 mr-2" />
                    Generate New Keys
                  </Button>
                </div>
              </form>
            )}
          </Card>

          {/* Instructions Card */}
          <Card className="p-6 mt-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              How to Generate VAPID Keys
            </h3>
            <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-2 list-decimal list-inside">
              <li>Run this command in your terminal: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">npx web-push generate-vapid-keys</code></li>
              <li>Copy the Public Key and paste it in the Public Key field above</li>
              <li>Copy the Private Key and paste it in the Private Key field above</li>
              <li>Click &quot;Save VAPID Keys&quot; to store them</li>
            </ol>
          </Card>
        </main>
      </div>
    </div>
  );
}

