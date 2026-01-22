"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, limit, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { X, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import toast from "react-hot-toast";

interface RealTimeNotification {
  id: string;
  title: string;
  message: string;
  url?: string;
  createdAt: Timestamp;
  type?: "info" | "success" | "warning" | "error";
}

export default function RealTimeNotification() {
  const [notifications, setNotifications] = useState<RealTimeNotification[]>([]);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Check if Firebase is initialized
    if (!db || typeof window === "undefined") {
      return;
    }

    try {
      // Listen for new real-time notifications
      // Try with orderBy first, fallback to simple query if index not available
      let notificationsQuery;
      try {
        notificationsQuery = query(
          collection(db, "realTimeNotifications"),
          orderBy("createdAt", "desc"),
          limit(5) // Only show the 5 most recent
        );
      } catch (queryError) {
        // If orderBy fails (index not created), use simple query
        console.warn("OrderBy query failed, using simple query:", queryError);
        notificationsQuery = query(
          collection(db, "realTimeNotifications"),
          limit(5)
        );
      }

      const unsubscribe = onSnapshot(
        notificationsQuery,
        (snapshot) => {
          const newNotifications: RealTimeNotification[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            newNotifications.push({
              id: doc.id,
              title: data.title,
              message: data.message,
              url: data.url,
              createdAt: data.createdAt,
              type: data.type || "info",
            });
          });

          // Sort by createdAt if we used simple query
          if (newNotifications.length > 0 && newNotifications[0].createdAt) {
            newNotifications.sort((a, b) => {
              const aTime = a.createdAt?.toMillis?.() || 0;
              const bTime = b.createdAt?.toMillis?.() || 0;
              return bTime - aTime; // Descending order
            });
          }

          // Only show notifications that haven't been dismissed
          setNotifications(
            newNotifications.filter((notif) => !dismissedIds.has(notif.id))
          );

          // Show toast for the most recent notification if it's new
          if (newNotifications.length > 0) {
            const latest = newNotifications[0];
            if (!dismissedIds.has(latest.id)) {
              toast(
                (t) => (
                  <div className="flex items-start gap-3">
                    <Bell className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{latest.title}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {latest.message}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        toast.dismiss(t.id);
                        setDismissedIds((prev) => new Set(prev).add(latest.id));
                      }}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ),
                {
                  duration: 10000,
                  position: "top-center",
                }
              );
            }
          }
        },
        (error) => {
          console.error("Error listening to real-time notifications:", error);
          // Don't show error to user, just log it
        }
      );

      return () => unsubscribe();
    } catch (error) {
      console.error("Error setting up real-time notifications listener:", error);
    }
  }, [dismissedIds]);

  const handleDismiss = (id: string) => {
    setDismissedIds((prev) => new Set(prev).add(id));
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const handleClick = (notification: RealTimeNotification) => {
    if (notification.url) {
      window.location.href = notification.url;
    }
  };

  // Don't render if no notifications
  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {notifications.map((notification) => (
        <Card
          key={notification.id}
          className="p-4 shadow-lg border-l-4 border-blue-500 bg-white dark:bg-gray-800 animate-in slide-in-from-right"
        >
          <div className="flex items-start gap-3">
            <Bell className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
                {notification.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {notification.message}
              </p>
              {notification.url && (
                <button
                  onClick={() => handleClick(notification)}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-2"
                >
                  View more →
                </button>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDismiss(notification.id)}
              className="h-6 w-6 p-0 flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

