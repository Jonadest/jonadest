"use client";

import { useAppContext } from "@/app/context/AppContext";
import Login from "@/components/blog/admin/Login";
import Sidebar from "@/components/blog/admin/Sidebar";

export default function AdminLayout({ children }) {
  const { token } = useAppContext();

  return !token ? (
    <Login />
  ) : (
    <div className="flex h-screen gap-6 w-full">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
