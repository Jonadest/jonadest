"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAppContext } from "@/app/context/AppContext";
import Loading from "@/components/blog/Loading";
import BlogTableItem from "@/components/blog/admin/BlogTableItem";

const Dashboard = () => {
  const router = useRouter();
  const { axios } = useAppContext();

  const [dashboardData, setDashboardData] = useState({
    blogs: 0,
    comments: 0,
    drafts: 0,
    recentBlogs: [],
  });

  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/blog/admin/blog");
      data.success
        ? setDashboardData(data.dashboardData)
        : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 justify-between items-center h-screen w-full">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-10 bg-base-100">
      <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-6  gap-2 md:gap-4">
        {/* Blogs */}
        <div
          onClick={() => router.push("/blog/admin/listBlog")}
          className="flex items-center gap-4 bg-base-200 p-4 rounded shadow cursor-pointer hover:scale-105 transition-all"
        >
          <svg
            className="hidden md:inline-block size-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
            />
          </svg>
          <div>
            <p className="font-bold">{dashboardData.blogs}</p>
            <p className="text-sm">Blogs</p>
          </div>
        </div>

        {/* Comments */}
        <div
          onClick={() => router.push("/blog/admin/comments")}
          className="flex items-center gap-2 md:gap-4 bg-base-200 p-4 rounded shadow cursor-pointer hover:scale-105 transition-all"
        >
          <svg
            className="hidden md:inline-block size-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
            />
          </svg>
          <div>
            <p className="font-bold">{dashboardData.comments}</p>
            <p className="text-sm">Comments</p>
          </div>
        </div>

        {/* Drafts */}
        <div
          onClick={() => router.push("/blog/admin/drafts")}
          className="flex items-center gap-2 md:gap-4 bg-base-200 p-4 rounded shadow hover:scale-105 transition-all"
        >
          <svg
            className="hidden md:inline-block size-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            />
          </svg>
          <div>
            <p className="font-bold">{dashboardData.drafts}</p>
            <p className="text-sm">Drafts</p>
          </div>
        </div>
      </div>

      {/* Recent Blogs Table */}
      <div className="mt-12">
        <div className="flex items-center gap-2 pb-6">
          <svg
            className="size-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819"
            />
          </svg>
          <h3 className="font-bold text-2xl">Dashboard</h3>
        </div>
      </div>

      <div className="relative max-w-4xl overflow-x-auto shadow rounded-lg scrollbar-hide bg-base-300">
        <table className="w-full text-sm">
          <thead className="text-xs text-left uppercase">
            <tr>
              <th className="px-2 py-4 xl:px-6">#</th>
              <th className="px-2 py-4">Title</th>
              <th className="px-2 py-4">Date</th>
              <th className="px-2 py-4 max-sm:hidden">Status</th>
              <th className="px-2 py-4 max-sm:hidden">Actions</th>
            </tr>
          </thead>
          <tbody>
            {dashboardData.recentBlogs.map((blog, index) => (
              <BlogTableItem
                key={blog._id}
                blog={blog}
                fetchBlogs={fetchDashboard}
                index={index + 1}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
