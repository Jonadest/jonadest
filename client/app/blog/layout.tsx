// app/layout.tsx
import "../../app/globals.css";
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { AppProvider } from "../context/AppContext";
import Navbar from "@/components/blog/Navbar";
import { assets } from "../assests/blog/assets";

const ogImageUrl =
  typeof assets.socialShareImage === "string"
    ? assets.socialShareImage
    : assets.socialShareImage?.src ||
      "https://ik.imagekit.io/jonadest/Samples/og-image.jpg";

export const metadata: Metadata = {
  title: "Jonadest || Blog",
  description:
    "Welcome to Jonadest Blog – Explore the latest in tech, tutorials, and affiliate insights.",
  openGraph: {
    title: "Jonadest Blog",
    description:
      "Explore trending tech content, tutorials, and affiliate tips on Jonadest Blog.",
    url: "https://www.jonadest.com/blog",
    siteName: "Jonadest Blog",
    images: [
      {
        url:
          ogImageUrl || "https://ik.imagekit.io/jonadest/Samples/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Jonadest Blog Banner",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jonadest Blog",
    description:
      "Explore trending tech content, tutorials, and affiliate tips on Jonadest Blog.",
    images: [
      ogImageUrl || "https://ik.imagekit.io/jonadest/Samples/og-image.jpg",
    ],
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className="min-h-screen w-full"
        style={{
          backgroundImage: `url(${assets.gradientBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <AppProvider>
          <Toaster position="top-center" />
          <Navbar />
          <main className="flex flex-col flex-1">{children}</main>
        </AppProvider>
      </body>
    </html>
  );
}
