"use client";

import React from "react";

export function MeshGradient() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Base Canvas */}
      <div className="absolute inset-0 bg-[#F8FAFC]" />

      {/* Vibrant Electric Blue Orb #3B82F6 */}
      <div
        className="absolute -top-[15%] -left-[10%] w-[65vw] h-[65vw] rounded-full opacity-60 blur-[130px] animate-mesh-drift-1"
        style={{
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.45) 0%, rgba(99, 102, 241, 0.25) 45%, transparent 75%)",
        }}
      />

      {/* Glowing Soft Violet & Purple Orb #8B5CF6 */}
      <div
        className="absolute top-[10%] -right-[15%] w-[60vw] h-[60vw] rounded-full opacity-55 blur-[140px] animate-mesh-drift-2"
        style={{
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, rgba(192, 132, 252, 0.2) 50%, transparent 80%)",
        }}
      />

      {/* Soft Rose / Fuchsia Atmospheric Orb */}
      <div
        className="absolute top-[55%] left-[10%] w-[50vw] h-[50vw] rounded-full opacity-45 blur-[135px] animate-mesh-drift-3"
        style={{
          background: "radial-gradient(circle, rgba(244, 63, 94, 0.3) 0%, rgba(236, 72, 153, 0.15) 50%, transparent 75%)",
        }}
      />

      {/* Cyan / Aqua Bright Horizon Orb */}
      <div
        className="absolute -bottom-[20%] right-[15%] w-[55vw] h-[55vw] rounded-full opacity-50 blur-[125px]"
        style={{
          background: "radial-gradient(circle, rgba(6, 182, 212, 0.35) 0%, rgba(59, 130, 246, 0.15) 55%, transparent 80%)",
        }}
      />

      {/* Subtle modern technological grid matrix */}
      <div
        className="absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage: "radial-gradient(rgba(148, 163, 184, 0.5) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
    </div>
  );
}
