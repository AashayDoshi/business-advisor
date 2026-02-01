import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business Advisory",
  description: "AI-powered business advisory platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
