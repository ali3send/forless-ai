import { FeaturesData } from "../../template.types";

export function FeaturesSection({ title, features }: FeaturesData) {
  return (
    <section
      id="features"
      className="w-full"
      style={{
        background: "var(--color-surface)",
        borderTop: "1px solid #e5e7eb",
      }}
    >
      <div
        className="mx-auto flex flex-col"
        style={{
          width: "100%",
          maxWidth: 918,
          height: 375,
          paddingTop: 81,
          paddingRight: 32,
          paddingLeft: 32,
        }}
      >
        <h2
          className="text-center"
          style={{
            color: "var(--color-text)",
            fontWeight: 700,
            fontSize: 30,
            letterSpacing: 0.4,
            textAlign: "center",
            marginBottom: 40,
          }}
        >
          {title}
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, i) => (
            <div
              key={i}
              className="rounded-lg border p-6"
              style={{
                backgroundColor: "#FFFFFF",
                borderColor: "#e5e7eb",
              }}
            >
              <div
                className="font-bold"
                style={{
                  color: "var(--color-primary, #0149E1)",
                  fontSize: 18,
                  marginBottom: 8,
                }}
              >
                {feature.label}
              </div>

              <p
                className="text-sm"
                style={{
                  color: "var(--color-muted)",
                  fontSize: 14,
                  lineHeight: 1.5,
                }}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
