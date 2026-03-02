"use client";

import { useState } from "react";
import {
  Camera,
  Link2,
  MessageCircle,
  Music2,
  Share2,
  Video,
  Linkedin,
  Twitter,
  Github,
  type LucideIcon,
} from "lucide-react";

const SOCIAL_PLATFORMS: {
  id: string;
  label: string;
  placeholder: string;
  icon: LucideIcon;
}[] = [
  {
    id: "instagram",
    label: "Instagram",
    placeholder: "instagram.com/yourprofile",
    icon: Camera,
  },
  {
    id: "facebook",
    label: "Facebook",
    placeholder: "facebook.com/yourpage",
    icon: Share2,
  },
  {
    id: "tiktok",
    label: "Tiktok",
    placeholder: "tiktok.com/@yourusername",
    icon: Music2,
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    placeholder: "wa.me/1234567890",
    icon: MessageCircle,
  },
  {
    id: "youtube",
    label: "YouTube",
    placeholder: "youtube.com/@yourchannel",
    icon: Video,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    placeholder: "linkedin.com/company/yourcompany",
    icon: Linkedin,
  },
  {
    id: "twitter",
    label: "X (Twitter)",
    placeholder: "twitter.com/yourhandle",
    icon: Twitter,
  },
  {
    id: "github",
    label: "GitHub",
    placeholder: "github.com/yourusername",
    icon: Github,
  },
  {
    id: "other",
    label: "Other link",
    placeholder: "https://yourlink.com",
    icon: Link2,
  },
];

export function SocialLinksPanel() {
  const [showSocialLinks, setShowSocialLinks] = useState(true);
  const [links, setLinks] = useState<Record<string, string>>({});

  const updateLink = (id: string, value: string) => {
    setLinks((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div
      className="flex flex-col w-full max-w-[398px] overflow-y-auto"
      style={{
        paddingTop: 8,
        paddingRight: 32,
        paddingBottom: 620,
        paddingLeft: 32,
        gap: 24,
        backgroundColor: "#FFFFFF",
      }}
    >
      {/* Header - heading style: Helvetica 700 24px/36px 0.4px */}
      <div className="flex flex-col gap-1.5">
        <h2
          className="text-secondary-dark"
          style={{
            fontFamily: "Helvetica, sans-serif",
            fontWeight: 700,
            fontSize: 24,
            lineHeight: "36px",
            letterSpacing: "0.4px",
          }}
        >
          Social Links
        </h2>
        <p className="text-sm text-secondary">
          Add your social media profiles to your website.
        </p>
      </div>

      {/* Show social links toggle */}
      <div
        className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50/80 p-4 shadow-sm"
        style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}
      >
        <div className="min-w-0 flex-1">
          <p
            className="text-secondary-dark"
            style={{
              fontFamily: "Helvetica, sans-serif",
              fontWeight: 700,
              fontSize: 24,
              lineHeight: "36px",
              letterSpacing: "0.4px",
            }}
          >
            Show social links
          </p>
          <p className="mt-0.5 text-xs text-secondary">
            Only links you add will be shown on your website.
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={showSocialLinks}
          onClick={() => setShowSocialLinks((v) => !v)}
          className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
            showSocialLinks ? "bg-[#0149E1]" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
              showSocialLinks ? "left-6" : "left-1"
            }`}
          />
        </button>
      </div>

      {/* Social platform inputs - platform labels: Helvetica 700 14px/20px -0.15px */}
      <div className="flex flex-col gap-4">
        {SOCIAL_PLATFORMS.map((platform) => {
          const Icon = platform.icon;
          return (
            <div key={platform.id} className="flex flex-col gap-1.5">
              <label
                htmlFor={`social-${platform.id}`}
                className="text-secondary-dark"
                style={{
                  fontFamily: "Helvetica, sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  lineHeight: "20px",
                  letterSpacing: "-0.15px",
                }}
              >
                {platform.label}
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 focus-within:border-[#0149E1] focus-within:ring-1 focus-within:ring-[#0149E1]">
                <Icon className="h-4 w-4 shrink-0 text-gray-400" aria-hidden />
                <input
                  id={`social-${platform.id}`}
                  type="url"
                  value={links[platform.id] ?? ""}
                  onChange={(e) => updateLink(platform.id, e.target.value)}
                  placeholder={platform.placeholder}
                  className="min-w-0 flex-1 bg-transparent text-sm text-secondary-dark placeholder:text-gray-400 outline-none"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
