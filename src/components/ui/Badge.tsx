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
      bg: "bg-emerald-500/10 text-emerald-800 border-emerald-400/40 shadow-2xs",
      dot: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]",
      label: "Confirmed",
    },
    PENDING: {
      bg: "bg-amber-500/10 text-amber-800 border-amber-400/40 shadow-2xs",
      dot: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]",
      label: "Pending Review",
    },
    CANCELLED: {
      bg: "bg-rose-500/10 text-rose-800 border-rose-400/40 shadow-2xs",
      dot: "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]",
      label: "Cancelled",
    },
    RESCHEDULED: {
      bg: "bg-indigo-500/10 text-indigo-800 border-indigo-400/40 shadow-2xs",
      dot: "bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]",
      label: "Rescheduled",
    },
  };

  const current = styles[status] || styles.CONFIRMED;

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md",
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
      bg: "bg-blue-500/10",
      text: "text-blue-800",
      border: "border-blue-400/40",
      icon: <Sparkles className="w-3.5 h-3.5 text-blue-600" />,
      role: "Front-Desk",
    },
    Atlas: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-800",
      border: "border-emerald-400/40",
      icon: <Cpu className="w-3.5 h-3.5 text-emerald-600" />,
      role: "Optimizer",
    },
    Vera: {
      bg: "bg-purple-500/10",
      text: "text-purple-800",
      border: "border-purple-400/40",
      icon: <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />,
      role: "Compliance",
    },
    Nexus: {
      bg: "bg-amber-500/10",
      text: "text-amber-800",
      border: "border-amber-400/40",
      icon: <Bot className="w-3.5 h-3.5 text-amber-600" />,
      role: "Analytics",
    },
  };

  const config = agentConfig[agent] || agentConfig.Nova;

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border backdrop-blur-md shadow-2xs",
        config.bg,
        config.text,
        config.border,
        className
      )}
    >
      {showIcon && config.icon}
      <span>Agent {agent}</span>
      <span className="opacity-60 text-[10px] font-medium hidden sm:inline">({config.role})</span>
    </span>
  );
}
