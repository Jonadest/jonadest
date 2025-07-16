"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { CloudRain } from "lucide-react";
import WeatherWidget from "./WeatherWidget";
import Image from "next/image";
import logo from "@/app/icon.png";

export default function Navbar() {
  const [showWeather, setShowWeather] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);

  // Close mobile menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  // Lock scroll on mobile when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuOpen]);

  return (
    <>
      <div className="navbar bg-color1 shadow-sm sticky top-0 left-0 z-50 text-white max-w-full overflow-hidden">
        {/* Logo */}
        <div className="navbar-start">
          <Link href="/" className="text-xl ml-3">
            <Image src={logo} alt="Logo" width={40} height={40} priority />
          </Link>
        </div>

        {/* Weather Icon */}
        <div className="flex-1 flex justify-center lg:justify-end">
          <button
            onClick={() => setShowWeather(true)}
            className="p-2 rounded-full hover:bg-[#000c0f] transition lg:mr-4"
            aria-label="Show weather"
          >
            <CloudRain className="w-5 h-5" />
          </button>
        </div>

        {/* Desktop Nav */}
        <div className="navbar-end hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="#services">Services</Link>
            </li>
            <li>
              <Link href="#projects">Projects</Link>
            </li>
            <li>
              <Link href="#about">About Us</Link>
            </li>
            <li>
              <Link href="#contact">Contact Us</Link>
            </li>
            <li>
              <Link
                href="/blog"
                target="_blank"
                className="text-white bg-color2 hover:bg-[#000c0f]"
              >
                Blog
              </Link>
            </li>
          </ul>
        </div>

        {/* Mobile Button */}
        <div className="navbar-end lg:hidden z-50">
          <button
            ref={menuButtonRef}
            onClick={() => setMenuOpen(!menuOpen)}
            className="btn btn-ghost p-2 touch-action-manipulation active:scale-95 transition-transform"
            aria-label="Menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]">
          <div
            ref={menuRef}
            className="absolute top-16 right-0 w-3/4 max-w-sm h-[calc(100vh-4rem)] bg-color1 shadow-lg p-4 z-[101]"
          >
            <ul className="menu space-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "#services", label: "Services" },
                { href: "#projects", label: "Projects" },
                { href: "#about", label: "About Us" },
                { href: "#contact", label: "Contact Us" },
                { href: "/blog", label: "Blog", external: true },
              ].map(({ href, label, external }) => (
                <li key={label}>
                  <Link
                    href={href}
                    target={external ? "_blank" : undefined}
                    onClick={() => setMenuOpen(false)}
                    className={`py-3 text-lg ${
                      label === "Blog"
                        ? "text-white bg-color2 hover:bg-[#000c0f]"
                        : ""
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Weather Widget Modal */}
      <WeatherWidget
        visible={showWeather}
        onClose={() => setShowWeather(false)}
      />
    </>
  );
}
