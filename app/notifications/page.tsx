"use client";
import { fetchNotifications, fetchLatestNotifications } from "@/components/api/fetchResults";
import NotificationForm from "@/components/notifications/notificationForm";
import NotificationResults from "@/components/notifications/notificationResults";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Bell, FileText } from "lucide-react";
import React, { useEffect, useState, useCallback } from "react";

const Notification = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [latestResults, setLatestResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [latestLoading, setLatestLoading] = useState(false);
  const [params, setParams] = useState<Params>({
    title: "",
    year: "",
    degree: "",
    regulation: "",
    page: 1,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const notifications: Result[] | null = await fetchNotifications(params);
      if (!notifications || !Array.isArray(notifications)) {
        if (params.page == 1) {
          setResults([]);
        }
        setLoading(false);
        return;
      }
      if (params.page == 1) {
        setResults(notifications);
      } else {
        setResults((prev) => [...prev, ...notifications]);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      if (params.page == 1) {
        setResults([]);
      }
    }
    setLoading(false);
  }, [params]);

  const fetchLatestData = useCallback(async () => {
    setLatestLoading(true);
    try {
      const notifications: Result[] | null = await fetchLatestNotifications();
      if (!notifications || !Array.isArray(notifications)) {
        setLatestResults([]);
        setLatestLoading(false);
        return;
      }
      setLatestResults(notifications);
    } catch (error) {
      console.error("Error fetching latest notifications:", error);
      setLatestResults([]);
    }
    setLatestLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchLatestData();
  }, [fetchLatestData]);

  const incrementPage = () => {
    if (!loading) {
      setParams((prev) => ({
        ...prev,
        page: prev.page + 1,
      }));
    }
  };

  const handleChangeParams = (
    param: string,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setParams((prev) => ({
      ...prev,
      [param]: event.target.value,
      page: 1,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <Bell className="h-8 w-8" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
              JNTUH Notifications
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
            Stay updated with the latest result notifications and announcements from JNTUH
          </p>
        </div>

        {/* Tabs */}
        <Card className="p-6 shadow-xl border-2">
          <Tabs defaultValue="resultnotifications" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="resultnotifications" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Result Updates
              </TabsTrigger>
              <TabsTrigger value="examnotifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                General Updates
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="resultnotifications" className="mt-6">
              <NotificationForm handleChangeParams={handleChangeParams} />
              <NotificationResults
                results={results}
                incrementPage={incrementPage}
                loading={loading}
              />
            </TabsContent>
            
            <TabsContent value="examnotifications" className="mt-6">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Latest General Updates
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Stay updated with the most recent announcements and notifications from JNTUH
                </p>
              </div>
              <NotificationResults
                results={latestResults}
                incrementPage={() => {}}
                loading={latestLoading}
              />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Notification;
