import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NetworkStatus from "./components/NetworkStatus";
import Header from "./components/Header";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const APP_NAME = "CharacTalk";
const APP_DEFAULT_TITLE = "CharacTalk";
const APP_TITLE_TEMPLATE = "%s - CharacTalk";
const APP_DESCRIPTION =
  "CharacTalk is an AI-powered roleplay chat platform where you can interact with dynamic characters and explore endless narratives powered by advanced AI language models.";

export const metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport = {
  themeColor: "#0F172A",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark `}
      >
        <NetworkStatus />
        <div className=" bg-linear-45 from-slate-900 from-20% to-[#CB6432] min-h-screen text-gray-100">
          <Header />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
