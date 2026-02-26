"use client";

export default function BillingHeader() {
  return (
    <div className="flex flex-col items-center text-center">
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
        Choose your plan
      </h1>
      <p className="mt-2 text-base text-gray-500">
        Build fast. Pay less. Change anytime.
      </p>
    </div>
  );
}
