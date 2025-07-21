// app/blog/layout.tsx
import { Toaster } from "react-hot-toast";
import { AppProvider } from "../context/AppContext";
import Navbar from "@/components/blog/Navbar";
import { assets } from "../assests/blog/assets";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppProvider>
      <Toaster position="top-center" />
      <div
        className="min-h-screen w-full"
        style={{
          backgroundImage: `url('/gradientBackground.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Navbar />
        <main className="flex flex-col flex-1">{children}</main>
      </div>
    </AppProvider>
  );
}
