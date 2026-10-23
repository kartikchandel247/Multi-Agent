"use client";

import React, { forwardRef } from "react";
import { clsx } from "clsx";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, className, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={clsx(
              "w-full rounded-2xl bg-white/50 backdrop-blur-xl border border-white/85 px-4 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 transition-all duration-200 focus:outline-none focus:bg-white/90 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/15 shadow-[0_2px_10px_rgba(0,0,0,0.02)_inset]",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error && "border-rose-400 focus:border-rose-500 focus:ring-rose-500/15",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 flex items-center pointer-events-none text-slate-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error ? (
          <p className="mt-1 text-xs text-rose-500 font-semibold">{error}</p>
        ) : hint ? (
          <p className="mt-1 text-xs text-slate-400 font-medium">{hint}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
