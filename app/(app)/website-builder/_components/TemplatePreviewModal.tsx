"use client";

import Image from "next/image";
import {
  X,
  Award,
  Briefcase,
  Star,
  Palette,
  Code,
  Sparkles,
  Mail,
  Linkedin,
  Twitter,
} from "lucide-react";

type TemplatePreviewModalProps = {
  open: boolean;
  onClose: () => void;
  onApply?: () => void;
  displayName: string;
  description: string;
  for: string[];
};

const PREVIEW_HERO_IMAGE = "/AI.jpeg";

/** Selected work cards – image can be changed per card in future */
const SELECTED_WORK_CARDS = [
  {
    title: "FinTech App Redesign",
    category: "UI/UX Design",
    year: "2024",
    image: "/AI.jpeg",
  },
  {
    title: "E-Commerce Platform",
    category: "Product Design",
    year: "2023",
    image: "/AI.jpeg",
  },
  {
    title: "SaaS Dashboard",
    category: "Interface Design",
    year: "2024",
    image: "/AI.jpeg",
  },
  {
    title: "Brand Identity System",
    category: "Branding",
    year: "2023",
    image: "/AI.jpeg",
  },
] as const;

const SELECTED_WORK = {
  sectionWidth: 969,
  sectionHeight: 875,
  sectionGap: 64,
  marginLeft: 32,
  marginTop: 24,
  cardWidth: 468.64,
  cardHeight: 347.6,
  imageWidth: 468.64,
  imageHeight: 263.6,
  imageRadius: 16,
  cardRadius: 16,
  gridGap: 32,
} as const;

const TESTIMONIALS = {
  sectionWidth: 969,
  sectionHeight: 404,
  sectionGap: 64,
  marginLeft: 32,
  marginTop: 24,
  cardWidth: 468.64,
  cardHeight: 256,
  cardRadius: 16,
  cardGap: 32,
} as const;

const TESTIMONIAL_CARDS = [
  {
    quote:
      "Alex transformed our digital product completely. The attention to detail and user-centric approach exceeded our expectations.",
    name: "Sarah Johnson",
    role: "CEO, TechStart",
  },
  {
    quote:
      "Working with Alex was a game-changer. Professional, creative, and always delivers on time. Highly recommended!",
    name: "Michael Chen",
    role: "Founder, GrowthLab",
  },
] as const;

const MODAL = {
  width: 1032,
  top: 140,
  left: 204,
  radius: 16,
} as const;

const HERO_IMAGE = {
  width: 452.64,
  height: 500,
  radius: 16,
} as const;

