"use client";

import { useAppContext } from "@/app/context/AppContext";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loading from "@/components/blog/Loading";
import { useParams } from "next/navigation";
import BlogForm from "@/components/blog/admin/BlogForm";

const EditBlog = () => {
  const { axios } = useAppContext();
  const { slug } = useParams();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBlog = async () => {
    try {
      const { data } = await axios.get(`/api/blog/admin/edit-blog/${slug}`);
      if (data.success) {
        setBlog(data.blog);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to load blog.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="text-center mt-10 text-red-500 font-semibold">
        Blog not found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Blog</h1>
      <BlogForm blog={blog} mode="edit" />
    </div>
  );
};

export default EditBlog;
