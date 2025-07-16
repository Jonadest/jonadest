"use client";

import { useRouter } from "next/navigation";
import { useAppContext } from "@/app/context/AppContext";
import ThemeController from "./ThemeController";

const Navbar = () => {
  const { axios, token, setToken } = useAppContext();
  const router = useRouter();

  // Logout Function
  const logout = () => {
    localStorage.removeItem("token");
    axios.defaults.headers.common["Authorization"] = null;
    setToken(null);
    router.push("/blog"); // redirect to home
  };

  const handleLogoClick = () => {
    router.push(token ? "/blog/admin" : "/blog");
  };

  const handleAuthClick = () => {
    token ? logout() : router.push("/blog/admin");
  };

  return (
    <nav className="flex justify-between items-center py-3 px-8 shadow-lg w-full mx-auto sticky top-0 left-0 z-50 bg-base-100">
      {/* Logo (Small Screen) */}
      <button
        onClick={handleLogoClick}
        className="flex lg:hidden font-bold uppercase tracking-wider btn btn-ghost md:text-2xl cursor-pointer"
      >
        {token ? "Admin" : "JBC"}
      </button>

      {/* Logo (Large Screen) */}
      <button
        onClick={handleLogoClick}
        className="hidden lg:flex font-bold uppercase tracking-wider btn  text-xl cursor-pointer"
      >
        {token ? "Admin" : "JBC Blog"}
      </button>

      {/* Theme toggle */}
      <ThemeController />

      {/* Right Side Button / Icon (Large screen) */}
      <button
        onClick={handleAuthClick}
        className="hidden lg:flex items-center gap-2 rounded-full text-sm px-4 py-1 cursor-pointer"
        title={token ? "Logout" : "Login"}
      >
        {token ? (
          "Logout"
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6 cursor-pointer"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
        )}
      </button>

      {/* Right Side Button / Icon (Mobile screen) */}
      <button
        onClick={handleAuthClick}
        className="flex lg:hidden items-center gap-2 rounded-full text-sm cursor-pointer"
        title={token ? "Logout" : "Login"}
      >
        {token ? (
          "Logout"
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
        )}
      </button>
    </nav>
  );
};

export default Navbar;
