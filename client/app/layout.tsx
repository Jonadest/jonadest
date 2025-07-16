import "./globals.css";
import Footer from "@/components/Footer";
import { Poppins, Sour_Gummy } from "next/font/google";
import type { Metadata } from "next";
import { AppProvider } from "./context/AppContext";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const sourGummy = Sour_Gummy({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-sourgummy",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jonadest Tech",
  description:
    "Your go-to tech agency for software, printing, marketing, and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${sourGummy.variable}`}>
      <body className="bg-base-100 text-base-content">
        <AppProvider>
          <main className="min-h-[80vh]">{children}</main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
