"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LogOut, User, Shield, BarChart3, Settings, FileText, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import Loading from "@/components/loading/loading";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminDashboard() {
  const { user, loading, isAdmin, adminChecked, logout } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0,
    resultsChecked: 0,
    loading: true,
  });

  useEffect(() => {
    // Only redirect after loading is complete AND admin check is complete
    if (!loading && adminChecked) {
      // If no user or user exists but is not admin, redirect to login
      if (!user) {
        router.replace("/admin/login");
      } else if (user && !isAdmin) {
        // Only redirect if we've checked and confirmed they're not admin
        router.replace("/admin/login");
      }
    }
  }, [user, loading, isAdmin, adminChecked, router]);

  const fetchStats = async () => {
    if (!user || !isAdmin) return;
    
    setStats(prev => ({ ...prev, loading: true }));
    try {
      // Fetch total users
      const usersResponse = await fetch("/api/admin/users");
      const usersData = await usersResponse.json();
      const totalUsers = usersData.success ? usersData.count || 0 : 0;

      // Fetch results checked (from analytics if available, otherwise 0)
      let resultsChecked = 0;
      try {
        // Get ID token for authorization
        const idToken = await user.getIdToken();
        const analyticsResponse = await fetch("/api/admin/analytics/stats", {
          headers: {
            "Authorization": `Bearer ${idToken}`,
          },
        });
        if (analyticsResponse.ok) {
          const analyticsData = await analyticsResponse.json();
          resultsChecked = analyticsData.resultsChecked || 0;
        }
      } catch (error) {
        // Analytics endpoint might not exist yet, that's okay
        console.log("Analytics endpoint not available yet");
      }

      setStats({
        totalUsers,
        resultsChecked,
        loading: false,
      });
    } catch (error: any) {
      console.error("Error fetching dashboard stats:", error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    if (user && isAdmin) {
      fetchStats();
    }
  }, [user, isAdmin]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to logout");
    }
  };

  // Show loading while checking auth status or admin status
  if (loading || !adminChecked) {
    return <Loading />;
  }

  // Don't render anything if not admin (redirect will happen)
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
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Mana JNTUH Results - Admin Panel
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <User className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Stats Cards */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Users
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                  {stats.loading ? (
                    <span className="text-gray-400">Loading...</span>
                  ) : (
                    stats.totalUsers.toLocaleString()
                  )}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Results Checked
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                  {stats.loading ? (
                    <span className="text-gray-400">Loading...</span>
                  ) : (
                    stats.resultsChecked.toLocaleString()
                  )}
                </p>
              </div>
              <Shield className="h-8 w-8 text-green-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  System Status
                </p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">
                  Active
                </p>
              </div>
              <Settings className="h-8 w-8 text-purple-500" />
            </div>
          </Card>
        </div>

        {/* Refresh Stats Button */}
        <div className="mt-6 flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchStats}
            disabled={stats.loading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${stats.loading ? "animate-spin" : ""}`} />
            Refresh Stats
          </Button>
        </div>

        {/* Admin Actions */}
        <div className="mt-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/admin/users">
                <Button variant="outline" className="w-full justify-start">
                  <User className="mr-2 h-4 w-4" />
                  Manage Users
                </Button>
              </Link>
              <Link href="/admin/analytics">
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Analytics
                </Button>
              </Link>
              <Link href="/admin/settings">
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="mr-2 h-4 w-4" />
                  System Settings
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => toast("Logs feature coming soon!")}
              >
                <FileText className="mr-2 h-4 w-4" />
                View Logs
              </Button>
            </div>
          </Card>
        </div>

        {/* User Info */}
        <div className="mt-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Account Information
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Email:</span>
                <span className="text-gray-900 dark:text-white">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">User ID:</span>
                <span className="text-gray-900 dark:text-white font-mono text-xs">
                  {user.uid.substring(0, 20)}...
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Last Login:</span>
                <span className="text-gray-900 dark:text-white">
                  {user.metadata.lastSignInTime
                    ? new Date(user.metadata.lastSignInTime).toLocaleString()
                    : "N/A"}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </main>
      </div>
    </div>
  );
}

