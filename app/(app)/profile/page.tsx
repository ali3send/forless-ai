"use client";

import { useState } from "react";
import {
  Users,
  Lock,
  Save,
  Check,
  BadgeCheck,
  CreditCard,
  Sparkles,
  Download,
} from "lucide-react";
import { ChangePasswordModal } from "./_components/ChangePasswordModal";
import { CancelPlanModal } from "./_components/CancelPlanModal";
import { UpdatePaymentMethodModal } from "./_components/UpdatePaymentMethodModal";

export default function ProfilePage() {
  const [fullName, setFullName] = useState("John Anderson");
  const [email, setEmail] = useState("john@example.com");
  const [saved, setSaved] = useState(true);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [cancelPlanOpen, setCancelPlanOpen] = useState(false);
  const [updatePaymentOpen, setUpdatePaymentOpen] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
  };

  return (
    <div className="mx-auto w-full max-w-[1298px] px-4">
      {/* Top container: fixed 1055×126px, vertical, gap 16px */}
      <div className="mb-6 flex h-[126px] w-[1055px] max-w-full flex-col gap-4">
        {/* Heading: fill 1055px, hug 81px, gap 24px between title and subtitle */}
        <div className="flex w-full max-w-[1055px] flex-col gap-6">
          <h1
            className="text-gray-900"
            style={{
              fontFamily: "Helvetica, sans-serif",
              fontWeight: 700,
              fontSize: "32px",
              lineHeight: "40px",
              letterSpacing: "0.4px",
            }}
          >
            Your Profile
          </h1>
          {/* Subtitle text: 1055×29px, Helvetica 18px/160%, weight 400 */}
          <p
            className="h-[29px] w-full max-w-[1055px] text-gray-500"
            style={{
              fontFamily: "Helvetica, sans-serif",
              fontWeight: 400,
              fontSize: "18px",
              lineHeight: "160%",
              letterSpacing: "0%",
            }}
          >
            Manage your account, plan, and billing
          </p>
        </div>
      </div>

      {/* Profile details container: vertical flow, 32px radius, 0.8px border, 32px padding, 32px gap */}
      <div
        className="flex w-full max-w-[1298px] flex-col gap-8 rounded-[32px] border border-gray-200 bg-white p-8 shadow-sm"
        style={{ borderWidth: "0.8px" }}
      >
        {/* Profile Info — separate container: fill width, 80px height, 24px radius, bottom border 0.8px, padding 16/24/16/24 */}
        <div
          className="flex h-20 w-full items-center gap-3 rounded-[24px] bg-[#E8F2FF] border-gray-200 pl-6 pr-6 pt-4 pb-4"
          style={{
            borderBottomWidth: "0.8px",
            borderTop: "none",
            borderLeft: "none",
            borderRight: "none",
          }}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0149E1] text-white">
            <Users size={22} strokeWidth={2} />
          </div>
          <div>
            <h2
              className="font-semibold text-gray-800"
              style={{
                fontFamily: "Helvetica, sans-serif",
                fontSize: "18px",
                lineHeight: "24px",
              }}
            >
              Profile info
            </h2>
            <p className="text-sm text-gray-500">Your personal details</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="flex flex-col gap-8">
          <div className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-[#0149E1] focus:outline-none focus:ring-2 focus:ring-[#0149E1]/20"
                placeholder="John Anderson"
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-[#0149E1] focus:outline-none focus:ring-2 focus:ring-[#0149E1]/20"
                placeholder="john@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Password
              </label>
              <button
                type="button"
                onClick={() => setChangePasswordOpen(true)}
                className="mt-1.5 flex h-12 w-[320px] items-center justify-center gap-2 rounded-[28px] border border-gray-300 bg-gray-50 px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
              >
                <Lock size={18} className="shrink-0 text-gray-500" />
                Change password
              </button>
            </div>

            {/* User ID */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                User ID
              </label>
              <input
                type="text"
                readOnly
                value="FRL-000245"
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-500 focus:border-gray-300 focus:outline-none"
              />
              <p className="mt-1.5 text-xs text-gray-500">
                Used for support & invoices
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              className="inline-flex h-[46px] w-[170px] items-center justify-center gap-2 rounded-[48px] bg-[#0149E1] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0139b8]"
            >
              <Save size={18} className="shrink-0" />
              Save changes
            </button>
            {saved && (
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                <Check size={18} className="shrink-0" />
                Saved!
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Current Plan container */}
      <div
        className="mt-8 flex w-full max-w-[1298px] flex-col gap-8 rounded-[32px] border border-gray-200 bg-white p-8 shadow-sm"
        style={{ borderWidth: "0.8px" }}
      >
        {/* Section header */}
        <div
          className="flex h-20 w-full items-center gap-3 rounded-[24px] bg-[#E8F2FF] pl-6 pr-6 pt-4 pb-4"
          style={{
            borderBottomWidth: "0.8px",
            borderTop: "none",
            borderLeft: "none",
            borderRight: "none",
          }}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0149E1] text-white">
            <BadgeCheck size={22} strokeWidth={2} />
          </div>
          <div>
            <h2
              className="font-semibold text-gray-800"
              style={{
                fontFamily: "Helvetica, sans-serif",
                fontSize: "18px",
                lineHeight: "24px",
              }}
            >
              Current Plan
            </h2>
            <p className="text-sm text-gray-500">Your subscription details</p>
          </div>
        </div>

        {/* Plan content: two columns — left (plan, billing cycle), right (price, next billing date) */}
        <div className="flex flex-wrap justify-between gap-8 pt-2">
          {/* Left column: plan & billing cycle — left-aligned */}
          <div className="flex flex-col items-start space-y-6 text-left">
            <div className="space-y-2">
              <div className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Plan
              </div>
              <div className="flex items-center gap-3">
                <span
                  className="text-2xl font-semibold text-gray-900"
                  style={{ fontFamily: "Helvetica, sans-serif" }}
                >
                  Professional
                </span>
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-600">
                  Active
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Billing Cycle
              </div>
              <div className="text-sm font-medium text-gray-900">Monthly</div>
            </div>
          </div>

          {/* Right column: price & next billing date — left-aligned block, not at far right */}
          <div className="flex flex-col items-start space-y-6 text-left">
            <div className="space-y-2">
              <div className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Price
              </div>
              <div className="text-sm font-semibold text-gray-900">
                $29 <span className="font-normal text-gray-500">/ monthly</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Next Billing Date
              </div>
              <div className="text-sm font-semibold text-gray-900">
                March 15, 2026
              </div>
            </div>
          </div>
        </div>

        {/* Plan actions: Upgrade + View all plans on first row, Cancel plan below left-aligned */}
        <div className="mt-6 flex flex-col items-start gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              className="inline-flex h-[52px] w-[170.86px] flex-shrink-0 items-center justify-center gap-2 rounded-[48px] bg-[#0149E1] p-3 text-sm font-semibold text-white transition hover:bg-[#0139b8]"
            >
              <Sparkles size={18} className="shrink-0" />
              Upgrade plan
            </button>
            <button
              type="button"
              className="inline-flex h-[52px] w-[146.96px] flex-shrink-0 items-center justify-center gap-2 rounded-[48px] bg-gray-100 p-3 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
            >
              View all plans
            </button>
          </div>
          <button
            type="button"
            onClick={() => setCancelPlanOpen(true)}
            className="inline-flex h-[52px] w-[146.96px] flex-shrink-0 items-center justify-center gap-2 rounded-[48px] border border-gray-300 bg-white p-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Cancel plan
          </button>
        </div>
      </div>

      {/* Payment Method container */}
      <div
        className="mt-8 flex w-full max-w-[1298px] flex-col gap-8 rounded-[32px] border border-gray-200 bg-white p-8 shadow-sm"
        style={{ borderWidth: "0.8px" }}
      >
        {/* Section header */}
        <div
          className="flex h-20 w-full items-center gap-3 rounded-[24px] bg-[#E8F2FF] pl-6 pr-6 pt-4 pb-4"
          style={{
            borderBottomWidth: "0.8px",
            borderTop: "none",
            borderLeft: "none",
            borderRight: "none",
          }}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0149E1] text-white">
            <CreditCard size={22} strokeWidth={2} />
          </div>
          <div>
            <h2
              className="font-semibold text-gray-800"
              style={{
                fontFamily: "Helvetica, sans-serif",
                fontSize: "18px",
                lineHeight: "24px",
              }}
            >
              Payment Method
            </h2>
            <p className="text-sm text-gray-500">Your saved payment details</p>
          </div>
        </div>

        {/* Payment content */}
        <div className="flex flex-wrap items-center justify-between gap-6 pt-2">
          <div className="space-y-3">
            <div className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Expires
            </div>
            <div className="text-sm font-medium text-gray-900">12/2026</div>
            <div
              className="text-lg font-semibold text-gray-900"
              style={{ fontFamily: "Helvetica, sans-serif" }}
            >
              Card ending in •••• 4242
            </div>
          </div>

          <button
            type="button"
            onClick={() => setUpdatePaymentOpen(true)}
            className="inline-flex h-[44px] w-auto items-center justify-center gap-2 rounded-[14px] border border-gray-300 bg-white px-[17px] py-[10px] text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
          >
            Update Card
          </button>
        </div>
      </div>

      {/* Billing & Invoices container */}
      <div
        className="mt-8 flex w-full max-w-[1298px] flex-col gap-8 rounded-[32px] border border-gray-200 bg-white p-8 shadow-sm"
        style={{ borderWidth: "0.8px" }}
      >
        {/* Section header */}
        <div
          className="flex h-20 w-full items-center gap-3 rounded-[24px] bg-[#E8F2FF] pl-6 pr-6 pt-4 pb-4"
          style={{
            borderBottomWidth: "0.8px",
            borderTop: "none",
            borderLeft: "none",
            borderRight: "none",
          }}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0149E1] text-white">
            {/* Simple invoice icon using $ */}
            <span
              className="text-lg font-semibold"
              style={{ fontFamily: "Helvetica, sans-serif" }}
            >
              $
            </span>
          </div>
          <div>
            <h2
              className="font-semibold text-gray-800"
              style={{
                fontFamily: "Helvetica, sans-serif",
                fontSize: "18px",
                lineHeight: "24px",
              }}
            >
              Billing & Invoices
            </h2>
            <p className="text-sm text-gray-500">Your payment history</p>
          </div>
        </div>

        {/* Invoices list */}
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-[18px] border border-gray-100 bg-white px-6 py-4 shadow-[0_1px_4px_rgba(15,23,42,0.04)]"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-900">
                    Jan 1, 2026
                  </span>
                  <span
                    className="inline-flex h-6 items-center justify-center rounded-full bg-[#F0FDF4] px-3 py-1 text-xs font-semibold text-emerald-600"
                    style={{
                      borderRadius: "200px",
                      paddingTop: "4px",
                      paddingBottom: "4px",
                      paddingLeft: "12px",
                      paddingRight: "12px",
                    }}
                  >
                    Paid
                  </span>
                </div>
                <div className="text-sm text-gray-700">$29.00</div>
              </div>

              <button
                type="button"
                className="inline-flex h-[48px] w-[164.88px] items-center justify-center gap-[10px] rounded-[10px] border border-gray-200 bg-white px-4 py-3 text-xs font-semibold text-gray-800 transition hover:bg-gray-50"
                style={{
                  borderWidth: "0.8px",
                  paddingTop: "12px",
                  paddingBottom: "12px",
                  paddingLeft: "16px",
                  paddingRight: "16px",
                }}
              >
                <Download size={18} className="text-gray-500" />
                Download PDF
              </button>
            </div>
          ))}
        </div>
      </div>

      <ChangePasswordModal
        open={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
      />
      <CancelPlanModal
        open={cancelPlanOpen}
        onClose={() => setCancelPlanOpen(false)}
      />
      <UpdatePaymentMethodModal
        open={updatePaymentOpen}
        onClose={() => setUpdatePaymentOpen(false)}
      />
    </div>
  );
}
