import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import Providers from "@/components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  styles: ["normal", "italic"],
});

export const metadata = {
  title: {
    default: "Uttoron — Govt job exam prep",
    template: "%s | Uttoron",
  },
  description:
    "Practice past questions from NTRCA, BCS and other Bangladesh government exams with selectable options and toggleable explanations.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="h-full min-h-full bg-background font-sans text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
