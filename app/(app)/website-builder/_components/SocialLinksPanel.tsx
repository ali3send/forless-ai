// app/(app)/website-builder/_components/SocialLinksPanel.tsx
"use client";

import {
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
  Github,
  MessageCircle,
  Link2,
  X,
} from "lucide-react";
import { useWebsiteStore } from "@/store/website.store";

const PLATFORMS = [
  { id: "instagram", label: "Instagram", icon: Instagram, placeholder: "https://instagram.com/yourname" },
  { id: "facebook", label: "Facebook", icon: Facebook, placeholder: "https://facebook.com/yourpage" },
  { id: "tiktok", label: "TikTok", icon: Link2, placeholder: "https://tiktok.com/@yourname" },
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle, placeholder: "https://wa.me/1234567890" },
  { id: "youtube", label: "YouTube", icon: Youtube, placeholder: "https://youtube.com/@yourchannel" },
  { id: "linkedin", label: "LinkedIn", icon: Linkedin, placeholder: "https://linkedin.com/in/yourname" },
  { id: "x", label: "X (Twitter)", icon: X, placeholder: "https://x.com/yourhandle" },
  { id: "github", label: "GitHub", icon: Github, placeholder: "https://github.com/yourname" },
] as const;

export default function SocialLinksPanel() {
  const { data, patchData } = useWebsiteStore();

  const socialLinks = data?.socialLinks ?? { show: true, links: [] };

  function updateShow(show: boolean) {
    patchData({ socialLinks: { ...socialLinks, show } });
  }

  function updateLink(platform: string, url: string) {
    const existing = [...socialLinks.links];
    const idx = existing.findIndex((l) => l.platform === platform);
    if (idx >= 0) {
      existing[idx] = { platform, url };
    } else {
      existing.push({ platform, url });
    }
    patchData({ socialLinks: { ...socialLinks, links: existing } });
  }

  function getLinkUrl(platform: string) {
    return socialLinks.links.find((l) => l.platform === platform)?.url ?? "";
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-secondary-darker">
          Social Links
        </h2>
        <p className="mt-1 text-sm text-secondary">
          Add your social media profiles to your website.
        </p>
      </div>

      {/* Toggle */}
      <div className="flex items-center justify-between rounded-xl border border-secondary-fade bg-white p-4">
        <span className="text-sm font-medium text-secondary-darker">
          Show social links on website
        </span>
        <button
          type="button"
          onClick={() => updateShow(!socialLinks.show)}
          className={`relative h-6 w-11 rounded-full transition ${
            socialLinks.show ? "bg-primary" : "bg-secondary-fade"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
              socialLinks.show ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Platform inputs */}
      <div className="space-y-3">
        {PLATFORMS.map((p) => {
          const Icon = p.icon;
          return (
            <div key={p.id} className="space-y-1.5">
              <label className="flex items-center gap-2 text-sm font-medium text-secondary-darker">
                <Icon size={16} className="text-secondary" />
                {p.label}
              </label>
              <input
                type="url"
                value={getLinkUrl(p.id)}
                onChange={(e) => updateLink(p.id, e.target.value)}
                placeholder={p.placeholder}
                className="w-full rounded-lg border border-secondary-fade bg-white px-3 py-2.5 text-sm text-secondary-darker outline-none transition placeholder:text-secondary focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
