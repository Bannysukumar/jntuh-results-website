"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye, 
  MousePointerClick,
  Calendar,
  RefreshCw,
  Download
} from "lucide-react";
import toast from "react-hot-toast";
import Loading from "@/components/loading/loading";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminAnalytics() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/admin/login");
    }
  }, [user, authLoading, router]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // TODO: Fetch fresh analytics data
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Analytics data refreshed!");
    } catch (error: any) {
      toast.error("Failed to refresh analytics");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExport = () => {
    // Create CSV data
    const csvData = [
      ["Metric", "Value"],
      ["Total Visits", "0"],
      ["Unique Visitors", "0"],
      ["Page Views", "0"],
      ["Average Session Duration", "0m 0s"],
      ["Bounce Rate", "0%"],
    ].map(row => row.join(",")).join("\n");

    // Create blob and download
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    toast.success("Analytics data exported successfully!");
  };

  if (authLoading) {
    return <Loading />;
  }

  if (!user) {
    return null;
  }

  // Mock analytics data - replace with real data from your analytics service
  const analyticsData = {
    totalVisits: 0,
    uniqueVisitors: 0,
    pageViews: 0,
    averageSessionDuration: "0m 0s",
    bounceRate: "0%",
    topPages: [],
    trafficSources: [],
  };

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
                  <BarChart3 className="h-6 w-6" />
                  Analytics Dashboard
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Track website performance and user engagement
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleExport}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                  {isRefreshing ? "Refreshing..." : "Refresh"}
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Visits
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {analyticsData.totalVisits.toLocaleString()}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +0% from last month
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Eye className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Unique Visitors
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {analyticsData.uniqueVisitors.toLocaleString()}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +0% from last month
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Page Views
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {analyticsData.pageViews.toLocaleString()}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +0% from last month
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <MousePointerClick className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Avg. Session
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {analyticsData.averageSessionDuration}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Per session
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                  <Calendar className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Traffic Overview
              </h3>
              <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Chart will be displayed here</p>
                  <p className="text-sm mt-1">Integrate with Google Analytics or your analytics service</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Top Pages
              </h3>
              <div className="space-y-4">
                {analyticsData.topPages.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p>No data available</p>
                    <p className="text-sm mt-1">Page views will appear here</p>
                  </div>
                ) : (
                  analyticsData.topPages.map((page: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300">{page.path}</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{page.views}</span>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Additional Metrics */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Additional Metrics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Bounce Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {analyticsData.bounceRate}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">New vs Returning</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  N/A
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Device Breakdown</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  N/A
                </p>
              </div>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
}

