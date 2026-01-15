type Props = {
  brandName: string;
};

export function Footer({ brandName }: Props) {
  return (
    <footer
      className="border-t"
      style={{
        borderColor:
          "color-mix(in srgb, var(--color-primary) 15%, transparent)",
        background:
          "linear-gradient(180deg, var(--color-bg), color-mix(in srgb, var(--color-bg) 85%, black))",
      }}
    >
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Left */}
          <span className="text-xs text-(--color-muted)">
            © {new Date().getFullYear()}{" "}
            <span className="font-medium text-text">{brandName}</span>
          </span>

          {/* Right */}
          <span className="text-xs text-(--color-muted)">
            Made with{" "}
            <span className="mx-0.5" aria-hidden>
              ❤️
            </span>{" "}
            by <span className="font-medium text-text">ForlessAI</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
