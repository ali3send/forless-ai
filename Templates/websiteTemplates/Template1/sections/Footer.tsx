type Props = {
  brandName: string;
};

export function Footer({ brandName }: Props) {
  return (
    <footer
      className="border-t"
      style={{
        borderColor:
          "color-mix(in srgb, var(--color-primary) 10%, transparent)",
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 text-xs text-(--color-muted)">
        <span>
          © {new Date().getFullYear()} {brandName}
        </span>
        <a href="#" className="transition hover:text-text">
          Privacy Policy
        </a>
      </div>
    </footer>
  );
}
