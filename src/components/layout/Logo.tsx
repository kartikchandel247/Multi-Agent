import React from "react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 shadow-md shadow-blue-500/25 p-1.5 shrink-0">
        {/* Futuristic Multi-Agent constellation geometric SVG */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-white"
        >
          {/* Central Core Agent */}
          <circle cx="12" cy="12" r="3" fill="currentColor" />
          {/* Orbital Agent 1 */}
          <circle cx="12" cy="4" r="1.8" fill="currentColor" opacity="0.9" />
          {/* Orbital Agent 2 */}
          <circle cx="19" cy="16" r="1.8" fill="currentColor" opacity="0.9" />
          {/* Orbital Agent 3 */}
          <circle cx="5" cy="16" r="1.8" fill="currentColor" opacity="0.9" />
          {/* Neural Connection Edges */}
          <path
            d="M12 4L12 9M12 15L19 16M12 15L5 16"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.6"
          />
        </svg>
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-white animate-pulse" />
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-950 via-slate-800 to-slate-900 bg-clip-text text-transparent">
            Aura<span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">Agent</span>
          </span>
          <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-blue-50 text-blue-600 border border-blue-200/60 uppercase tracking-widest">
            v2.4
          </span>
        </div>
        <span className="text-[11px] font-medium text-slate-400 -mt-0.5 tracking-tight">
          Multi-Agent Business Orchestrator
        </span>
      </div>
    </div>
  );
}
