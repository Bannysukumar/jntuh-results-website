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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Users, 
  Search, 
  Filter,
  MoreVertical,
  UserPlus,
  Download,
  RefreshCw,
  Mail,
  User,
  Shield,
  Edit,
  Trash2,
  Key,
  Ban,
  CheckCircle,
  XCircle,
  AlertTriangle
} from "lucide-react";
import toast from "react-hot-toast";
import Loading from "@/components/loading/loading";
import AdminSidebar from "@/components/admin/AdminSidebar";

interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
  status: "active" | "inactive" | "suspended";
  lastLogin?: string;
  createdAt: string;
}

export default function AdminUsers() {
  const { user: currentUser, loading: authLoading, isAdmin, adminChecked } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
    status: "active" as "active" | "inactive" | "suspended",
  });
  const [editUser, setEditUser] = useState({
    name: "",
    email: "",
    role: "admin",
    status: "active" as "active" | "inactive" | "suspended",
  });
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    // Only redirect after loading is complete AND admin check is complete
    if (!authLoading && adminChecked) {
      if (!currentUser || (currentUser && !isAdmin)) {
        router.replace("/admin/login");
      }
    }
  }, [currentUser, authLoading, isAdmin, adminChecked, router]);

  // Fetch users from Firebase
  useEffect(() => {
    const fetchUsers = async () => {
      if (currentUser && isAdmin && adminChecked) {
        setLoading(true);
        try {
          const response = await fetch("/api/admin/users");
          const data = await response.json();
          
          if (data.success && data.users) {
            setUsers(data.users);
          } else {
            setUsers([]);
            if (data.error) {
              console.error("Error fetching users:", data.error);
            }
          }
        } catch (error: any) {
          console.error("Error fetching users:", error);
          toast.error("Failed to fetch users");
          setUsers([]);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUsers();
  }, [currentUser, isAdmin, adminChecked]);

  const filteredUsers = users.filter((u) =>
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>;
      case "inactive":
        return <Badge className="bg-gray-500 hover:bg-gray-600">Inactive</Badge>;
      case "suspended":
        return <Badge className="bg-red-500 hover:bg-red-600">Suspended</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch("/api/admin/users");
      const data = await response.json();
      
      if (data.success && data.users) {
        setUsers(data.users);
        toast.success("Users list refreshed!");
      } else {
        toast.error(data.error || "Failed to refresh users");
      }
    } catch (error: any) {
      console.error("Error refreshing users:", error);
      toast.error("Failed to refresh users");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExport = () => {
    if (users.length === 0) {
      toast.error("No users to export");
      return;
    }

    // Create CSV data
    const csvData = [
      ["Name", "Email", "Role", "Status", "Last Login", "Created"],
      ...users.map(user => [
        user.name || "N/A",
        user.email,
        user.role,
        user.status,
        user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Never",
        new Date(user.createdAt).toLocaleDateString(),
      ])
    ].map(row => row.join(",")).join("\n");

    // Create blob and download
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    toast.success("Users data exported successfully!");
  };

  const handleAddUser = async () => {
    // Validation
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (newUser.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/admin/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newUser.name,
          email: newUser.email,
          password: newUser.password,
          role: newUser.role,
          status: newUser.status,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Add user to local state
        const addedUser: User = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          role: data.user.role,
          status: data.user.status,
          createdAt: data.user.createdAt,
        };

        setUsers([addedUser, ...users]);
        toast.success("User created successfully!");
        
        // Reset form
        setNewUser({
          name: "",
          email: "",
          password: "",
          role: "admin",
          status: "active",
        });
        setIsAddUserOpen(false);
      } else {
        throw new Error(data.error || "Failed to create user");
      }
    } catch (error: any) {
      console.error("Error creating user:", error);
      toast.error(error.message || "Failed to add user. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditUser({
      name: user.name || "",
      email: user.email,
      role: user.role,
      status: user.status,
    });
    setIsEditUserOpen(true);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    if (!editUser.name || !editUser.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editUser.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/admin/update-user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: selectedUser.id,
          name: editUser.name,
          email: editUser.email,
          role: editUser.role,
          status: editUser.status,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Update user in local state
        setUsers(users.map(u => 
          u.id === selectedUser.id 
            ? { ...u, ...editUser }
            : u
        ));
        toast.success("User updated successfully!");
        setIsEditUserOpen(false);
        setSelectedUser(null);
      } else {
        throw new Error(data.error || "Failed to update user");
      }
    } catch (error: any) {
      console.error("Error updating user:", error);
      toast.error(error.message || "Failed to update user. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = (user: User) => {
    // Prevent users from deleting themselves
    if (user.id === currentUser?.uid) {
      toast.error("You cannot delete your own account");
      return;
    }

    setSelectedUser(user);
    setIsDeleteUserOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;

    // Double check - prevent users from deleting themselves
    if (selectedUser.id === currentUser?.uid) {
      toast.error("You cannot delete your own account");
      setIsDeleteUserOpen(false);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/admin/delete-user?uid=${selectedUser.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Remove user from local state
        setUsers(users.filter(u => u.id !== selectedUser.id));
        toast.success("User deleted successfully!");
        setIsDeleteUserOpen(false);
        setSelectedUser(null);
      } else {
        throw new Error(data.error || "Failed to delete user");
      }
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast.error(error.message || "Failed to delete user. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangeStatus = async (user: User, newStatus: "active" | "inactive" | "suspended") => {
    // Prevent users from changing their own status
    if (user.id === currentUser?.uid) {
      toast.error("You cannot change your own status");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/admin/update-user-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: user.id,
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Update user status in local state
        setUsers(users.map(u => 
          u.id === user.id 
            ? { ...u, status: newStatus }
            : u
        ));
        toast.success(`User status updated to ${newStatus}`);
      } else {
        throw new Error(data.error || "Failed to update user status");
      }
    } catch (error: any) {
      console.error("Error updating user status:", error);
      toast.error(error.message || "Failed to update user status. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = (user: User) => {
    setSelectedUser(user);
    setNewPassword("");
    setIsResetPasswordOpen(true);
  };

  const handleConfirmResetPassword = async () => {
    if (!selectedUser) return;

    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: selectedUser.id,
          newPassword: newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Password reset successfully!");
        setIsResetPasswordOpen(false);
        setSelectedUser(null);
        setNewPassword("");
      } else {
        throw new Error(data.error || "Failed to reset password");
      }
    } catch (error: any) {
      console.error("Error resetting password:", error);
      toast.error(error.message || "Failed to reset password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading while checking auth status or admin status
  if (authLoading || loading || !adminChecked) {
    return <Loading />;
  }

  // Don't render if not admin (redirect will happen)
  if (!currentUser || !isAdmin) {
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
                  <Users className="h-6 w-6" />
                  User Management
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Manage users and their access to the admin panel
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleExport}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Button size="sm" onClick={() => setIsAddUserOpen(true)}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and Filters */}
          <Card className="p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search users by email or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button 
                variant="outline"
                onClick={() => {
                  setIsFilterOpen(!isFilterOpen);
                  if (!isFilterOpen) {
                    toast("Filter options coming soon!");
                  }
                }}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button 
                variant="outline"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </Button>
            </div>
          </Card>

          {/* Users Table */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Last Login
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">
                          No users found
                        </p>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                          {searchQuery ? "Try adjusting your search" : "Users will appear here once they register"}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {user.name || "N/A"}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {user.email}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="outline">{user.role}</Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(user.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {user.lastLogin 
                            ? new Date(user.lastLogin).toLocaleDateString()
                            : "Never"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleResetPassword(user)}>
                                <Key className="mr-2 h-4 w-4" />
                                Reset Password
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                              <DropdownMenuItem 
                                onClick={() => handleChangeStatus(user, "active")}
                                disabled={user.status === "active"}
                              >
                                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                Set Active
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleChangeStatus(user, "inactive")}
                                disabled={user.status === "inactive" || user.id === currentUser?.uid}
                              >
                                <XCircle className="mr-2 h-4 w-4 text-gray-500" />
                                Set Inactive
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleChangeStatus(user, "suspended")}
                                disabled={user.status === "suspended" || user.id === currentUser?.uid}
                              >
                                <Ban className="mr-2 h-4 w-4 text-red-500" />
                                Suspend
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleDeleteUser(user)}
                                disabled={user.id === currentUser?.uid}
                                className="text-red-600 dark:text-red-400"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <Card className="p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {users.length}
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Users</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                {users.filter((u) => u.status === "active").length}
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Inactive Users</p>
              <p className="text-2xl font-bold text-gray-600 dark:text-gray-400 mt-1">
                {users.filter((u) => u.status === "inactive").length}
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Suspended</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                {users.filter((u) => u.status === "suspended").length}
              </p>
            </Card>
          </div>
        </main>
      </div>

      {/* Add User Dialog */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Add New User
            </DialogTitle>
            <DialogDescription>
              Create a new admin user account. The user will receive login credentials.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name
              </Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@example.com"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Minimum 6 characters"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Password must be at least 6 characters long
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Role
              </Label>
              <select
                id="role"
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                disabled={isSubmitting}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={newUser.status}
                onChange={(e) => setNewUser({ ...newUser, status: e.target.value as "active" | "inactive" | "suspended" })}
                disabled={isSubmitting}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddUserOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleAddUser} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create User
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Edit User
            </DialogTitle>
            <DialogDescription>
              Update user information and permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name
              </Label>
              <Input
                id="edit-name"
                placeholder="John Doe"
                value={editUser.name}
                onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="john.doe@example.com"
                value={editUser.email}
                onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Role
              </Label>
              <select
                id="edit-role"
                value={editUser.role}
                onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                disabled={isSubmitting}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <select
                id="edit-status"
                value={editUser.status}
                onChange={(e) => setEditUser({ ...editUser, status: e.target.value as "active" | "inactive" | "suspended" })}
                disabled={isSubmitting}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditUserOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateUser} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </>
              ) : (
                <>
                  <Edit className="mr-2 h-4 w-4" />
                  Update User
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Confirmation Dialog */}
      <Dialog open={isDeleteUserOpen} onOpenChange={setIsDeleteUserOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertTriangle className="h-5 w-5" />
              Delete User
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{selectedUser?.email}</strong>? This action cannot be undone. The user will be permanently removed from the system.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteUserOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete User
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={isResetPasswordOpen} onOpenChange={setIsResetPasswordOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Reset Password
            </DialogTitle>
            <DialogDescription>
              Set a new password for <strong>{selectedUser?.email}</strong>. The user will need to use this password to log in.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Minimum 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Password must be at least 6 characters long
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsResetPasswordOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmResetPassword} disabled={isSubmitting || !newPassword || newPassword.length < 6}>
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Resetting...
                </>
              ) : (
                <>
                  <Key className="mr-2 h-4 w-4" />
                  Reset Password
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

