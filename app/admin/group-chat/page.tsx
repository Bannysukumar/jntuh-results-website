"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  MessageCircle, 
  Users, 
  Trash2, 
  Ban, 
  Search, 
  X, 
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Flag
} from "lucide-react";
import toast from "react-hot-toast";
import Loading from "@/components/loading/loading";
import AdminSidebar from "@/components/admin/AdminSidebar";

interface ActiveUser {
  sessionId: string;
  username: string;
  deviceId?: string;
  lastSeen: number;
}

interface BannedUser {
  deviceId: string;
  reason: string;
  bannedAt: number;
  bannedBy: string;
}

interface Report {
  id: string;
  messageId: string;
  messageText: string;
  reportedUsername: string;
  reportedDeviceId: string;
  reporterDeviceId: string;
  reason: string;
  status: string;
  timestamp: number;
}

export default function GroupChatAdmin() {
  const { user, loading, isAdmin, adminChecked, logout } = useAuth();
  const router = useRouter();
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [bannedUsers, setBannedUsers] = useState<BannedUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [searchUsername, setSearchUsername] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [uniqueUsernames, setUniqueUsernames] = useState<string[]>([]);
  const [usernameToDeviceIds, setUsernameToDeviceIds] = useState<Record<string, string[]>>({});
  const [clearingChat, setClearingChat] = useState(false);
  const [banningUser, setBanningUser] = useState<string | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [reportStatusFilter, setReportStatusFilter] = useState<string>("pending");

  useEffect(() => {
    if (!loading && adminChecked) {
      if (!user) {
        router.replace("/admin/login");
      } else if (user && !isAdmin) {
        router.replace("/admin/login");
      }
    }
  }, [user, loading, isAdmin, adminChecked, router]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchActiveUsers();
      fetchBannedUsers();
      fetchReports();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isAdmin, reportStatusFilter]);

  const fetchActiveUsers = async () => {
    setLoadingUsers(true);
    try {
      const idToken = await user?.getIdToken();
      const response = await fetch("/api/admin/group-chat/active-users", {
        headers: {
          "Authorization": `Bearer ${idToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setActiveUsers(data.users || []);
      } else {
        toast.error("Failed to fetch active users");
      }
    } catch (error) {
      console.error("Error fetching active users:", error);
      toast.error("Error fetching active users");
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchBannedUsers = async () => {
    try {
      const idToken = await user?.getIdToken();
      const response = await fetch("/api/admin/group-chat/banned-users", {
        headers: {
          "Authorization": `Bearer ${idToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBannedUsers(data.users || []);
      }
    } catch (error) {
      console.error("Error fetching banned users:", error);
    }
  };

  const fetchReports = async () => {
    setLoadingReports(true);
    try {
      const idToken = await user?.getIdToken();
      const response = await fetch(`/api/admin/group-chat/reports?status=${reportStatusFilter}`, {
        headers: {
          "Authorization": `Bearer ${idToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setReports(data.reports || []);
      } else {
        toast.error("Failed to fetch reports");
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Error fetching reports");
    } finally {
      setLoadingReports(false);
    }
  };

  const handleUpdateReportStatus = async (reportId: string, status: string) => {
    try {
      const idToken = await user?.getIdToken();
      const response = await fetch(`/api/admin/group-chat/reports/${reportId}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        toast.success(`Report marked as ${status}`);
        fetchReports();
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to update report");
      }
    } catch (error) {
      console.error("Error updating report:", error);
      toast.error("Error updating report");
    }
  };

  const handleClearChat = async () => {
    if (!confirm("Are you sure you want to clear all chat messages? This action cannot be undone.")) {
      return;
    }

    setClearingChat(true);
    try {
      const idToken = await user?.getIdToken();
      const response = await fetch("/api/admin/group-chat/clear-chat", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        toast.success("All chat messages have been cleared");
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to clear chat");
      }
    } catch (error) {
      console.error("Error clearing chat:", error);
      toast.error("Error clearing chat");
    } finally {
      setClearingChat(false);
    }
  };

  const handleSearchUsername = async () => {
    if (!searchUsername.trim()) {
      toast.error("Please enter a username to search");
      return;
    }

    try {
      const idToken = await user?.getIdToken();
      const response = await fetch(`/api/admin/group-chat/search-user?username=${encodeURIComponent(searchUsername.trim())}`, {
        headers: {
          "Authorization": `Bearer ${idToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.messages || []);
        setUniqueUsernames(data.uniqueUsernames || []);
        setUsernameToDeviceIds(data.usernameToDeviceIds || {});
        if (data.messages.length === 0) {
          toast.info("No messages found for this username");
        }
      } else {
        toast.error("Failed to search for user");
      }
    } catch (error) {
      console.error("Error searching user:", error);
      toast.error("Error searching for user");
    }
  };

  const handleBanUser = async (deviceId: string, username: string) => {
    const reason = prompt(`Enter ban reason for user "${username}":`);
    if (!reason || !reason.trim()) {
      return;
    }

    setBanningUser(deviceId);
    try {
      const idToken = await user?.getIdToken();
      const response = await fetch("/api/admin/group-chat/ban-user", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          deviceId,
          reason: reason.trim(),
        }),
      });

      if (response.ok) {
        toast.success(`User "${username}" has been banned`);
        fetchBannedUsers();
        // Remove from search results if present
        setSearchResults(searchResults.filter((m: any) => m.deviceId !== deviceId));
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to ban user");
      }
    } catch (error) {
      console.error("Error banning user:", error);
      toast.error("Error banning user");
    } finally {
      setBanningUser(null);
    }
  };

  const handleUnbanUser = async (deviceId: string) => {
    if (!confirm("Are you sure you want to unban this user?")) {
      return;
    }

    try {
      const idToken = await user?.getIdToken();
      const response = await fetch("/api/admin/group-chat/unban-user", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deviceId }),
      });

      if (response.ok) {
        toast.success("User has been unbanned");
        fetchBannedUsers();
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to unban user");
      }
    } catch (error) {
      console.error("Error unbanning user:", error);
      toast.error("Error unbanning user");
    }
  };

  if (loading || !adminChecked) {
    return <Loading />;
  }

  if (!user || !isAdmin) {
    return null;
  }

  // Group messages by username
  const usernameToMessages = new Map<string, any[]>();
  searchResults.forEach((msg: any) => {
    if (!usernameToMessages.has(msg.username)) {
      usernameToMessages.set(msg.username, []);
    }
    usernameToMessages.get(msg.username)!.push(msg);
  });

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
                  Group Chat Management
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Manage active users, clear chat, and ban abusive users
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Active Users */}
          <Card className="p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Active Users ({activeUsers.length})
                </h2>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchActiveUsers}
                disabled={loadingUsers}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loadingUsers ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
            {loadingUsers ? (
              <div className="text-center py-8 text-gray-500">Loading active users...</div>
            ) : activeUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No active users</div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {activeUsers.map((user) => (
                  <div
                    key={user.sessionId}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white flex items-center gap-2 mb-1">
                        {user.username}
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Online</span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 space-y-2">
                        <div>Session: {user.sessionId.substring(0, 25)}...</div>
                        {user.deviceId && user.deviceId !== "unknown" ? (
                          <div className="flex items-center gap-2 flex-wrap">
                            <code className="text-xs bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded font-mono">
                              Device: {user.deviceId}
                            </code>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                navigator.clipboard.writeText(user.deviceId || "");
                                toast.success("Device ID copied to clipboard!");
                              }}
                              className="h-6 text-xs px-2"
                            >
                              Copy ID
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleBanUser(user.deviceId || "", user.username)}
                              disabled={banningUser !== null || !user.deviceId || user.deviceId === "unknown"}
                              className="h-6 text-xs px-2"
                            >
                              <Ban className="h-3 w-3 mr-1" />
                              Ban
                            </Button>
                          </div>
                        ) : (
                          <div className="text-xs text-yellow-600 dark:text-yellow-400 italic">
                            Device ID not available (user needs to send a message or refresh)
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Clear Chat */}
          <Card className="p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Trash2 className="h-6 w-6 text-red-500" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Clear Chat
              </h2>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              This will permanently delete all messages from the group chat. This action cannot be undone.
            </p>
            <Button
              variant="destructive"
              onClick={handleClearChat}
              disabled={clearingChat}
            >
              {clearingChat ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Clearing...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All Messages
                </>
              )}
            </Button>
          </Card>

          {/* Ban Users by Username */}
          <Card className="p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Ban className="h-6 w-6 text-red-500" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Ban User by Username
              </h2>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Search for a username and ban their device(s). This will prevent them from accessing the chat.
            </p>
            <div className="flex gap-2 mb-4">
              <Input
                type="text"
                placeholder="Enter username to search..."
                value={searchUsername}
                onChange={(e) => setSearchUsername(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSearchUsername();
                  }
                }}
                className="flex-1"
              />
              <Button onClick={handleSearchUsername}>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Found {usernameToMessages.size} unique user(s) with {searchResults.length} message(s)
                </h3>
                <p className="text-sm text-blue-600 dark:text-blue-400 mb-4 bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                  <strong>Tip:</strong> Device IDs are now automatically tracked! 
                  <br />
                  • Device IDs are automatically shown if found in messages, active users, or user mappings
                  <br />
                  • If device ID is shown, click &quot;Ban&quot; button next to it for quick ban
                  <br />
                  • If no device ID is shown, check &quot;Active Users&quot; list above or enter device ID manually
                </p>
                {Array.from(usernameToMessages.entries()).map(([username, messages]) => (
                  <div
                    key={username}
                    className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white flex items-center gap-2 mb-2">
                          {username}
                          {activeUsers.some(u => u.username === username) && (
                            <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-1 rounded">
                              Currently Online
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                          {messages.length} message(s) found
                        </div>
                        {/* Show device IDs if found */}
                        {usernameToDeviceIds[username] && usernameToDeviceIds[username].length > 0 && (
                          <div className="mb-2">
                            <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                              Device ID(s) found ({usernameToDeviceIds[username].length}):
                            </div>
                            <div className="space-y-1">
                              {usernameToDeviceIds[username].map((deviceId) => (
                                <div key={deviceId} className="flex items-center gap-2">
                                  <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-mono">
                                    {deviceId}
                                  </code>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleBanUser(deviceId, username)}
                                    disabled={banningUser !== null}
                                    className="h-6 text-xs"
                                  >
                                    <Ban className="h-3 w-3 mr-1" />
                                    Ban
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          placeholder={usernameToDeviceIds[username]?.length > 0 ? "Or enter device ID..." : "Enter device ID..."}
                          className="w-64 text-sm"
                          id={`deviceId-${username}`}
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            const input = document.getElementById(`deviceId-${username}`) as HTMLInputElement;
                            const deviceId = input?.value?.trim();
                            if (!deviceId) {
                              toast.error("Please enter a device ID");
                              return;
                            }
                            handleBanUser(deviceId, username);
                            input.value = "";
                          }}
                          disabled={banningUser !== null}
                        >
                          <Ban className="h-4 w-4 mr-2" />
                          Ban User
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {messages.slice(0, 5).map((msg: any) => (
                        <div
                          key={msg.id}
                          className="p-2 bg-white dark:bg-gray-800 rounded text-xs text-gray-600 dark:text-gray-400"
                        >
                          {msg.text}
                        </div>
                      ))}
                      {messages.length > 5 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          ... and {messages.length - 5} more message(s)
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Banned Users List */}
          <Card className="p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-yellow-500" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Banned Users ({bannedUsers.length})
              </h2>
            </div>
            {bannedUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No banned users</div>
            ) : (
              <div className="space-y-2">
                {bannedUsers.map((banned) => (
                  <div
                    key={banned.deviceId}
                    className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"
                  >
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white font-mono text-sm">
                        {banned.deviceId}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Reason: {banned.reason}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">
                        Banned: {new Date(banned.bannedAt).toLocaleString()}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUnbanUser(banned.deviceId)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Unban
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Reported Messages */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Flag className="h-6 w-6 text-red-500" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Reported Messages ({reports.length})
                </h2>
              </div>
              <div className="flex gap-2">
                <select
                  value={reportStatusFilter}
                  onChange={(e) => setReportStatusFilter(e.target.value)}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="resolved">Resolved</option>
                  <option value="all">All</option>
                </select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchReports}
                  disabled={loadingReports}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loadingReports ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>
            </div>
            {loadingReports ? (
              <div className="text-center py-8 text-gray-500">Loading reports...</div>
            ) : reports.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No {reportStatusFilter === "all" ? "" : reportStatusFilter} reports found
              </div>
            ) : (
              <div className="space-y-3">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className={`p-4 rounded-lg border ${
                      report.status === "pending"
                        ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
                        : report.status === "resolved"
                        ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                        : "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-gray-900 dark:text-white">
                            Reported User: {report.reportedUsername}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              report.status === "pending"
                                ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
                                : report.status === "resolved"
                                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {report.status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2 bg-white dark:bg-gray-800 p-2 rounded">
                          <strong>Message:</strong> {report.messageText}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <strong>Reason:</strong> {report.reason}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                          <span>Reported: {new Date(report.timestamp).toLocaleString()}</span>
                          <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-mono">
                            Device: {report.reportedDeviceId.substring(0, 20)}...
                          </code>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      {report.status === "pending" && (
                        <>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              if (confirm(`Are you sure you want to ban ${report.reportedUsername}?`)) {
                                handleBanUser(report.reportedDeviceId, report.reportedUsername);
                                handleUpdateReportStatus(report.id, "resolved");
                              }
                            }}
                            disabled={banningUser !== null}
                          >
                            <Ban className="h-4 w-4 mr-2" />
                            Ban User
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateReportStatus(report.id, "reviewed")}
                          >
                            Mark as Reviewed
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateReportStatus(report.id, "dismissed")}
                          >
                            Dismiss
                          </Button>
                        </>
                      )}
                      {report.status === "reviewed" && (
                        <>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              if (confirm(`Are you sure you want to ban ${report.reportedUsername}?`)) {
                                handleBanUser(report.reportedDeviceId, report.reportedUsername);
                                handleUpdateReportStatus(report.id, "resolved");
                              }
                            }}
                            disabled={banningUser !== null}
                          >
                            <Ban className="h-4 w-4 mr-2" />
                            Ban User
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateReportStatus(report.id, "resolved")}
                          >
                            Mark as Resolved
                          </Button>
                        </>
                      )}
                      {(report.status === "resolved" || report.status === "dismissed") && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateReportStatus(report.id, "pending")}
                        >
                          Reopen Report
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </main>
      </div>
    </div>
  );
}

