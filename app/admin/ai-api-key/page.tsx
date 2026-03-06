"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Loader2, RefreshCw, AlertCircle, CheckCircle2, Bot } from "lucide-react";
import toast from "react-hot-toast";
import Loading from "@/components/loading/loading";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminAIApiKey() {
  const { user, loading, isAdmin, adminChecked } = useAuth();
  const router = useRouter();
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<{
    apiKeySet: boolean;
    source: string;
    maskedKey: string | null;
    updatedAt: string | null;
  } | null>(null);

  useEffect(() => {
    if (!loading && adminChecked) {
      if (!user || !isAdmin) {
        router.replace("/admin/login");
      }
    }
  }, [user, loading, isAdmin, adminChecked, router]);

  const fetchStatus = async () => {
    if (!user || !isAdmin) return;
    setIsLoading(true);
    try {
      const idToken = await user.getIdToken();
      const res = await fetch("/api/admin/ai-api-key", {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setStatus({
          apiKeySet: data.apiKeySet ?? false,
          source: data.source ?? "none",
          maskedKey: data.maskedKey ?? null,
          updatedAt: data.updatedAt ?? null,
        });
      } else {
        toast.error("Failed to load AI API key status");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to load AI API key status");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && isAdmin) fetchStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isAdmin]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      toast.error("Please enter an API key");
      return;
    }
    if (!user) {
      toast.error("Authentication required");
      return;
    }
    setIsSaving(true);
    try {
      const idToken = await user.getIdToken();
      const res = await fetch("/api/admin/ai-api-key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ apiKey: apiKey.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("AI Assistant API key updated. It will be used immediately.");
        setApiKey("");
        fetchStatus();
      } else {
        toast.error(data.error || "Failed to update API key");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to update API key");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || !adminChecked) return <Loading />;
  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <AdminSidebar />
      <div className="flex-1 lg:ml-64">
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Bot className="h-7 w-7" />
              AI Assistant API Key
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Manage the Groq / AI API key used by the site assistant. Changes take effect immediately.
            </p>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="p-6 mb-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  About the AI Assistant key
                </h3>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• The key is used for the Groq AI API (AI chat on the site).</li>
                  <li>• Storing a key here overrides the server environment variable.</li>
                  <li>• After you save, the new key is used for all new chat requests right away.</li>
                  {status?.source === "environment" && (
                    <li className="flex items-center gap-2 mt-2">
                      <AlertCircle className="h-4 w-4" />
                      Currently using the key from environment variables.
                    </li>
                  )}
                  {status?.source === "firestore" && status?.apiKeySet && (
                    <li className="flex items-center gap-2 mt-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Using the key saved in the database.
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : (
              <>
                {status && (
                  <div className="mb-6 p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Status:</span>{" "}
                      {status.apiKeySet
                        ? <>Key is set {status.maskedKey && `(${status.maskedKey})`}</>
                        : "No API key configured. Set one below or use GEMINI_API_KEY in environment."}
                    </p>
                    {status.updatedAt && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Last updated: {new Date(status.updatedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}

                <form onSubmit={handleSave} className="space-y-6">
                  <div>
                    <Label htmlFor="apiKey" className="text-base font-medium">
                      Groq API Key
                    </Label>
                    <Input
                      id="apiKey"
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Enter your Groq API key (from console.groq.com/keys)"
                      className="mt-2 font-mono text-sm"
                      disabled={isSaving}
                      autoComplete="off"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Get a key from GroqCloud (`console.groq.com/keys`). Saving replaces any existing key.
                    </p>
                  </div>

                  <div className="flex items-center gap-4 pt-4">
                    <Button
                      type="submit"
                      disabled={isSaving || !apiKey.trim()}
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
                          Save API Key
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={fetchStatus}
                      disabled={isSaving || isLoading}
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                      Refresh status
                    </Button>
                  </div>
                </form>
              </>
            )}
          </Card>
        </main>
      </div>
    </div>
  );
}
