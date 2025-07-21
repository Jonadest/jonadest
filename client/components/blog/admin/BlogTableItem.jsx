"use client";

import { useAppContext } from "@/app/context/AppContext";
import toast from "react-hot-toast";
import Link from "next/link";
import { useState } from "react";
import { FaThumbsDown, FaThumbsUp } from "react-icons/fa";

const BlogTableItem = ({ blog, index }) => {
  const { title, createdAt, slug } = blog;
  const BlogDate = new Date(createdAt);

  const { axios, setBlogs } = useAppContext();
  const [loading, setLoading] = useState(false);

  const deleteBlog = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog?"
    );
    if (!confirmDelete) return;

    setLoading(true);
    try {
      const { data } = await axios.post("/api/blog/delete", {
        id: blog._id,
      });

      if (data.success) {
        toast.success(data.message);
        setBlogs((prev) => prev.filter((b) => b._id !== blog._id));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete blog.");
    } finally {
      setLoading(false);
    }
  };

  const togglePublish = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/blog/toggle-publish", {
        id: blog._id,
      });

      if (data.success) {
        toast.success(data.message);
        setBlogs((prev) =>
          prev.map((b) =>
            b._id === blog._id ? { ...b, isPublished: !b.isPublished } : b
          )
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to update blog status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <tr className="border-y border-base-300">
      <th className="px-2 py-4">{index}</th>

      <td
        className="px-2 py-4 max-w-[150px] sm:max-w-[200px] md:max-w-xs truncate"
        title={title}
      >
        {title}
      </td>

      <td className="hidden md:inline-block px-2 py-4">
        {BlogDate.toDateString()}
      </td>

      <td className="px-2 py-4 max-sm:hidden">
        <p className={blog.isPublished ? "text-green-600" : "text-orange-600"}>
          {blog.isPublished ? "Published" : "Unpublished"}
        </p>
      </td>

      <td className="flex px-2 py-4 gap-3 items-center ">
        <button
          onClick={togglePublish}
          disabled={loading}
          className="hidden md:inline-block border px-2 py-0.5 rounded text-sm disabled:opacity-50"
        >
          {blog.isPublished ? "Unpublish" : "Publish"}
        </button>

        <button
          onClick={togglePublish}
          disabled={loading}
          className="md:hidden text-sm disabled:opacity-50 mr-3"
        >
          {blog.isPublished ? (
            <FaThumbsUp size={16} className="text-green-600" />
          ) : (
            <FaThumbsDown size={16} className="text-red-600" />
          )}
        </button>

        <Link
          href={`/blog/admin/edit-blog/${slug}`}
          className="hidden md:inline-block border px-2 py-0.5 rounded text-sm text-blue-600 hover:underline"
        >
          Edit
        </Link>

        <svg
          onClick={deleteBlog}
          title="Delete blog"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={`size-6 cursor-pointer text-red-600 ${
            loading && "opacity-50 pointer-events-none"
          }`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      </td>
    </tr>
  );
};

export default BlogTableItem;
