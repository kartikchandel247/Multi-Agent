import React from "react";
import { clsx } from "clsx";
import { BookingStatus, AgentPersona } from "@/types";
import { Sparkles, Bot, ShieldCheck, Cpu } from "lucide-react";

interface StatusBadgeProps {
  status: BookingStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const styles: Record<BookingStatus, { bg: string; dot: string; label: string }> = {
    CONFIRMED: {
      bg: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
      dot: "bg-emerald-500",
      label: "Confirmed",
    },
    PENDING: {
      bg: "bg-amber-50 text-amber-700 border-amber-200/80",
      dot: "bg-amber-500",
      label: "Pending Review",
    },
    CANCELLED: {
      bg: "bg-rose-50 text-rose-700 border-rose-200/80",
      dot: "bg-rose-500",
      label: "Cancelled",
    },
    RESCHEDULED: {
      bg: "bg-indigo-50 text-indigo-700 border-indigo-200/80",
      dot: "bg-indigo-500",
      label: "Rescheduled",
    },
  };

  const current = styles[status] || styles.CONFIRMED;

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm",
        current.bg,
        className
      )}
    >
      <span className={clsx("w-1.5 h-1.5 rounded-full animate-pulse", current.dot)} />
      {current.label}
    </span>
  );
}

interface AgentBadgeProps {
  agent: AgentPersona;
  showIcon?: boolean;
  className?: string;
}

export function AgentBadge({ agent, showIcon = true, className }: AgentBadgeProps) {
  const agentConfig: Record<AgentPersona, { bg: string; text: string; border: string; icon: React.ReactNode; role: string }> = {
    Nova: {
      bg: "bg-blue-50/90",
      text: "text-blue-700",
      border: "border-blue-200",
      icon: <Sparkles className="w-3.5 h-3.5 text-blue-600" />,
      role: "Front-Desk AI",
    },
    Atlas: {
      bg: "bg-emerald-50/90",
      text: "text-emerald-700",
      border: "border-emerald-200",
      icon: <Cpu className="w-3.5 h-3.5 text-emerald-600" />,
      role: "Calendar Optimizer",
    },
    Vera: {
      bg: "bg-purple-50/90",
      text: "text-purple-700",
      border: "border-purple-200",
      icon: <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />,
      role: "Policy & Audit",
    },
    Nexus: {
      bg: "bg-amber-50/90",
      text: "text-amber-700",
      border: "border-amber-200",
      icon: <Bot className="w-3.5 h-3.5 text-amber-600" />,
      role: "Business Analytics",
    },
  };

  const config = agentConfig[agent] || agentConfig.Nova;

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border backdrop-blur-sm shadow-xs",
        config.bg,
        config.text,
        config.border,
        className
      )}
    >
      {showIcon && config.icon}
      <span className="font-semibold">Agent {agent}</span>
      <span className="opacity-60 text-[10px] hidden sm:inline">({config.role})</span>
    </span>
  );
}
