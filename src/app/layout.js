import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AroundU | Anonymous Nearby Chat & Stranger Network",
  description: "AroundU is a lightning-fast, private, and secure anonymous chat network for spontaneous conversations, romantic flirts, and local discovery. No login, no traces.",
  keywords: "anonymous chat, adult chat, sext chat, romantic chat, dirty talk, anonymous sexting, stranger chat adult, flirty chat, midnight talk, secret chat, private adult chat, indian sexting, rr chat, nearby friends, location based chat, AroundU, private messaging, indian chat, meet people nearby, random chat india, free anonymous chat, anonymous social network, private chat rooms, spontaneous chat, naughty chat, dating chat",
  authors: [{ name: "AroundU Team" }],
  icons: {
    icon: '/favicon.png',
  },
  verification: {
    google: 'WuIDm4AD58RR3yLHHLdWspI8cyzCrFZSUojggeNejic',
  },
  other: {
    'sitemap': 'https://around-u-frontend.vercel.app/sitemap.xml',
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
