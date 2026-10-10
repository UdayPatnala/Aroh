import React from "react";
import { getTimelineAnnouncements, OFFICIAL_COMMUNITY_FEEDBACK_CHANNELS } from "@aroh/asdk";
import type { MobileScreenProps } from "../types";

export const AnnouncementsScreen: React.FC<MobileScreenProps> = () => {
  const timeline = getTimelineAnnouncements();
  const stages = [
    { label: "Current", items: timeline.current, color: "#10b981" },
    { label: "In Development", items: timeline.inDevelopment, color: "#3b82f6" },
    { label: "Coming Soon", items: timeline.comingSoon, color: "#f59e0b" },
    { label: "Future", items: timeline.future, color: "#8b5cf6" }
  ];

  return (
    <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <header>
        <h1 style={{ fontSize: "20px", fontWeight: "bold", margin: 0, color: "#fff" }}>
          Ecosystem Roadmap
        </h1>
        <p style={{ fontSize: "13px", color: "#a1a1aa", margin: "4px 0 0 0" }}>
          Upcoming developments, releases & product milestones
        </p>
      </header>

      {/* Official Community Feedback Bridge */}
      <div
        style={{
          backgroundColor: "#18181b",
          border: "1px solid rgba(225, 48, 108, 0.3)",
          borderRadius: "12px",
          padding: "14px",
          display: "flex",
          flexDirection: "column",
          gap: "8px"
        }}
      >
        <span style={{ fontSize: "12px", fontWeight: "600", color: "#f43f5e" }}>
          Have an idea for AROH?
        </span>
        <p style={{ fontSize: "11px", color: "#a1a1aa", margin: 0, lineHeight: "1.4" }}>
          Send your feature suggestion on our verified Instagram profile. Note: strictly for product ideas, not for passwords or payments.
        </p>
        <a
          href={OFFICIAL_COMMUNITY_FEEDBACK_CHANNELS.instagram.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: "12px",
            color: "#60a5fa",
            textDecoration: "none",
            fontWeight: "500",
            marginTop: "2px"
          }}
        >
          {OFFICIAL_COMMUNITY_FEEDBACK_CHANNELS.instagram.handle} on Instagram →
        </a>
      </div>

      {/* Roadmap Stages */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {stages.map((stage) => (
          <div key={stage.label} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "999px",
                  backgroundColor: stage.color
                }}
              />
              <span style={{ fontSize: "13px", fontWeight: "600", color: "#e4e4e7" }}>
                {stage.label} ({stage.items.length})
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {stage.items.map((ann) => (
                <div
                  key={ann.id}
                  style={{
                    backgroundColor: "#18181b",
                    border: "1px solid #27272a",
                    borderRadius: "10px",
                    padding: "12px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <span style={{ fontSize: "13px", fontWeight: "600", color: "#f4f4f5" }}>
                      {ann.title}
                    </span>
                    <span
                      style={{
                        fontSize: "10px",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        backgroundColor: "#27272a",
                        color: "#a1a1aa",
                        fontFamily: "monospace"
                      }}
                    >
                      {ann.type}
                    </span>
                  </div>

                  <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0, lineHeight: "1.4" }}>
                    {ann.shortDescription}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
