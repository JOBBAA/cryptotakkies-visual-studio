import type { Metadata } from "next";
import localFont from "next/font/local";
import { Gochi_Hand } from "next/font/google";
import "./globals.css";

const eduFavorit = localFont({
  src: [
    { path: "../../public/fonts/EduFavorit-Regular.otf", weight: "400", style: "normal" },
    { path: "../../public/fonts/EduFavorit-Medium.otf", weight: "500", style: "normal" },
    { path: "../../public/fonts/EduFavorit-Bold.otf", weight: "700", style: "normal" },
    { path: "../../public/fonts/EduFavorit-RegularItalic.otf", weight: "400", style: "italic" },
    { path: "../../public/fonts/EduFavorit-MediumItalic.otf", weight: "500", style: "italic" },
    { path: "../../public/fonts/EduFavorit-BoldItalic.otf", weight: "700", style: "italic" },
  ],
  variable: "--font-inter",
});

const abcFavorit = localFont({
  src: "../../public/fonts/ABCFavorit-Ultra-Trial.otf",
  weight: "900",
  variable: "--font-outfit",
});

const gochiHand = Gochi_Hand({
  weight: "400",
  variable: "--font-gochi",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cryptotakkies Visual Generator",
  description: "B2B On-Brand Visual Content Generator powered by AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${eduFavorit.variable} ${abcFavorit.variable} ${gochiHand.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
