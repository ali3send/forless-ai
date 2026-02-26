import Image from "next/image";
import { TemplateCategory } from "../data/TemplateCategries";

const CARD = {
  width: 416,
  minHeight: 345,
  borderRadius: 24,
  borderWidth: 1,
  padding: 12,
  gap: 24,
} as const;

const TEMPLATE_IMAGE = {
  width: 392,
  height: 224,
  borderRadius: 12,
  borderWidth: 1,
} as const;

const SECTION_BELOW = {
  width: 392,
  minHeight: 73,
} as const;

export function TemplateCategoryCard({ id, title, image }: TemplateCategory) {
  return (
    <div
      className="group flex flex-col overflow-hidden bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
      style={{
        width: CARD.width,
        maxWidth: "100%",
        minHeight: CARD.minHeight,
        borderRadius: CARD.borderRadius,
        border: `${CARD.borderWidth}px solid #e5e7eb`,
        padding: CARD.padding,
        gap: CARD.gap,
      }}
    >
      {/* Template image — generic: pass image per card */}
      <div
        className="relative shrink-0 overflow-hidden bg-gray-100"
        style={{
          width: "100%",
          maxWidth: TEMPLATE_IMAGE.width,
          height: TEMPLATE_IMAGE.height,
          borderRadius: TEMPLATE_IMAGE.borderRadius,
          borderTopWidth: TEMPLATE_IMAGE.borderWidth,
          borderRightWidth: TEMPLATE_IMAGE.borderWidth,
          borderLeftWidth: TEMPLATE_IMAGE.borderWidth,
          borderBottomWidth: 0,
          borderStyle: "solid",
          borderColor: "#e5e7eb",
        }}
      >
        {image ? (
          <Image
            src={image}
            alt=""
            width={TEMPLATE_IMAGE.width}
            height={TEMPLATE_IMAGE.height}
            className="h-full w-full object-cover transition group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <span className="text-sm font-medium text-gray-400">Template</span>
          </div>
        )}
      </div>
      {/* Section below image: Fill 392px, Hug 73px */}
      <div
        className="flex flex-col"
        style={{
          width: "100%",
          maxWidth: SECTION_BELOW.width,
          minHeight: SECTION_BELOW.minHeight,
        }}
      >
        <p className="text-center text-sm font-semibold text-gray-900">
          {title}
        </p>
      </div>
    </div>
  );
}
