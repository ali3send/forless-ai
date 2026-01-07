function ModerationRow({
  label,
  value,
  href,
  danger,
  muted,
}: {
  label: string;
  value: number | string;
  href?: string;
  danger?: boolean;
  muted?: boolean;
}) {
  const Wrapper = href ? "a" : "div";

  return (
    <Wrapper
      href={href}
      className={`
        flex items-center justify-between
        rounded-md px-3 py-2 text-sm
        ${muted ? "text-secondary" : "text-secondary-darker"}
        ${href ? "hover:bg-secondary-fade/40" : ""}
      `}
    >
      <span>{label}</span>

      <span
        className={`
          font-medium
          ${danger ? "text-accent" : "text-(--color-secondary-darker)"}
        `}
      >
        {value}
      </span>
    </Wrapper>
  );
}

export default ModerationRow;
