"use client";

import * as React from "react";

interface ArohLogoProps {
  size?: number; // Size of logo in px (e.g. 24, 32, 40, 60, 110)
  className?: string;
  showText?: boolean;
  textColor?: string;
  rounded?: string;
}

/**
 * Official AROH Logo Component
 * Renders the official high-resolution AROH logo image (aroh-logo.png)
 */
export default function ArohLogo({
  size = 36,
  className = "",
  showText = false,
  textColor = "text-slate-900",
  rounded = "rounded-xl",
}: ArohLogoProps) {
  return (
    <div className={`inline-flex flex-col items-center justify-center shrink-0 ${className}`}>
      <img
        src="/aroh-logo.png"
        alt="AROH Logo"
        style={{ width: size, height: size }}
        className={`object-contain ${rounded} shadow-sm border border-black/5 transition-transform duration-300 hover:scale-105`}
      />
      {showText && (
        <span
          className={`font-extrabold tracking-[0.3em] uppercase select-none text-[11px] mt-1.5 ${textColor}`}
        >
          AROH
        </span>
      )}
    </div>
  );
}
