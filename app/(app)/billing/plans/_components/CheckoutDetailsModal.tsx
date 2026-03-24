"use client";

import { useState } from "react";
import { Building2 } from "lucide-react";

export type CheckoutDetails = {
  fullName: string;
  email: string;
  company: string;
  city: string;
  country: string;
};

const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "India",
  "Brazil",
  "Japan",
  "South Korea",
  "Mexico",
  "Italy",
  "Spain",
  "Netherlands",
  "Sweden",
  "Norway",
  "Denmark",
  "Finland",
  "Switzerland",
  "Austria",
  "Belgium",
  "Ireland",
  "New Zealand",
  "Singapore",
  "United Arab Emirates",
  "Saudi Arabia",
  "South Africa",
  "Nigeria",
  "Egypt",
  "Turkey",
  "Poland",
  "Czech Republic",
  "Portugal",
  "Argentina",
  "Chile",
  "Colombia",
  "Indonesia",
  "Thailand",
  "Vietnam",
  "Philippines",
  "Malaysia",
  "Pakistan",
  "Bangladesh",
  "Kenya",
  "Ghana",
  "Other",
];

export default function CheckoutDetailsModal({
  planName,
  priceLabel,
  defaultEmail,
  onContinue,
  onClose,
}: {
  planName: string;
  priceLabel: string;
  defaultEmail?: string | null;
  onContinue: (details: CheckoutDetails) => void;
  onClose: () => void;
}) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(defaultEmail ?? "");
  const [company, setCompany] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  const isValid =
    fullName.trim() && email.trim() && city.trim() && country.trim();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    onContinue({ fullName, email, company, city, country });
  }

  const inputClass =
    "w-full rounded-lg border border-secondary-fade bg-white px-4 py-2.5 text-sm text-secondary-darker placeholder:text-secondary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-secondary-darker">
              Complete your details
            </h2>
            <p className="mt-1 text-sm text-secondary">
              Step 1 of 2 - Let&apos;s get to know you
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xl text-secondary hover:text-secondary-darker transition"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Selected package */}
        <div className="mt-5 flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 p-4">
          <div>
            <p className="text-xs text-secondary">Selected Package</p>
            <p className="text-lg font-bold text-secondary-darker">
              {planName}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-secondary">Price</p>
            <p className="text-2xl font-bold text-secondary-darker">
              {priceLabel}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-secondary-darker">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-secondary-darker">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-secondary-darker">
              Company Name (Optional)
            </label>
            <div className="relative">
              <Building2
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary"
              />
              <input
                type="text"
                placeholder="Your company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className={`${inputClass} pl-9`}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-secondary-darker">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="San Francisco"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-secondary-darker">
                Country <span className="text-red-500">*</span>
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className={inputClass}
                required
              >
                <option value="">Select country</option>
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={!isValid}
            className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-active disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to Payment
          </button>
        </form>
      </div>
    </div>
  );
}
