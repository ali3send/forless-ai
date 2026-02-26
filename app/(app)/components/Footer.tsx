import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-10 text-center text-sm text-gray-400">
      © 2026 Forless
      <span className="mx-1.5">·</span>
      <Link
        href="#"
        className="text-gray-400 hover:text-gray-600 underline underline-offset-2"
      >
        Privacy Policy
      </Link>
    </footer>
  );
}
