import "./globals.css";
import type { Metadata } from "next";
import { AuthProvider } from "./providers";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "ForlessAI",
  description: "AI-powered website builder with Supabase auth",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-black antialiased">
        <AuthProvider>{children}</AuthProvider>

        <Toaster
          richColors
          position="top-center"
          toastOptions={{
            classNames: {
              /* destructive / danger */
              actionButton: "!bg-red-600 !text-white hover:!bg-red-600/90 ",
              /* cancel / neutral */
              cancelButton: "!bg-secondary !text-text hover:!bg-secondary/90",
              toast:
                "!bg-secondary-darker/90 !border !border-secondary-fade !text-text",
              title: "!text-text",
              description: "!text-text-muted",
            },
          }}
        />
      </body>
    </html>
  );
}
