"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import confetti from "canvas-confetti";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarInitials: string;
  accountType?: "customer" | "organization";
  organization?: string;
  department?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    email: string,
    password?: string,
    accountType?: "customer" | "organization",
    organization?: string
  ) => Promise<{ success: boolean; error?: string }>;
  signup: (
    name: string,
    email: string,
    password?: string,
    accountType?: "customer" | "organization",
    organization?: string,
    role?: string
  ) => Promise<{ success: boolean; error?: string }>;
  ssoLogin: (companyDomain: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "aura_agent_user_session_v2";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Read stored user from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.email) {
          setUser(parsed);
        }
      }
    } catch {
      // LocalStorage access fallback
    } finally {
      setIsLoading(false);
    }
  }, []);

  const triggerAuthCelebration = () => {
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.65 },
        colors: ["#3B82F6", "#6366F1", "#8B5CF6", "#10B981"],
      });
    } catch {
      // Confetti fallback
    }
  };

  const login = async (
    email: string,
    _password?: string,
    accountType: "customer" | "organization" = "customer",
    organization: string = ""
  ) => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 500));

    if (!email || !email.includes("@")) {
      setIsLoading(false);
      return { success: false, error: "Please enter a valid email address." };
    }

    const namePart = email.split("@")[0].replace(/[._-]/g, " ");
    const formattedName =
      namePart
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ") || "Customer";

    const initials =
      formattedName
        .split(" ")
        .map((w) => w.charAt(0))
        .slice(0, 2)
        .join("")
        .toUpperCase() || "CU";

    const loggedInUser: AuthUser = {
      id: `usr_${Date.now()}`,
      name: formattedName,
      email: email.trim(),
      role: accountType === "customer" ? "Customer" : "Member",
      avatarInitials: initials,
      accountType,
      organization: accountType === "organization" ? organization : "Individual Customer",
      department: accountType === "organization" ? organization || "Company" : "Personal",
    };

    setUser(loggedInUser);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(loggedInUser));
    } catch {}

    setIsLoading(false);
    triggerAuthCelebration();
    return { success: true };
  };

  const signup = async (
    name: string,
    email: string,
    _password?: string,
    accountType: "customer" | "organization" = "customer",
    organization: string = "",
    role: string = ""
  ) => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 600));

    if (!name.trim()) {
      setIsLoading(false);
      return { success: false, error: "Please enter your name." };
    }

    if (!email || !email.includes("@")) {
      setIsLoading(false);
      return { success: false, error: "Please enter a valid email address." };
    }

    const initials =
      name
        .trim()
        .split(" ")
        .map((w) => w.charAt(0))
        .slice(0, 2)
        .join("")
        .toUpperCase() || "CU";

    const newUser: AuthUser = {
      id: `usr_${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      role: role || (accountType === "customer" ? "Customer" : "Team Member"),
      avatarInitials: initials,
      accountType,
      organization: accountType === "organization" ? organization : "Individual Customer",
      department: accountType === "organization" ? organization || "Organization" : "Personal",
    };

    setUser(newUser);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    } catch {}

    setIsLoading(false);
    triggerAuthCelebration();
    return { success: true };
  };

  const ssoLogin = async (companyDomain: string) => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 700));

    const domain = companyDomain.trim().toLowerCase().replace(/^https?:\/\//, "");
    if (!domain) {
      setIsLoading(false);
      return { success: false, error: "Please enter your company domain or SSO ID." };
    }

    const orgName = domain.split(".")[0].toUpperCase();
    const ssoUser: AuthUser = {
      id: `usr_sso_${Date.now()}`,
      name: `SSO User (${orgName})`,
      email: `user@${domain.includes(".") ? domain : `${domain}.com`}`,
      role: "Verified SSO",
      avatarInitials: orgName.slice(0, 2) || "SS",
      accountType: "organization",
      organization: orgName,
      department: "Corporate SSO",
    };

    setUser(ssoUser);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(ssoUser));
    } catch {}

    setIsLoading(false);
    triggerAuthCelebration();
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {}
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        ssoLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
