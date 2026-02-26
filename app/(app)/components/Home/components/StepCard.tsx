import { HowItWorksStep } from "../data/HowItWorks";

/* Card: near-white subtle gradient. Color only on the step number. */
const CARD_BG =
  "linear-gradient(145deg, #faf8fc 0%, #f5f3f6 40%, #ffffff 100%)";
const NUMBER_GRADIENT =
  "linear-gradient(90deg, #A0B3E0 0%, #B0C2EE 35%, #E8C8BE 70%, #F0DCD4 100%)";

const NUMBER_GRADIENT1 = "linear-gradient(90deg, #FD6C1180 0%, #0149E180 100%)";

const GRADIENT_BOX = {
  width: 408,
  height: 110,
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
};

export function HowItWorksStepCard({
  number,
  title,
  description,
}: HowItWorksStep) {
  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{
        width: "100%",
        maxWidth: 408,
        minHeight: 224,
        borderRadius: 16,
        background: "white",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}
    >
      {/* Container for gradient + number: 408×110px, top-left & top-right radius 16px */}
      <div
        className="relative flex items-center"
        style={{
          width: "100%",
          height: GRADIENT_BOX.height,
          minHeight: GRADIENT_BOX.height,
          background: NUMBER_GRADIENT,
          borderTopLeftRadius: GRADIENT_BOX.borderTopLeftRadius,
          borderTopRightRadius: GRADIENT_BOX.borderTopRightRadius,
        }}
      >
        <span
          className="absolute left-5 font-semibold"
          style={{
            fontFamily: "Helvetica, sans-serif",
            fontSize: "4rem",
            lineHeight: 1,
            opacity: 0.9,
            background: NUMBER_GRADIENT1,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {number}
        </span>
      </div>

      <div className="p-5">
        <h3 className="text-base font-bold leading-tight text-gray-900">
          {title}
        </h3>
        <p className="mt-1 text-sm leading-snug text-gray-600">{description}</p>
      </div>
    </div>
  );
}
