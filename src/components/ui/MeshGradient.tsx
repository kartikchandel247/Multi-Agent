"use client";

import React from "react";

export function MeshGradient() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Background base tone */}
      <div className="absolute inset-0 bg-[#FAFAFA]" />

      {/* Electric Blue Orb #3B82F6 */}
      <div
        className="absolute -top-[15%] -left-[10%] w-[55vw] h-[55vw] rounded-full opacity-40 blur-[130px] animate-mesh-1"
        style={{
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.28) 0%, rgba(59, 130, 246, 0.05) 60%, transparent 80%)",
        }}
      />

      {/* Soft Violet Orb #8B5CF6 */}
      <div
        className="absolute top-[20%] -right-[15%] w-[60vw] h-[60vw] rounded-full opacity-35 blur-[140px] animate-mesh-2"
        style={{
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, rgba(139, 92, 246, 0.04) 60%, transparent 80%)",
        }}
      />

      {/* Cyan/Sky subtle accent in bottom-center */}
      <div
        className="absolute -bottom-[20%] left-[20%] w-[50vw] h-[50vw] rounded-full opacity-25 blur-[120px]"
        style={{
          background: "radial-gradient(circle, rgba(14, 165, 233, 0.2) 0%, rgba(99, 102, 241, 0.04) 60%, transparent 80%)",
        }}
      />

      {/* Micro-dot grid pattern for technological depth */}
      <div
        className="absolute inset-0 opacity-[0.25]"
        style={{
          backgroundImage: "radial-gradient(#94A3B8 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
    </div>
  );
}
