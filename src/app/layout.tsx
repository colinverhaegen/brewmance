import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Brewmance",
  description: "Hinge meets Vivino for coffee — discover your perfect brew",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="mx-auto max-w-[430px] min-h-screen relative">
          {children}
        </div>
      </body>
    </html>
  );
}
