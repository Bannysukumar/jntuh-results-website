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

    let unsubscribe: (() => void) | null = null;
    let retryCount = 0;
    const maxRetries = 3;

    const setupListener = () => {
      try {
        // Use simple query without orderBy to avoid index requirement
        // We'll sort in memory instead
        const notificationsQuery = query(
          collection(db, "realTimeNotifications"),
          limit(10) // Get more to sort, then take top 5
        );

        unsubscribe = onSnapshot(
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

            // Sort by createdAt in descending order (most recent first)
            newNotifications.sort((a, b) => {
              const aTime = a.createdAt?.toMillis?.() || a.createdAt?.seconds || 0;
              const bTime = b.createdAt?.toMillis?.() || b.createdAt?.seconds || 0;
              return bTime - aTime; // Descending order
            });

            // Take only the 5 most recent
            const top5 = newNotifications.slice(0, 5);

            // Only show notifications that haven't been dismissed
            setNotifications(
              top5.filter((notif) => !dismissedIds.has(notif.id))
            );

            // Show toast for the most recent notification if it's new
            if (top5.length > 0) {
              const latest = top5[0];
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
          (error: any) => {
            // Only log permission errors, don't spam console
            if (error?.code === "permission-denied" || error?.code === "missing-or-insufficient-permissions") {
              // Silently fail - rules might not be deployed yet
              console.warn("Real-time notifications: Permission denied. Please deploy Firestore rules.");
            } else {
              console.error("Error listening to real-time notifications:", error);
            }
            
            // Retry logic for non-permission errors
            if (error?.code !== "permission-denied" && error?.code !== "missing-or-insufficient-permissions" && retryCount < maxRetries) {
              retryCount++;
              setTimeout(() => {
                setupListener();
              }, 2000 * retryCount); // Exponential backoff
            }
          }
        );
      } catch (error) {
        console.error("Error setting up real-time notifications listener:", error);
      }
    };

    setupListener();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
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

