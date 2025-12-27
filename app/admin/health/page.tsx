"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  Clock,
  Server,
  Database,
  Activity
} from "lucide-react";
import toast from "react-hot-toast";
import Loading from "@/components/loading/loading";
import AdminSidebar from "@/components/admin/AdminSidebar";

interface HealthStatus {
  status: string;
  timestamp: string;
  uptime?: number;
  environment?: string;
  version?: string;
  services?: {
    api?: string;
    database?: string;
    redis?: string;
  };
  error?: string;
}

export default function AdminHealth() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [healthData, setHealthData] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/admin/login");
    }
  }, [user, authLoading, router]);

  const fetchHealth = async () => {
    try {
      const response = await fetch("/api/health", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
      }

      const data = await response.json();
      setHealthData(data);
      setLastChecked(new Date());
    } catch (error: any) {
      console.error("Error fetching health status:", error);
      setHealthData({
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error.message || "Failed to fetch health status",
      });
      toast.error("Failed to fetch health status");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchHealth();
      // Auto-refresh every 30 seconds
      const interval = setInterval(fetchHealth, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchHealth();
    toast.success("Health status refreshed!");
  };

  const formatUptime = (seconds?: number) => {
    if (!seconds) return "N/A";
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m ${secs}s`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
  };

  if (authLoading || loading) {
    return <Loading />;
  }

  if (!user) {
    return null;
  }

  const isHealthy = healthData?.status === "healthy";

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
                  System Health
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Monitor system status and service health
                </p>
              </div>
              <Button
                onClick={handleRefresh}
                disabled={isRefreshing}
                variant="outline"
              >
                <RefreshCw
                  className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Overall Status Card */}
          <Card className="p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-full ${
                    isHealthy
                      ? "bg-green-100 dark:bg-green-900/30"
                      : "bg-red-100 dark:bg-red-900/30"
                  }`}
                >
                  {isHealthy ? (
                    <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                  ) : (
                    <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    System Status
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {healthData?.timestamp
                      ? new Date(healthData.timestamp).toLocaleString()
                      : "N/A"}
                  </p>
                </div>
              </div>
              <Badge
                variant={isHealthy ? "default" : "destructive"}
                className="text-lg px-4 py-2"
              >
                {healthData?.status?.toUpperCase() || "UNKNOWN"}
              </Badge>
            </div>
          </Card>

          {/* Health Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {/* Uptime */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Uptime
                </h3>
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatUptime(healthData?.uptime)}
              </p>
            </Card>

            {/* Environment */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Environment
                </h3>
                <Server className="h-5 w-5 text-purple-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {healthData?.environment?.toUpperCase() || "N/A"}
              </p>
            </Card>

            {/* Version */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Version
                </h3>
                <Activity className="h-5 w-5 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {healthData?.version || "N/A"}
              </p>
            </Card>
          </div>

          {/* Services Status */}
          {healthData?.services && (
            <Card className="p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Service Status
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(healthData.services).map(([service, status]) => (
                  <div
                    key={service}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Database className="h-5 w-5 text-blue-500" />
                      <span className="font-medium text-gray-900 dark:text-white capitalize">
                        {service}
                      </span>
                    </div>
                    <Badge
                      variant={
                        status === "operational" ? "default" : "destructive"
                      }
                    >
                      {status}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Error Display */}
          {healthData?.error && (
            <Card className="p-6 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
              <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-red-900 dark:text-red-400 mb-2">
                    Error Details
                  </h3>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {healthData.error}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Last Checked */}
          {lastChecked && (
            <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
              Last checked: {lastChecked.toLocaleString()}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

