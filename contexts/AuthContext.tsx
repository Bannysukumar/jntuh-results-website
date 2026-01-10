"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import {
  User,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  adminChecked: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminChecked, setAdminChecked] = useState(false); // Track if we've completed admin check
  const router = useRouter();
  const checkingAdminRef = useRef(false);

  const checkAdminStatus = async (user: User | null, skipConcurrencyCheck: boolean = false) => {
    if (!user) {
      setIsAdmin(false);
      setAdminChecked(true);
      setLoading(false);
      checkingAdminRef.current = false;
      return;
    }

    // Prevent concurrent admin checks
    if (!skipConcurrencyCheck && checkingAdminRef.current) {
      return;
    }

    checkingAdminRef.current = true;

    try {
      // Get ID token - handle potential token errors
      let idToken: string;
      try {
        idToken = await user.getIdToken(true); // Force refresh to get latest claims
      } catch (tokenError: any) {
        console.error("Error getting ID token:", tokenError);
        setIsAdmin(false);
        setAdminChecked(true);
        setLoading(false);
        checkingAdminRef.current = false;
        return;
      }
      
      // Verify admin status via API
      const response = await fetch("/api/admin/check-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsAdmin(data.isAdmin || false);
        setAdminChecked(true); // Only mark as checked on success
      } else {
        // Handle different error statuses
        if (response.status === 401) {
          // Unauthorized - token invalid or expired
          console.warn("Admin check returned 401 - token may be invalid");
          setIsAdmin(false);
          setAdminChecked(true); // Still mark as checked to prevent infinite loops
        } else {
          // Other errors - retry might help
          console.error("Admin check failed with status:", response.status);
          setIsAdmin(false);
          setAdminChecked(true);
        }
      }
    } catch (error: any) {
      console.error("Error checking admin status:", error);
      setIsAdmin(false);
      // Only mark as checked if it's a network error or similar
      // Don't mark as checked if it's a token error that might be transient
      if (error.code && error.code.startsWith("auth/")) {
        // Auth errors - might be transient, but still mark as checked to prevent loops
        setAdminChecked(true);
      } else {
        // Network or other errors
        setAdminChecked(true);
      }
    } finally {
      setLoading(false);
      checkingAdminRef.current = false;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true); // Start with loading true
      setAdminChecked(false); // Reset checked flag when auth state changes
      setUser(user);
      if (user) {
        // Check admin status and wait for it to complete
        // This will set loading to false and adminChecked to true when done
        await checkAdminStatus(user);
      } else {
        setIsAdmin(false);
        setAdminChecked(true);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Wait for Firebase to process the login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Force token refresh multiple times to ensure we get the latest claims
      // Sometimes Firebase needs a moment to propagate custom claims
      let adminVerified = false;
      let attempts = 0;
      const maxAttempts = 3;
      
      while (!adminVerified && attempts < maxAttempts) {
        attempts++;
        
        // Force token refresh
        const idToken = await userCredential.user.getIdToken(true);
        
        // Wait a bit for token to propagate
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Check admin status (skip concurrency check during login)
        const response = await fetch("/api/admin/check-admin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idToken }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Admin check result:", data); // Debug log
          
          if (data.isAdmin) {
            setIsAdmin(true);
            setAdminChecked(true); // Mark as checked
            adminVerified = true;
            // Don't redirect here - let the login page's useEffect handle it after state updates
            // This prevents blinking caused by race conditions
            return; // Success - exit early
          }
        }
        
        // If not admin yet, wait and try again
        if (attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      // If we've exhausted all attempts and still not admin
      if (!adminVerified) {
        setAdminChecked(true);
        await signOut(auth);
        throw new Error("Access denied. Admin privileges required. Please contact an administrator.");
      }
    } catch (error: any) {
      setIsAdmin(false);
      // Don't sign out if it's already an auth error (wrong password, etc.)
      if (error.code && error.code.startsWith("auth/")) {
        throw error;
      }
      throw new Error(error.message || "Failed to login");
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setIsAdmin(false);
      setAdminChecked(false);
      // Don't redirect here - onAuthStateChanged will handle it
    } catch (error: any) {
      throw new Error(error.message || "Failed to logout");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, adminChecked, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

