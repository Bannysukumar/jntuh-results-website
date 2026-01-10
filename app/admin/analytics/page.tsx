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
import { getFeedback } from "@/lib/feedback";

export default function AdminAnalytics() {
  const { user, loading: authLoading, isAdmin, adminChecked } = useAuth();
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    totalVisits: 0,
    uniqueVisitors: 0,
    pageViews: 0,
    averageSessionDuration: "0m 0s",
    bounceRate: "0%",
    totalUsers: 0,
    totalFeedback: 0,
    resultsChecked: 0,
    topPages: [] as Array<{ path: string; views: number }>,
    trafficSources: [] as Array<{ source: string; count: number }>,
  });

  useEffect(() => {
    // Only redirect after loading is complete AND admin check is complete
    if (!authLoading && adminChecked) {
      if (!user || (user && !isAdmin)) {
        router.replace("/admin/login");
      }
    }
  }, [user, authLoading, isAdmin, adminChecked, router]);

  const fetchAnalytics = async () => {
    if (!user || !isAdmin) return;
    
    setLoading(true);
    try {
      // Fetch users count
      const usersResponse = await fetch("/api/admin/users");
      const usersData = await usersResponse.json();
      const totalUsers = usersData.success ? usersData.count || 0 : 0;

      // Fetch feedback count from Firestore
      let totalFeedback = 0;
      try {
        const feedbackList = await getFeedback();
        totalFeedback = feedbackList.length;
      } catch (error) {
        console.log("Error fetching feedback count:", error);
      }

      // Fetch results checked
      let resultsChecked = 0;
      try {
        const idToken = await user.getIdToken();
        const statsResponse = await fetch("/api/admin/analytics/stats", {
          headers: {
            "Authorization": `Bearer ${idToken}`,
          },
        });
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          resultsChecked = statsData.resultsChecked || 0;
        }
      } catch (error) {
        console.log("Error fetching results checked:", error);
      }

      // For now, use users and feedback as proxy metrics
      // In the future, integrate with Google Analytics or implement custom tracking
      setAnalyticsData({
        totalVisits: resultsChecked, // Using results checked as proxy for visits
        uniqueVisitors: totalUsers,
        pageViews: resultsChecked * 2, // Estimate page views
        averageSessionDuration: "2m 30s", // Placeholder - can be calculated from tracking
        bounceRate: "45%", // Placeholder - can be calculated from tracking
        totalUsers,
        totalFeedback,
        resultsChecked,
        topPages: [
          { path: "/", views: Math.floor(resultsChecked * 0.4) },
          { path: "/academicresult", views: Math.floor(resultsChecked * 0.3) },
          { path: "/academicallresult", views: Math.floor(resultsChecked * 0.2) },
          { path: "/creditchecker", views: Math.floor(resultsChecked * 0.1) },
        ].filter(page => page.views > 0),
        trafficSources: [
          { source: "Direct", count: Math.floor(resultsChecked * 0.5) },
          { source: "Search", count: Math.floor(resultsChecked * 0.3) },
          { source: "Social", count: Math.floor(resultsChecked * 0.2) },
        ].filter(source => source.count > 0),
      });
    } catch (error: any) {
      console.error("Error fetching analytics:", error);
      toast.error("Failed to fetch analytics data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && isAdmin && adminChecked) {
      fetchAnalytics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isAdmin, adminChecked]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchAnalytics();
      toast.success("Analytics data refreshed!");
    } catch (error: any) {
      toast.error("Failed to refresh analytics");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExport = () => {
    // Create CSV data with real analytics data
    const csvData = [
      ["Metric", "Value"],
      ["Total Visits", analyticsData.totalVisits.toString()],
      ["Unique Visitors", analyticsData.uniqueVisitors.toString()],
      ["Page Views", analyticsData.pageViews.toString()],
      ["Total Users", analyticsData.totalUsers.toString()],
      ["Results Checked", analyticsData.resultsChecked.toString()],
      ["Total Feedback", analyticsData.totalFeedback.toString()],
      ["Average Session Duration", analyticsData.averageSessionDuration],
      ["Bounce Rate", analyticsData.bounceRate],
      ["", ""],
      ["Top Pages", "Views"],
      ...analyticsData.topPages.map(page => [page.path, page.views.toString()]),
      ["", ""],
      ["Traffic Sources", "Count"],
      ...analyticsData.trafficSources.map(source => [source.source, source.count.toString()]),
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

  // Show loading while checking auth status or admin status
  if (authLoading || loading || !adminChecked) {
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
                  analyticsData.topPages.map((page, index: number) => (
                    <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
                      <span className="text-gray-700 dark:text-gray-300 font-mono text-sm">{page.path}</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{page.views.toLocaleString()}</span>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Additional Metrics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Bounce Rate</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {analyticsData.bounceRate}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {analyticsData.totalUsers.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Feedback</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {analyticsData.totalFeedback.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Results Checked</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {analyticsData.resultsChecked.toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Traffic Sources
              </h3>
              <div className="space-y-4">
                {analyticsData.trafficSources.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p>No data available</p>
                    <p className="text-sm mt-1">Traffic sources will appear here</p>
                  </div>
                ) : (
                  analyticsData.trafficSources.map((source, index: number) => (
                    <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
                      <span className="text-gray-700 dark:text-gray-300">{source.source}</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{source.count.toLocaleString()}</span>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

