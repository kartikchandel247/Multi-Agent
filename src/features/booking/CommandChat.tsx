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
  Terminal,
  Zap,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
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
        "💡 Multi-Agent System Online. You can type commands in natural language or click quick action prompts below.",
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
    { label: "Book a slot for tomorrow at 10:00 AM", intent: "book", icon: <Calendar className="w-3.5 h-3.5 text-blue-500" /> },
    { label: "Postpone my booking to Friday at 02:30 PM", intent: "postpone", icon: <RotateCcw className="w-3.5 h-3.5 text-indigo-500" /> },
    { label: "Cancel my booking", intent: "cancel", icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-500" /> },
    { label: "Show team availability and active slots", intent: "query", icon: <Clock className="w-3.5 h-3.5 text-emerald-500" /> },
  ];

  const handleSend = async (textToSend?: string) => {
    const commandText = (textToSend || input).trim();
    if (!commandText) return;

    setInput("");

    // 1. Add user message
    const userMsgId = "usr-" + Date.now();
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

      // Simulate multi-agent processing delay for realistic fluid feel
      setTimeout(() => {
        setIsTyping(false);

        const agentMsg: ChatMessage = {
          id: "agt-" + Date.now(),
          sender: "agent",
          agentName: parsed.agent,
          content: parsed.suggestedResponse,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          parsedCommand: parsed,
        };

        setMessages((prev) => [...prev, agentMsg]);
      }, 600);
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
      {/* Top Agent Status Banner */}
      <div className="p-3.5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/90 shadow-xs flex items-center justify-between flex-wrap gap-2 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-blue-600" />
          <span className="font-semibold text-slate-800">Autonomous Command Mesh</span>
          <span className="text-slate-400">&bull;</span>
          <span className="text-slate-500 hidden sm:inline">Natural Language Intent Parser with Mongoose DB Emulation</span>
        </div>
        <div className="flex items-center gap-2">
          <AgentBadge agent="Nova" showIcon={false} />
          <AgentBadge agent="Atlas" showIcon={false} />
          <AgentBadge agent="Vera" showIcon={false} />
        </div>
      </div>

      {/* Main Glass Chat Thread */}
      <GlassCard className="min-h-[460px] md:min-h-[520px] max-h-[620px] flex flex-col justify-between p-4 sm:p-6 shadow-sm border-white/90">
        {/* Messages Scroll Area */}
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
                    className="p-3 rounded-xl bg-blue-50/60 border border-blue-200/50 text-xs text-blue-900 text-center font-medium my-2"
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
                  <div className="flex items-center gap-2 mb-1">
                    {!isUser && msg.agentName && <AgentBadge agent={msg.agentName} />}
                    {isUser && <span className="text-xs font-semibold text-slate-600">You</span>}
                    <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                  </div>

                  <div
                    className={`max-w-[85%] sm:max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-2xs ${
                      isUser
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-xs"
                        : "bg-white/90 backdrop-blur-md border border-slate-200/80 text-slate-800 rounded-tl-xs"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>

                    {/* If this message contains parsed command data, visually render entity tokens */}
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
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
              </div>
              <span className="font-medium">Multi-Agents synthesizing command & schema...</span>
              <div className="flex gap-1 ml-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]" />
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Actionable Prompt Shortcuts */}
        <div className="pt-3 border-t border-slate-100 space-y-2.5">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <Zap className="w-3 h-3 text-amber-500" />
            Quick Actionable Prompts:
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {promptShortcuts.map((shortcut, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(shortcut.label)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-slate-600 hover:text-blue-700 text-xs font-medium border border-slate-200/80 transition-all shrink-0 cursor-pointer shadow-2xs"
              >
                {shortcut.icon}
                <span>{shortcut.label}</span>
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="relative flex items-center gap-2 pt-1">
            <div className="relative flex-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type command: e.g. 'Book a slot for Friday at 11am', 'Postpone to Monday', 'Cancel'..."
                className="w-full rounded-2xl bg-white/90 border border-slate-200/90 pl-4 pr-10 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 shadow-xs"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 hidden sm:inline">
                Enter
              </span>
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              icon={<Send className="w-4 h-4" />}
              className="rounded-2xl px-5 py-3 shadow-md shadow-blue-500/25"
            >
              <span className="hidden sm:inline">Send Command</span>
            </Button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
