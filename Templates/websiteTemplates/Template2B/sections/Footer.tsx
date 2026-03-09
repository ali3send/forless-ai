type Props = {
  brandName: string;
};

export function Footer({ brandName }: Props) {
  return (
    <footer
      className="border-t"
      style={{
        borderColor:
          "color-mix(in srgb, var(--color-primary) 12%, transparent)",
      }}
    >
      <div className="mx-auto max-w-6xl px-6 py-6 text-center text-xs text-(--color-muted)">
        <span>
          © {new Date().getFullYear()} {brandName}. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
