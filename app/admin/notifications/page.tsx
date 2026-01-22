"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Bell, Send, Loader2, Users, CheckCircle2, XCircle, RefreshCw, Radio } from "lucide-react";
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
  const [realtimeTitle, setRealtimeTitle] = useState("");
  const [realtimeMessage, setRealtimeMessage] = useState("");
  const [realtimeUrl, setRealtimeUrl] = useState("");
  const [isSendingRealtime, setIsSendingRealtime] = useState(false);
  const [notificationType, setNotificationType] = useState<"push" | "realtime">("push");
  const [stats, setStats] = useState({
    totalSubscriptions: 0,
    loading: true,
  });

  useEffect(() => {
    if (!loading && adminChecked) {
      if (!user) {
        router.replace("/admin/login");
      } else if (user && !isAdmin) {
        router.replace("/admin/login");
      }
    }
  }, [user, loading, isAdmin, adminChecked, router]);

  const fetchStats = async () => {
    if (!user || !isAdmin) return;

    setStats(prev => ({ ...prev, loading: true }));
    try {
      const idToken = await user.getIdToken();
      const response = await fetch("/api/admin/notifications/stats", {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats({
          totalSubscriptions: data.totalSubscriptions || 0,
          loading: false,
        });
      } else {
        setStats(prev => ({ ...prev, loading: false }));
      }
    } catch (error: any) {
      console.error("Error fetching notification stats:", error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    if (user && isAdmin) {
      fetchStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isAdmin]);

  const handleSendRealtime = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!realtimeTitle.trim() || !realtimeMessage.trim()) {
      toast.error("Please fill in title and message");
      return;
    }

    if (realtimeTitle.length > 100) {
      toast.error("Title must be 100 characters or less");
      return;
    }

    if (realtimeMessage.length > 500) {
      toast.error("Message must be 500 characters or less");
      return;
    }

    setIsSendingRealtime(true);
    try {
      const idToken = await user?.getIdToken();
      if (!idToken) {
        toast.error("Authentication required");
        setIsSendingRealtime(false);
        return;
      }

      const response = await fetch("/api/admin/notifications/realtime", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          title: realtimeTitle.trim(),
          message: realtimeMessage.trim(),
          url: realtimeUrl.trim() || undefined,
          type: "info",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Real-time notification sent successfully!");
        setRealtimeTitle("");
        setRealtimeMessage("");
        setRealtimeUrl("");
      } else {
        toast.error(data.error || "Failed to send real-time notification");
      }
    } catch (error: any) {
      console.error("Error sending real-time notification:", error);
      toast.error("Failed to send real-time notification");
    } finally {
      setIsSendingRealtime(false);
    }
  };

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
          {/* Notification Type Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setNotificationType("push")}
              className={`px-4 py-2 font-medium text-sm transition-colors ${
                notificationType === "push"
                  ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              <Bell className="h-4 w-4 inline mr-2" />
              Push Notifications
            </button>
            <button
              onClick={() => setNotificationType("realtime")}
              className={`px-4 py-2 font-medium text-sm transition-colors ${
                notificationType === "realtime"
                  ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              <Radio className="h-4 w-4 inline mr-2" />
              Real-Time Notifications
            </button>
          </div>

          {/* Stats Card - Only show for push notifications */}
          {notificationType === "push" && (
          <Card className="p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Subscribers
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={fetchStats}
                    disabled={stats.loading}
                    className="h-8"
                  >
                    <RefreshCw className={`h-4 w-4 ${stats.loading ? "animate-spin" : ""}`} />
                  </Button>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                  {stats.loading ? (
                    <span className="text-gray-400">Loading...</span>
                  ) : (
                    stats.totalSubscriptions.toLocaleString()
                  )}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-500 ml-4" />
            </div>
          </Card>
          )}

          {/* Push Notification Form */}
          {notificationType === "push" && (
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
          )}

          {/* Real-Time Notification Form */}
          {notificationType === "realtime" && (
          <Card className="p-6">
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <Radio className="h-4 w-4 inline mr-2" />
                Real-time notifications appear instantly to all users currently browsing the website.
              </p>
            </div>
            <form onSubmit={handleSendRealtime} className="space-y-6">
              <div>
                <Label htmlFor="realtimeTitle" className="text-base font-medium">
                  Notification Title *
                </Label>
                <Input
                  id="realtimeTitle"
                  type="text"
                  value={realtimeTitle}
                  onChange={(e) => setRealtimeTitle(e.target.value)}
                  placeholder="Enter notification title (max 100 characters)"
                  maxLength={100}
                  required
                  className="mt-2"
                  disabled={isSendingRealtime}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {realtimeTitle.length}/100 characters
                </p>
              </div>

              <div>
                <Label htmlFor="realtimeMessage" className="text-base font-medium">
                  Message *
                </Label>
                <Textarea
                  id="realtimeMessage"
                  value={realtimeMessage}
                  onChange={(e) => setRealtimeMessage(e.target.value)}
                  placeholder="Enter notification message (max 500 characters)"
                  maxLength={500}
                  required
                  rows={5}
                  className="mt-2"
                  disabled={isSendingRealtime}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {realtimeMessage.length}/500 characters
                </p>
              </div>

              <div>
                <Label htmlFor="realtimeUrl" className="text-base font-medium">
                  URL (Optional)
                </Label>
                <Input
                  id="realtimeUrl"
                  type="url"
                  value={realtimeUrl}
                  onChange={(e) => setRealtimeUrl(e.target.value)}
                  placeholder="https://manajntuhresults.vercel.app/academicresult"
                  className="mt-2"
                  disabled={isSendingRealtime}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Leave empty if no action needed
                </p>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={isSendingRealtime || !realtimeTitle.trim() || !realtimeMessage.trim()}
                  className="flex items-center gap-2"
                >
                  {isSendingRealtime ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Radio className="h-4 w-4" />
                      Send Real-Time Notification
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setRealtimeTitle("");
                    setRealtimeMessage("");
                    setRealtimeUrl("");
                  }}
                  disabled={isSendingRealtime}
                >
                  Clear
                </Button>
              </div>
            </form>
          </Card>
          )}

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

