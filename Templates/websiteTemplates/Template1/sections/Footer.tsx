// components/website/sections/Footer.tsx

type Props = {
  brandName: string;
};

export function Footer({ brandName }: Props) {
  return (
    <footer className="border-t border-secondary-dark">
      <div className="mx-auto max-w-5xl px-4 py-4 text-xs text-secondary-soft flex items-center justify-between">
        <span>
          © {new Date().getFullYear()} {brandName}. All rights reserved.
        </span>

        <nav className="flex gap-4 text-text">
          <a href="#about" className=" transition">
            About
          </a>
          <a href="#contact" className="">
            Contact
          </a>
          <a href="#" className=" transition">
            Privacy
          </a>
        </nav>
      </div>
    </footer>
  );
}
