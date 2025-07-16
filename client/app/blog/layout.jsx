import "../../app/globals.css";
import { Toaster } from "react-hot-toast";
import { AppProvider } from "../context/AppContext";
import Navbar from "@/components/blog/Navbar";
import { assets } from "../assests/blog/assets";

export const metadata = {
  metadataBase: new URL("https://www.jonadest.com"), // ✅ optional, sets the base for metadata URLs
};

export default function BlogLayout({ children }) {
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
