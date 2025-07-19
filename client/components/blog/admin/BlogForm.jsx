"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "@/app/context/AppContext";

const BlogForm = ({ blog, mode = "edit" }) => {
  const { axios, setBlogs } = useAppContext();
  const [title, setTitle] = useState(blog?.title || "");
  const [content, setContent] = useState(blog?.content || "");
  const [tags, setTags] = useState(blog?.tags?.join(", ") || "");
  const [coverImage, setCoverImage] = useState(blog?.coverImage || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      toast.error("Title and content are required.");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        id: blog._id, // still using ID as per your preference
        title,
        content,
        tags: tags.split(",").map((tag) => tag.trim()),
        coverImage,
      };

      const { data } = await axios.put(
        "/api/blog/admin/edit-blog/" + blog.slug,
        payload
      );

      if (data.success) {
        toast.success("Blog updated!");
        // Optionally update blog list if needed
      } else {
        toast.error(data.message || "Failed to update blog.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Blog Title"
        className="w-full p-2 border rounded"
      />

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
        rows={10}
        className="w-full p-2 border rounded"
      />

      <input
        type="text"
        value={coverImage}
        onChange={(e) => setCoverImage(e.target.value)}
        placeholder="Cover Image URL"
        className="w-full p-2 border rounded"
      />

      <input
        type="text"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Tags (comma-separated)"
        className="w-full p-2 border rounded"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
};

export default BlogForm;
