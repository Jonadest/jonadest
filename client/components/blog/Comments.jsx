"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function Comments() {
  const params = useParams();
  const slug = params?.slug;

  const [comments, setComments] = useState([]);
  const [blog, setBlog] = useState(null); // stores blog details (like title, etc.)
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch blog and its comments
  useEffect(() => {
    if (!slug) return;

    const fetchBlog = async () => {
      try {
        const { data } = await axios.get(`/api/blog/${slug}`);
        if (data.success) {
          setBlog(data.blog);
        } else {
          toast.error("Failed to load blog");
        }
      } catch (error) {
        toast.error("Error loading blog");
      }
    };

    const fetchComments = async () => {
      try {
        const { data } = await axios.post("/api/blog/comment", { slug });
        if (data.success) {
          setComments(data.comments);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Failed to load comments");
      }
    };

    fetchBlog();
    fetchComments();
  }, [slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !content) {
      toast.error("Please fill out all fields");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post("/api/blog/add-comment", {
        slug,
        name,
        content,
      });

      if (data.success) {
        toast.success(data.message || "Comment submitted!");
        setName("");
        setContent("");
      } else {
        toast.error(data.message || "Failed to submit comment");
      }
    } catch (err) {
      toast.error("Error submitting comment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12">
      <h3 className="text-xl font-semibold mb-4">Leave a Comment</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input mb-3 w-full"
        />
        <textarea
          placeholder="Your comment"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="input h-48 w-full p-2 mb-3"
        />
        <button
          type="submit"
          disabled={!slug || loading}
          className="bg-black text-white px-4 py-2 rounded-md hover:opacity-80 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>

      <div className="mt-10">
        <h4 className="text-lg font-medium mb-2">Comments</h4>
        {comments.length === 0 && (
          <p className="text-gray-500">No comments yet.</p>
        )}
        {comments.map((comment) => (
          <div key={comment._id} className="mb-4 border-b pb-2">
            <p className="font-semibold">{comment.name}</p>
            <p className="text-sm text-gray-600">
              {dayjs(comment.createdAt).fromNow()}
            </p>
            <p>{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
