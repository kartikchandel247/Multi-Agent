"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Sparkles,
  Calendar,
  Clock,
  AlertTriangle,
  RotateCcw,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AgentBadge } from "@/components/ui/Badge";
import { CommandVisualizer } from "./CommandVisualizer";
import { useAgentBooking } from "@/context/AgentContext";
import { ChatMessage } from "@/types";

export function CommandChat() {
  const { runCommand } = useAgentBooking();

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m-1",
      sender: "agent",
      agentName: "Nova",
      content:
        "Greetings! I am Agent Nova, your Front-Desk AI Coordinator. Alongside Agent Atlas (Calendar Optimization) and Agent Vera (Policy & Compliance), we orchestrate your business appointments autonomously.",
      timestamp: "Just now",
    },
    {
      id: "m-2",
      sender: "system",
      content:
        "⚡ Multi-Agent System Online. You can type commands in natural language or click quick action prompts below.",
      timestamp: "Just now",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const promptShortcuts = [
    { label: "Book a slot for tomorrow at 10:00 AM", icon: <Calendar className="w-3.5 h-3.5 text-blue-500" /> },
    { label: "Postpone my booking to Friday at 02:30 PM", icon: <RotateCcw className="w-3.5 h-3.5 text-indigo-500" /> },
    { label: "Cancel my booking", icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-500" /> },
    { label: "Show team availability and active slots", icon: <Clock className="w-3.5 h-3.5 text-emerald-500" /> },
  ];

  const handleSend = async (textToSend?: string) => {
    const commandText = (textToSend || input).trim();
    if (!commandText) return;

    setInput("");

    // 1. Add user message
    const userMsgId = "usr-" + Math.random().toString(36).substring(2, 9);
    const newUserMsg: ChatMessage = {
      id: userMsgId,
      sender: "user",
      content: commandText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setIsTyping(true);

    try {
      // 2. Run command via context orchestrator
      const { parsed } = await runCommand(commandText);

      setTimeout(() => {
        setIsTyping(false);

        const agentMsg: ChatMessage = {
          id: "agt-" + Math.random().toString(36).substring(2, 9),
          sender: "agent",
          agentName: parsed.agent,
          content: parsed.suggestedResponse,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          parsedCommand: parsed,
        };

        setMessages((prev) => [...prev, agentMsg]);
      }, 500);
    } catch (err) {
      setIsTyping(false);
      console.error(err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Top Floating Glass Status Banner */}
      <div className="p-3.5 px-5 rounded-3xl bg-white/40 backdrop-blur-2xl border border-white/70 shadow-[0_10px_30px_-10px_rgba(31,38,135,0.06)] flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
          <span className="font-bold text-slate-800 tracking-tight">Autonomous Neural Command Mesh</span>
          <span className="text-slate-300">&bull;</span>
          <span className="text-slate-500 hidden sm:inline font-medium">Multi-Agent Intent Extractor & Reactive Calendar</span>
        </div>
        <div className="flex items-center gap-2">
          <AgentBadge agent="Nova" showIcon={false} />
          <AgentBadge agent="Atlas" showIcon={false} />
          <AgentBadge agent="Vera" showIcon={false} />
        </div>
      </div>

      {/* Main Frosted Glass Terminal Card */}
      <div className="rounded-3xl bg-white/45 backdrop-blur-2xl border border-white/70 shadow-[0_20px_50px_-15px_rgba(31,38,135,0.08),0_0_0_1px_rgba(255,255,255,0.85)_inset] min-h-[480px] md:min-h-[540px] max-h-[620px] flex flex-col justify-between p-5 sm:p-7 relative overflow-hidden">
        {/* Top glossy glare line */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-90" />

        {/* Messages Thread */}
        <div className="overflow-y-auto space-y-4 pr-1 sm:pr-2 flex-1 pb-4">
          <AnimatePresence initial={false}>
            {messages.map((msg) => {
              const isUser = msg.sender === "user";
              const isSystem = msg.sender === "system";

              if (isSystem) {
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 px-4 rounded-2xl bg-white/40 backdrop-blur-md border border-white/70 text-xs text-indigo-900 text-center font-semibold my-2 shadow-2xs"
                  >
                    {msg.content}
                  </motion.div>
                );
              }

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.25 }}
                  className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                >
                  <div className="flex items-center gap-2 mb-1.5 px-1">
                    {!isUser && msg.agentName && <AgentBadge agent={msg.agentName} />}
                    {isUser && <span className="text-xs font-bold text-slate-700">You</span>}
                    <span className="text-[10px] text-slate-400 font-medium">{msg.timestamp}</span>
                  </div>

                  <div
                    className={`max-w-[85%] sm:max-w-[78%] rounded-3xl px-5 py-3.5 text-sm leading-relaxed ${
                      isUser
                        ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white rounded-tr-xs shadow-[0_10px_25px_-5px_rgba(79,70,229,0.35),0_0_0_1px_rgba(255,255,255,0.3)_inset]"
                        : "bg-white/70 backdrop-blur-xl border border-white/85 text-slate-800 rounded-tl-xs shadow-[0_8px_20px_rgba(0,0,0,0.03),0_0_0_1px_rgba(255,255,255,0.9)_inset]"
                    }`}
                  >
                    <p className="whitespace-pre-wrap font-medium">{msg.content}</p>

                    {/* Parsed visual entity badges */}
                    {msg.parsedCommand && (
                      <CommandVisualizer
                        parsed={msg.parsedCommand}
                        onConfirmAction={() => {
                          runCommand(msg.content);
                        }}
                      />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-xs text-slate-500 p-2"
            >
              <div className="w-6 h-6 rounded-full bg-blue-500/10 backdrop-blur-md border border-blue-400/30 flex items-center justify-center text-blue-600">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
              </div>
              <span className="font-semibold text-slate-600">Multi-Agents synthesizing response...</span>
              <div className="flex gap-1 ml-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-bounce [animation-delay:0.4s]" />
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Actionable Prompt Shortcuts & Translucent Glass Input */}
        <div className="pt-3 border-t border-white/60 space-y-3">
          <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
            <Zap className="w-3 h-3 text-amber-500" />
            Quick Actionable Prompts:
          </div>

          {/* Translucent Glass Pill Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {promptShortcuts.map((shortcut, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(shortcut.label)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white/40 hover:bg-white/80 backdrop-blur-xl text-slate-700 hover:text-indigo-900 text-xs font-semibold border border-white/75 hover:border-indigo-300/60 shadow-2xs hover:shadow-md transition-all shrink-0 cursor-pointer"
              >
                {shortcut.icon}
                <span>{shortcut.label}</span>
              </button>
            ))}
          </div>

          {/* Glass Input Bar */}
          <div className="relative flex items-center gap-2 pt-1">
            <div className="relative flex-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type command: 'Book a slot for Friday at 11am', 'Postpone to Monday', 'Cancel'..."
                className="w-full rounded-2xl bg-white/50 backdrop-blur-xl border border-white/80 pl-5 pr-14 py-3.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white/85 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/15 shadow-[0_4px_16px_rgba(0,0,0,0.02)_inset] transition-all"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-slate-400 bg-white/70 px-2 py-0.5 rounded-lg border border-white/80 hidden sm:inline">
                Enter
              </span>
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              icon={<Send className="w-4 h-4" />}
              className="rounded-2xl px-6 py-3.5 shadow-[0_10px_25px_-4px_rgba(79,70,229,0.45)] font-bold shrink-0"
            >
              <span className="hidden sm:inline">Send Command</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
