"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Bell, Send, Loader2, Users, CheckCircle2, XCircle, RefreshCw, History, Clock } from "lucide-react";
import toast from "react-hot-toast";
import Loading from "@/components/loading/loading";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminNotifications() {
  const { user, loading, isAdmin, adminChecked } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [url, setUrl] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [notificationHistory, setNotificationHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (!loading && adminChecked) {
      if (!user) {
        router.replace("/admin/login");
      } else if (user && !isAdmin) {
        router.replace("/admin/login");
      }
    }
  }, [user, loading, isAdmin, adminChecked, router]);

  const fetchHistory = async () => {
    if (!user || !isAdmin) return;

    setLoadingHistory(true);
    try {
      const idToken = await user.getIdToken();
      const response = await fetch("/api/admin/notifications/history", {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNotificationHistory(data.notifications || []);
      }
    } catch (error: any) {
      console.error("Error fetching notification history:", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (user && isAdmin) {
      fetchHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isAdmin]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !body.trim()) {
      toast.error("Please fill in title and message");
      return;
    }

    if (title.length > 100) {
      toast.error("Title must be 100 characters or less");
      return;
    }

    if (body.length > 500) {
      toast.error("Message must be 500 characters or less");
      return;
    }

    setIsSending(true);
    try {
      const idToken = await user?.getIdToken();
      if (!idToken) {
        toast.error("Authentication required");
        setIsSending(false);
        return;
      }

      const response = await fetch("/api/admin/notifications/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          body: body.trim(),
          url: url.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Notifications sent successfully!");
        setTitle("");
        setBody("");
        setUrl("");
        fetchHistory(); // Refresh history to show the new notification
      } else {
        toast.error(data.error || "Failed to send notifications");
      }
    } catch (error: any) {
      console.error("Error sending notifications:", error);
      toast.error("Failed to send notifications");
    } finally {
      setIsSending(false);
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
                  Send Notifications
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Send push notifications to all users
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Notification Form */}
          <Card className="p-6">
            <form onSubmit={handleSend} className="space-y-6">
              <div>
                <Label htmlFor="title" className="text-base font-medium">
                  Notification Title *
                </Label>
                <Input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter notification title (max 100 characters)"
                  maxLength={100}
                  required
                  className="mt-2"
                  disabled={isSending}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {title.length}/100 characters
                </p>
              </div>

              <div>
                <Label htmlFor="body" className="text-base font-medium">
                  Message *
                </Label>
                <Textarea
                  id="body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Enter notification message (max 500 characters)"
                  maxLength={500}
                  required
                  rows={5}
                  className="mt-2"
                  disabled={isSending}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {body.length}/500 characters
                </p>
              </div>

              <div>
                <Label htmlFor="url" className="text-base font-medium">
                  URL (Optional)
                </Label>
                <Input
                  id="url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://manajntuhresults.vercel.app/academicresult"
                  className="mt-2"
                  disabled={isSending}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Leave empty to use default URL
                </p>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={isSending || !title.trim() || !body.trim()}
                  className="flex items-center gap-2"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Notification
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setTitle("");
                    setBody("");
                    setUrl("");
                  }}
                  disabled={isSending}
                >
                  Clear
                </Button>
              </div>
            </form>
          </Card>

          {/* Notification History */}
          <Card className="p-6 mt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <History className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Notification History
                </h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchHistory}
                disabled={loadingHistory}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loadingHistory ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>

            {loadingHistory ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : notificationHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No notifications sent yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notificationHistory.map((notification) => (
                  <div
                    key={notification.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {notification.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {notification.body}
                        </p>
                        {notification.url && (
                          <p className="text-xs text-blue-600 dark:text-blue-400 mb-2">
                            URL: {notification.url}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>
                          {notification.sentAt
                            ? new Date(notification.sentAt).toLocaleString()
                            : "Unknown date"}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-green-600 dark:text-green-400">
                          ✓ {notification.successful || 0} successful
                        </span>
                        {notification.failed > 0 && (
                          <span className="text-red-600 dark:text-red-400">
                            ✗ {notification.failed} failed
                          </span>
                        )}
                        <span className="text-gray-600 dark:text-gray-400">
                          Total: {notification.totalSubscriptions || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Info Card */}
          <Card className="p-6 mt-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  About Push Notifications
                </h3>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Notifications will be sent to all users who have enabled push notifications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Users will receive notifications even if their browser is closed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Invalid subscriptions will be automatically removed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Make sure notifications are clear, concise, and valuable to users</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
}

