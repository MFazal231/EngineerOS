import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EngineerOS",
  description: "Build the Engineer You Want to Become.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
