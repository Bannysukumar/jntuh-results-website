"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, CheckCircle, Circle, XCircle, RefreshCw } from "lucide-react";
import { getFeedback, updateFeedbackStatus, Feedback } from "@/lib/feedback";
import toast from "react-hot-toast";
import Loading from "@/components/loading/loading";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminFeedback() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "new" | "read" | "resolved">("all");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/admin/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchFeedback();
    }
  }, [user]);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const data = await getFeedback();
      setFeedback(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to load feedback");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: "new" | "read" | "resolved") => {
    try {
      await updateFeedbackStatus(id, newStatus);
      setFeedback((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );
      toast.success("Status updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">
            <Circle className="h-3 w-3 mr-1" />
            New
          </Badge>
        );
      case "read":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            Read
          </Badge>
        );
      case "resolved":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            Resolved
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-500">
            <Circle className="h-3 w-3 mr-1" />
            {status}
          </Badge>
        );
    }
  };

  const filteredFeedback = filter === "all" 
    ? feedback 
    : feedback.filter((item) => item.status === filter);

  if (authLoading || loading) {
    return <Loading />;
  }

  if (!user) {
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
                <MessageSquare className="h-6 w-6" />
                User Feedback
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Manage user suggestions and feedback
              </p>
            </div>
            <Button variant="outline" onClick={fetchFeedback}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-6 flex gap-2 flex-wrap">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            size="sm"
          >
            All ({feedback.length})
          </Button>
          <Button
            variant={filter === "new" ? "default" : "outline"}
            onClick={() => setFilter("new")}
            size="sm"
          >
            New ({feedback.filter((f) => f.status === "new").length})
          </Button>
          <Button
            variant={filter === "read" ? "default" : "outline"}
            onClick={() => setFilter("read")}
            size="sm"
          >
            Read ({feedback.filter((f) => f.status === "read").length})
          </Button>
          <Button
            variant={filter === "resolved" ? "default" : "outline"}
            onClick={() => setFilter("resolved")}
            size="sm"
          >
            Resolved ({feedback.filter((f) => f.status === "resolved").length})
          </Button>
        </div>

        {/* Feedback List */}
        {filteredFeedback.length === 0 ? (
          <Card className="p-12 text-center">
            <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No feedback found
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredFeedback.map((item) => (
              <Card key={item.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {item.subject}
                      </h3>
                      {getStatusBadge(item.status || "new")}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <p>
                        <span className="font-medium">From:</span> {item.name} ({item.email})
                      </p>
                      <p>
                        <span className="font-medium">Submitted:</span>{" "}
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {item.message}
                  </p>
                </div>
                <div className="flex gap-2">
                  {item.status !== "read" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChange(item.id!, "read")}
                    >
                      Mark as Read
                    </Button>
                  )}
                  {item.status !== "resolved" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChange(item.id!, "resolved")}
                    >
                      Mark as Resolved
                    </Button>
                  )}
                  {item.status === "resolved" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChange(item.id!, "new")}
                    >
                      Reopen
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
      </div>
    </div>
  );
}

