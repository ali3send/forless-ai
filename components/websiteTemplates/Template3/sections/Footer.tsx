type Props = {
  brandName: string;
};

export function Footer({ brandName }: Props) {
  return (
    <footer>
      <div className="mx-auto max-w-3xl px-4 py-20">
        <div className="flex flex-col gap-4 text-xs text-(--color-muted)">
          <span>
            © {new Date().getFullYear()}{" "}
            <span className="font-medium text-text">{brandName}</span>
          </span>

          <span>
            Built with care by{" "}
            <span className="font-medium text-text">ForlessAI</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
