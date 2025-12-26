// components/website/sections/Footer.tsx

type Props = {
  brandName: string;
};

export function Footer({ brandName }: Props) {
  return (
    <footer className="border-t border-secondary-dark">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 text-xs text-secondary-soft">
        <span>
          © {new Date().getFullYear()} {brandName}
        </span>
        <span>Made with ❤️ by ForlessAI</span>
      </div>
    </footer>
  );
}
