import type { Metadata } from "next";
import { Faster_One, Geist_Mono, Roboto } from "next/font/google";
import "./globals.css";
import { SiteNav } from "@/components/SiteNav";
import { AuthProvider } from "@/lib/auth-context";

const fasterOne = Faster_One({
  variable: "--font-faster-one",
  weight: "400", // Faster One only ships one weight
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SoccerConnect",
  description: "Find, organize, and join local pickup soccer games.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fasterOne.variable} ${roboto.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <SiteNav />
          <main className="flex flex-1 flex-col">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
