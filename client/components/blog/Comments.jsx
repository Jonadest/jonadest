"use client";

import { useEffect, useState } from "react";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppContext } from "@/app/context/AppContext";
import { assets } from "@/app/assests/blog/assets";

dayjs.extend(relativeTime);

const Comments = () => {
  const { axios } = useAppContext();
  const { slug } = useParams();

  const [comments, setComments] = useState([]);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");

  // Fetch comments using slug
  useEffect(() => {
    const fetchComments = async () => {
      if (!slug) return;

      try {
        const cleanedSlug = slug.replace(/^:/, "");
        const { data } = await axios.post("/api/blog/comment", {
          slug: cleanedSlug,
        });

        if (data.success) {
          setComments(data.comments);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message || "Failed to fetch comments.");
      }
    };

    fetchComments();
  }, [axios, slug]);

  // Submit a new comment
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !content) {
      toast.error("All fields are required");
      return;
    }

    try {
      const cleanedSlug = slug.replace(/^:/, "");

      const { data } = await axios.post("/api/blog/add-comment", {
        slug: cleanedSlug,
        name,
        content,
      });

      if (data.success) {
        toast.success(data.message);
        setName("");
        setContent("");

        // Refresh comments after successful submission
        const res = await axios.post("/api/blog/comment", {
          slug: cleanedSlug,
        });
        setComments(res.data.comments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to add comment");
    }
  };

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold mb-4">Comments</h2>

      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment._id} className="bg-gray-100 p-4 rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <img
                  src={assets.avatar}
                  alt="avatar"
                  className="w-8 h-8 rounded-full"
                />
                <span className="font-semibold">{comment.name}</span>
                <span className="text-gray-500 text-sm">
                  {dayjs(comment.createdAt).fromNow()}
                </span>
              </div>
              <p className="text-gray-700">{comment.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No comments yet.</p>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded-md p-2"
        />
        <textarea
          placeholder="Add a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border rounded-md p-2"
          rows={4}
        ></textarea>
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded-md hover:opacity-80 disabled:opacity-50"
          disabled={!blogData?.slug}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Comments;
