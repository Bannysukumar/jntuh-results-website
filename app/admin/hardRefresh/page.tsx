"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  RefreshCw,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Database,
} from "lucide-react";
import toast from "react-hot-toast";
import Loading from "@/components/loading/loading";
import AdminSidebar from "@/components/admin/AdminSidebar";

interface RefreshResponse {
  success: boolean;
  message: string;
  deleted?: number;
  totalKeys?: number;
  error?: string;
}

export default function AdminHardRefresh() {
  const { user, loading: authLoading, isAdmin, adminChecked } = useAuth();
  const router = useRouter();
  const [htno, setHtno] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<RefreshResponse | null>(null);
  const [clearAllDialogOpen, setClearAllDialogOpen] = useState(false);

  useEffect(() => {
    // Only redirect after loading is complete AND admin check is complete
    if (!authLoading && adminChecked) {
      if (!user || (user && !isAdmin)) {
        router.replace("/admin/login");
      }
    }
  }, [user, authLoading, isAdmin, adminChecked, router]);

  const handleRefreshByHtno = async () => {
    if (!htno || htno.length !== 10) {
      toast.error("Please enter a valid 10-digit hall ticket number");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/hardRefresh?htno=${htno.toUpperCase()}`, {
        method: "GET",
      });

      const data: RefreshResponse = await response.json();

      if (data.success) {
        toast.success(data.message);
        setLastRefresh(data);
        setHtno(""); // Clear input after success
      } else {
        toast.error(data.message || "Failed to clear cache");
        setLastRefresh(data);
      }
    } catch (error: any) {
      console.error("Error refreshing cache:", error);
      toast.error("Failed to refresh cache");
      setLastRefresh({
        success: false,
        message: error.message || "Unknown error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = async () => {
    setLoading(true);
    setClearAllDialogOpen(false);
    
    try {
      const response = await fetch("/api/hardRefresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ clearAll: true }),
      });

      const data: RefreshResponse = await response.json();

      if (data.success) {
        toast.success(data.message);
        setLastRefresh(data);
      } else {
        toast.error(data.message || "Failed to clear all caches");
        setLastRefresh(data);
      }
    } catch (error: any) {
      console.error("Error clearing all caches:", error);
      toast.error("Failed to clear all caches");
      setLastRefresh({
        success: false,
        message: error.message || "Unknown error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking auth status or admin status
  if (authLoading || !adminChecked) {
    return <Loading />;
  }

  // Don't render if not admin (redirect will happen)
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
                  Hard Refresh Cache
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Clear Redis cache for specific hall ticket numbers or all results
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Warning Card */}
          <Card className="p-6 mb-6 border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-400 mb-2">
                  Warning
                </h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Clearing cache will force fresh data to be fetched from JNTUH servers
                  on the next request. This may increase server load and response times.
                </p>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Clear by Hall Ticket Number */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Database className="h-6 w-6 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Clear by Hall Ticket Number
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="htno" className="text-sm font-medium">
                    Hall Ticket Number
                  </Label>
                  <Input
                    id="htno"
                    type="text"
                    value={htno}
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase();
                      if (value.length <= 10) {
                        setHtno(value);
                      }
                    }}
                    placeholder="Enter 10-digit hall ticket number"
                    maxLength={10}
                    className="mt-2 font-mono"
                    disabled={loading}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {htno.length} / 10 characters
                  </p>
                </div>

                <Button
                  onClick={handleRefreshByHtno}
                  disabled={loading || htno.length !== 10}
                  className="w-full"
                  variant="default"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Clearing...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Clear Cache
                    </>
                  )}
                </Button>
              </div>
            </Card>

            {/* Clear All Caches */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <RefreshCw className="h-6 w-6 text-red-500" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Clear All Result Caches
                </h2>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  This will clear all cached result data from Redis. Notifications cache
                  will be preserved.
                </p>

                <AlertDialog open={clearAllDialogOpen} onOpenChange={setClearAllDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="w-full"
                      disabled={loading}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Clear All Caches
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action will clear all result caches from Redis. This cannot
                        be undone. The next requests will fetch fresh data from JNTUH
                        servers, which may increase server load.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleClearAll}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Yes, Clear All
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </Card>
          </div>

          {/* Last Refresh Result */}
          {lastRefresh && (
            <Card className="p-6 mt-6">
              <div className="flex items-center gap-3 mb-4">
                {lastRefresh.success ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                )}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Last Operation Result
                </h3>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant={lastRefresh.success ? "default" : "destructive"}>
                    {lastRefresh.success ? "Success" : "Failed"}
                  </Badge>
                  {lastRefresh.deleted !== undefined && (
                    <Badge variant="outline">
                      {lastRefresh.deleted} cache(s) cleared
                    </Badge>
                  )}
                  {lastRefresh.totalKeys !== undefined && (
                    <Badge variant="outline">
                      {lastRefresh.totalKeys} total keys found
                    </Badge>
                  )}
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {lastRefresh.message}
                </p>

                {lastRefresh.error && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    Error: {lastRefresh.error}
                  </p>
                )}
              </div>
            </Card>
          )}

          {/* Info Card */}
          <Card className="p-6 mt-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              How it works
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
              <li>
                Clearing cache by hall ticket number removes cached data for that specific
                student
              </li>
              <li>
                Clearing all caches removes all student result caches but preserves
                notifications
              </li>
              <li>
                After clearing, the next request for that data will fetch fresh data from
                JNTUH servers
              </li>
              <li>
                Cache is automatically rebuilt on the next successful result fetch
              </li>
            </ul>
          </Card>
        </main>
      </div>
    </div>
  );
}