export function TemplatePreviewModal({
  open,
  onClose,
  onApply,
  displayName,
  description,
  for: forList,
}: TemplatePreviewModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="template-preview-title"
    >
      <div
        className="relative flex flex-col bg-white shadow-xl"
        style={{
          position: "absolute",
          left: MODAL.left,
          top: MODAL.top,
          width: MODAL.width,
          borderRadius: MODAL.radius,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col" style={{ borderRadius: MODAL.radius }}>
          {/* Header */}
          <div className="flex flex-col gap-1 px-6 pt-6 pr-12">
            <h2
              id="template-preview-title"
              className="font-bold"
              style={{ fontFamily: "Helvetica, sans-serif", fontSize: 24, lineHeight: "32px", letterSpacing: 0, color: "#1A202C" }}
            >
              {displayName}
            </h2>
            <p style={{ fontSize: 14, lineHeight: "20px", letterSpacing: 0, fontWeight: 600, color: "#1A202C" }}>
              Perfect for:
            </p>
            <p style={{ fontSize: 14, lineHeight: "20px", letterSpacing: 0, fontWeight: 400, color: "#4A5565" }}>
              {forList.join(", ")}
            </p>
            <p style={{ fontSize: 14, lineHeight: "20px", letterSpacing: 0, fontWeight: 400, color: "#4A5565" }}>
              {description}
            </p>
          </div>

          {/* Main content - hero section */}
          <div className="flex flex-col gap-6 px-6 py-6 sm:flex-row sm:items-center">
            <div className="flex flex-1 flex-col gap-4">
              <h3
                className="font-bold"
                style={{ color: "#1A202C", fontSize: 60, lineHeight: "75px", letterSpacing: 0 }}
              >
                Alex Morgan
              </h3>
              <p
                className="font-normal"
                style={{ color: "#4A5565", fontSize: 24, lineHeight: "32px", letterSpacing: 0 }}
              >
                Digital Product Designer & Creative Director
              </p>
              <p
                className="font-normal"
                style={{ color: "#4A5565", fontSize: 18, lineHeight: "28px", letterSpacing: 0 }}
              >
                I help brands and startups create exceptional digital
                experiences through thoughtful design and strategic thinking.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  className="flex items-center justify-center font-semibold text-white transition hover:opacity-90"
                  style={{ width: 169.74, height: 59.2, borderRadius: 14, backgroundColor: "#101828", fontSize: 14 }}
                >
                  Work With Me
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center font-semibold transition hover:bg-gray-50"
                  style={{ width: 170.16, height: 59.2, borderRadius: 14, border: "1.6px solid #D1D5DC", color: "#1A202C", backgroundColor: "white", fontSize: 14 }}
                >
                  View Portfolio
                </button>
              </div>
            </div>
            <div
              className="relative shrink-0 flex flex-col"
              style={{
                width: HERO_IMAGE.width,
                height: HERO_IMAGE.height,
              }}
            >
              <div
                className="overflow-hidden w-full h-full"
                style={{ borderRadius: HERO_IMAGE.radius }}
              >
                <Image
                  src={PREVIEW_HERO_IMAGE}
                  alt=""
                  width={HERO_IMAGE.width}
                  height={HERO_IMAGE.height}
                  className="object-cover w-full h-full"
                />
              </div>
              <div
                className="absolute flex flex-col bg-white"
                style={{
                  width: 215.96,
                  height: 105.6,
                  bottom: -20,
                  left: -24,
                  borderRadius: 14,
                  borderTop: "0.8px solid #F3F4F6",
                  paddingTop: 24.8,
                  paddingRight: 24.8,
                  paddingBottom: 0.8,
                  paddingLeft: 24.8,
                  boxShadow:
                    "0 8px 10px -6px rgba(0,0,0,0.1), 0 20px 25px -5px rgba(0,0,0,0.1)",
                }}
              >
                <div className="flex flex-row items-start flex-1">
                  <div className="flex flex-1 flex-col items-center gap-0.5">
                    <span
                      className="font-bold text-center"
                      style={{ color: "#1A202C", fontSize: 30, lineHeight: "36px", letterSpacing: 0 }}
                    >
                      8+
                    </span>
                    <span
                      className="font-normal text-center"
                      style={{ color: "#4A5565", fontSize: 14, lineHeight: "20px", letterSpacing: 0 }}
                    >
                      Years Exp.
                    </span>
                  </div>
                  <div
                    className="self-stretch shrink-0"
                    style={{ width: 1, backgroundColor: "#E2E8F0" }}
                  />
                  <div className="flex flex-1 flex-col items-center gap-0.5">
                    <span
                      className="font-bold text-center"
                      style={{ color: "#1A202C", fontSize: 30, lineHeight: "36px", letterSpacing: 0 }}
                    >
                      100+
                    </span>
                    <span
                      className="font-normal text-center"
                      style={{ color: "#4A5565", fontSize: 14, lineHeight: "20px", letterSpacing: 0 }}
                    >
                      Projects
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* About Me section - matches reference design */}
          <div className="flex flex-col gap-0 pl-13 pt-60 pb-30">
            {/* About Me heading */}
            <div
              className="flex shrink-0 items-center"
              style={{ width: 895, height: 40, marginBottom: 32 }}
            >
              <h4
                className="font-bold"
                style={{
                  color: "#1A202C",
                  fontSize: 36,
                  lineHeight: "40px",
                  letterSpacing: 0,
                }}
              >
                About Me
              </h4>
            </div>
            {/* Text below heading - two paragraphs with spacing */}
            <div
              className="flex flex-col justify-center gap-3 overflow-hidden"
              style={{ width: 895, minHeight: 56 }}
            >
              <p
                className="font-normal"
                style={{
                  color: "#4A5568",
                  fontSize: 18,
                  lineHeight: "28px",
                  letterSpacing: 0,
                }}
              >
                With over 8 years of experience in digital design, I&apos;ve had
                the privilege of working with innovative startups and
                established brands to create products that people love to use.
              </p>
              <p
                className="font-normal"
                style={{
                  color: "#4A5568",
                  fontSize: 18,
                  lineHeight: "28px",
                  letterSpacing: 0,
                }}
              >
                My approach combines user research, strategic thinking, and
                meticulous attention to detail to deliver solutions that not
                only look beautiful but solve real problems.
              </p>
            </div>
            {/* Stats container - light gray #F9FAFB, cards in grid */}
            <div
              className="grid overflow-hidden"
              style={{
                width: 895,
                height: 203.99,
                borderRadius: 16,
                backgroundColor: "#F9FAFB",
                gridTemplateRows: "139.99px",
                gridTemplateColumns: "255.67px 255.67px 255.67px",
                rowGap: 32,
                columnGap: 32,
                paddingTop: 32,
                paddingLeft: 32,
                paddingRight: 32,
                paddingBottom: 32,
              }}
            >
              {/* Card 1 - Awards Won */}
              <div
                className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-transparent"
                style={{
                  width: 255.67,
                  height: 139.99,
                  gridRowStart: 1,
                  gridColumnStart: 1,
                  borderRadius: 16,
                }}
              >
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: "#DBEAFE" }}
                >
                  <Award className="h-6 w-6" style={{ color: "#2563EB" }} />
                </div>
                <span
                  className="font-bold text-center"
                  style={{ color: "#1A202C", fontSize: 24, lineHeight: "32px", letterSpacing: 0 }}
                >
                  15
                </span>
                <span
                  className="font-normal text-center"
                  style={{ color: "#4A5565", fontSize: 16, lineHeight: "24px", letterSpacing: 0 }}
                >
                  Awards Won
                </span>
              </div>
              {/* Card 2 - Clients Served */}
              <div
                className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-transparent"
                style={{
                  width: 255.67,
                  height: 139.99,
                  gridRowStart: 1,
                  gridColumnStart: 2,
                  borderRadius: 16,
                }}
              >
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: "#EDE9FE" }}
                >
                  <Briefcase className="h-6 w-6" style={{ color: "#7C3AED" }} />
                </div>
                <span
                  className="font-bold text-center"
                  style={{ color: "#1A202C", fontSize: 24, lineHeight: "32px", letterSpacing: 0 }}
                >
                  50+
                </span>
                <span
                  className="font-normal text-center"
                  style={{ color: "#4A5565", fontSize: 16, lineHeight: "24px", letterSpacing: 0 }}
                >
                  Clients Served
                </span>
              </div>
              {/* Card 3 - Client Rating */}
              <div
                className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-transparent"
                style={{
                  width: 255.67,
                  height: 139.99,
                  gridRowStart: 1,
                  gridColumnStart: 3,
                  borderRadius: 16,
                }}
              >
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: "#D1FAE5" }}
                >
                  <Star className="h-6 w-6" style={{ color: "#059669" }} />
                </div>
                <span
                  className="font-bold text-center"
                  style={{ color: "#1A202C", fontSize: 24, lineHeight: "32px", letterSpacing: 0 }}
                >
                  4.9/5
                </span>
                <span
                  className="font-normal text-center"
                  style={{ color: "#4A5565", fontSize: 16, lineHeight: "24px", letterSpacing: 0 }}
                >
                  Client Rating
                </span>
              </div>
            </div>
          </div>

          {/* What I Do - single container */}
          <div
            className="flex flex-col shrink-0"
            style={{
              width: 969,
              height: 412,
              backgroundColor: "#F9FAFB",
              gap: 64,
              marginTop: 24,
              marginLeft: 32,
              padding: "24px 0",
              borderRadius: 16,
            }}
          >
            <div className="flex flex-col gap-1 text-center shrink-0">
              <h4
                className="font-bold text-center"
                style={{
                  color: "#1A202C",
                  fontSize: 36,
                  lineHeight: "40px",
                  letterSpacing: 0,
                }}
              >
                What I Do
              </h4>
              <p
                className="font-normal text-center"
                style={{
                  color: "#4A5565",
                  fontSize: 20,
                  lineHeight: "28px",
                  letterSpacing: 0,
                }}
              >
                Specialized services to elevate your digital presence
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 px-2 flex-1 min-h-0">
              <div
                className="flex flex-col gap-3 rounded-2xl border-0 bg-white p-5 shadow-none"
                style={{ borderRadius: 16 }}
              >
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gray-100"
                  style={{ color: "#60A5FA" }}
                >
                  <Palette className="h-6 w-6" />
                </div>
                <h5
                  className="font-bold"
                  style={{
                    color: "#1A202C",
                    fontSize: 20,
                    lineHeight: "28px",
                    letterSpacing: 0,
                  }}
                >
                  UI/UX Design
                </h5>
                <p
                  className="font-normal"
                  style={{
                    color: "#4A5565",
                    fontSize: 16,
                    lineHeight: "24px",
                    letterSpacing: 0,
                  }}
                >
                  Creating intuitive and visually stunning interfaces that users
                  love.
                </p>
              </div>
              <div
                className="flex flex-col gap-3 rounded-2xl border-0 bg-white p-5 shadow-none"
                style={{ borderRadius: 16 }}
              >
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gray-100"
                  style={{ color: "#8B5CF6" }}
                >
                  <Code className="h-6 w-6" />
                </div>
                <h5
                  className="font-bold"
                  style={{
                    color: "#1A202C",
                    fontSize: 20,
                    lineHeight: "28px",
                    letterSpacing: 0,
                  }}
                >
                  Product Strategy
                </h5>
                <p
                  className="font-normal"
                  style={{
                    color: "#4A5565",
                    fontSize: 16,
                    lineHeight: "24px",
                    letterSpacing: 0,
                  }}
                >
                  Strategic planning and design thinking to bring your vision to
                  life.
                </p>
              </div>
              <div
                className="flex flex-col gap-3 rounded-2xl border-0 bg-white p-5 shadow-none"
                style={{ borderRadius: 16 }}
              >
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gray-100"
                  style={{ color: "#22C55E" }}
                >
                  <Sparkles className="h-6 w-6" />
                </div>
                <h5
                  className="font-bold"
                  style={{
                    color: "#1A202C",
                    fontSize: 20,
                    lineHeight: "28px",
                    letterSpacing: 0,
                  }}
                >
                  Brand Identity
                </h5>
                <p
                  className="font-normal"
                  style={{
                    color: "#4A5565",
                    fontSize: 16,
                    lineHeight: "24px",
                    letterSpacing: 0,
                  }}
                >
                  Crafting memorable brands that stand out in the market.
                </p>
              </div>
            </div>
          </div>

          {/* Selected Work section */}
          <div
            className="flex flex-col shrink-0"
            style={{
              width: SELECTED_WORK.sectionWidth,
              height: SELECTED_WORK.sectionHeight,
              // marginTop: SELECTED_WORK.marginTop,
              marginLeft: SELECTED_WORK.marginLeft,
              gap: SELECTED_WORK.sectionGap,
              marginTop: 80,
              marginBottom: 40,
            }}
          >
            <div className="flex shrink-0 flex-col gap-1 text-center">
              <h4
                className="font-bold text-center"
                style={{
                  color: "#1A202C",
                  fontSize: 36,
                  lineHeight: "40px",
                  letterSpacing: 0,
                }}
              >
                Selected Work
              </h4>
              <p
                className="font-normal text-center"
                style={{
                  color: "#4A5565",
                  fontSize: 20,
                  lineHeight: "28px",
                  letterSpacing: 0,
                }}
              >
                Recent projects I&apos;m proud of.
              </p>
            </div>
            <div
              className="grid shrink-0 overflow-hidden"
              style={{
                gridTemplateRows: "repeat(2, 347.6px)",
                gridTemplateColumns: "468.64px 468.64px",
                rowGap: SELECTED_WORK.gridGap,
                columnGap: SELECTED_WORK.gridGap,
              }}
            >
              {SELECTED_WORK_CARDS.map((card, index) => (
                <div
                  key={index}
                  className="flex flex-col overflow-hidden rounded-2xl border-0 bg-white shadow-none"
                  style={{
                    width: SELECTED_WORK.cardWidth,
                    height: SELECTED_WORK.cardHeight,
                    borderRadius: SELECTED_WORK.cardRadius,
                  }}
                >
                  <div
                    className="relative shrink-0 overflow-hidden"
                    style={{
                      width: SELECTED_WORK.imageWidth,
                      height: SELECTED_WORK.imageHeight,
                      borderRadius: SELECTED_WORK.imageRadius,
                    }}
                  >
                    <Image
                      src={card.image}
                      alt=""
                      width={SELECTED_WORK.imageWidth}
                      height={SELECTED_WORK.imageHeight}
                      className="h-full w-full object-cover"
                      style={{ borderRadius: SELECTED_WORK.imageRadius }}
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-center gap-0.5 px-4 py-3">
                    <div className="flex items-start justify-between gap-2">
                      <h5
                        className="font-bold"
                        style={{
                          color: "#1A202C",
                          fontSize: 20,
                          lineHeight: "28px",
                          letterSpacing: 0,
                        }}
                      >
                        {card.title}
                      </h5>
                      <span
                        className="shrink-0 font-normal"
                        style={{
                          color: "#718096",
                          fontSize: 16,
                          lineHeight: "24px",
                          letterSpacing: 0,
                        }}
                      >
                        {card.year}
                      </span>
                    </div>
                    <p
                      className="font-normal"
                      style={{
                        color: "#4A5565",
                        fontSize: 16,
                        lineHeight: "24px",
                        letterSpacing: 0,
                      }}
                    >
                      {card.category}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Client Testimonials section */}
          <div
            className="flex flex-col shrink-0"
            style={{
              width: TESTIMONIALS.sectionWidth,
              height: TESTIMONIALS.sectionHeight,
              // marginTop: TESTIMONIALS.marginTop,
              marginLeft: TESTIMONIALS.marginLeft,
              gap: TESTIMONIALS.sectionGap,
              backgroundColor: "#F9FAFB",
              borderRadius: 16,
              padding: "24px 0",
              marginBottom: 60,
              marginTop: 52,
            }}
          >
            <div className="flex shrink-0 flex-col gap-1 text-center">
              <h4
                className="font-bold text-center"
                style={{
                  color: "#1A202C",
                  fontSize: 36,
                  lineHeight: "40px",
                  letterSpacing: 0,
                }}
              >
                Client Testimonials
              </h4>
              <p
                className="font-normal text-center"
                style={{
                  color: "#4A5568",
                  fontSize: 20,
                  lineHeight: "28px",
                  letterSpacing: 0,
                }}
              >
                What people say about working with me
              </p>
            </div>
            <div
              className="flex shrink-0 flex-row"
              style={{ gap: TESTIMONIALS.cardGap }}
            >
              {TESTIMONIAL_CARDS.map((card, index) => (
                <div
                  key={index}
                  className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-none"
                  style={{
                    width: TESTIMONIALS.cardWidth,
                    height: TESTIMONIALS.cardHeight,
                    borderRadius: TESTIMONIALS.cardRadius,
                  }}
                >
                  <div className="mb-3 flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-amber-400 text-amber-400"
                        strokeWidth={0}
                      />
                    ))}
                  </div>
                  <p
                    className="mb-4 flex-1 italic"
                    style={{
                      color: "#4A5568",
                      fontSize: 18,
                      lineHeight: "28px",
                      letterSpacing: 0,
                      fontWeight: 400,
                    }}
                  >
                    &ldquo;{card.quote}&rdquo;
                  </p>
                  <p
                    className="font-bold"
                    style={{
                      color: "#1A202C",
                      fontSize: 16,
                      lineHeight: "24px",
                      letterSpacing: 0,
                    }}
                  >
                    {card.name}
                  </p>
                  <p
                    className="font-normal"
                    style={{
                      color: "#4A5565",
                      fontSize: 16,
                      lineHeight: "24px",
                      letterSpacing: 0,
                    }}
                  >
                    {card.role}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Let's Work Together CTA */}
          <div
            className="flex flex-col shrink-0 items-center justify-center pb-20"
            style={{
              width: 969,
              marginTop: 24,
              marginBottom: 52,
              marginLeft: 32,
              paddingTop: 64,
              paddingBottom: 64,
              gap: 24,
              backgroundColor: "#FFFFFF",
              borderRadius: 16,
            }}
          >
            <h4
              className="font-bold text-center"
              style={{
                color: "#1A202C",
                fontSize: 48,
                lineHeight: "48px",
                letterSpacing: 0,
              }}
            >
              Let&apos;s Work Together
            </h4>
            <p
              className="font-normal text-center"
              style={{
                color: "#4A5568",
                fontSize: 20,
                lineHeight: "28px",
                letterSpacing: 0,
              }}
            >
              Have a project in mind? Let&apos;s create something amazing
              together.
            </p>
            <div className="flex flex-row items-center gap-4">
              <button
                type="button"
                className="flex items-center justify-center gap-2 font-semibold text-white transition hover:opacity-90"
                style={{
                  width: 182.75,
                  height: 59.2,
                  borderRadius: 14,
                  backgroundColor: "#1A202C",
                  fontSize: 14,
                }}
              >
                <Mail className="h-4 w-4" />
                Get in Touch
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 font-semibold transition hover:bg-gray-50"
                style={{
                  width: 165.81,
                  height: 59.2,
                  borderRadius: 14,
                  border: "1.6px solid #CBD5E0",
                  color: "#1A202C",
                  fontSize: 14,
                }}
              >
                Download CV
              </button>
            </div>
            <div className="flex flex-row items-center gap-4 pt-2">
              <div
                className="flex items-center justify-center"
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  backgroundColor: "#F3F4F6",
                }}
              >
                <Linkedin className="h-5 w-5" style={{ color: "#1A202C" }} />
              </div>
              <div
                className="flex items-center justify-center"
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  backgroundColor: "#F3F4F6",
                }}
              >
                <Twitter className="h-5 w-5" style={{ color: "#1A202C" }} />
              </div>
              <div
                className="flex items-center justify-center"
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  backgroundColor: "#F3F4F6",
                }}
              >
                <Mail className="h-5 w-5" style={{ color: "#1A202C" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Sticky footer - Close / Apply Template */}
        <div
          className="sticky bottom-0 flex shrink-0 flex-row items-center gap-4 border-t border-gray-200 bg-white px-6 py-4"
          style={{ borderRadius: `0 0 ${MODAL.radius}px ${MODAL.radius}px` }}
        >
          <button
            type="button"
            onClick={onClose}
            className="flex flex-1 items-center justify-center rounded-full border border-gray-300 bg-white py-3 text-sm font-semibold transition hover:bg-gray-50"
            style={{ color: "#1A202C", borderRadius: 48 }}
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onApply?.();
              onClose();
            }}
            className="flex flex-1 items-center justify-center rounded-full py-3 text-sm font-semibold text-white transition hover:opacity-90"
            style={{ backgroundColor: "#0149E1", borderRadius: 48 }}
          >
            Apply Template
          </button>
        </div>
      </div>
    </div>
  );
}
