"use client";

import { useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import toast from "react-hot-toast";
import {
  FaFacebook,
  FaLinkedin,
  FaTwitter,
  FaWhatsapp,
  FaInstagram,
} from "react-icons/fa";
import { useAppContext } from "@/app/context/AppContext";

dayjs.extend(relativeTime);

const Comments = ({ slug }) => {
  const { axios } = useAppContext();
  const [blogData, setBlogData] = useState(null);
  const [comments, setComments] = useState([]);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [blogUrl, setBlogUrl] = useState("");

  const cleanedSlug = slug?.trim();

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blog/slug/${cleanedSlug}`,
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error("Failed to fetch blog data");

        const { blog } = await res.json();
        setBlogData(blog);

        const currentUrl = `${window.location.origin}/blog/${cleanedSlug}`;
        setBlogUrl(currentUrl);

        // Set meta description dynamically
        document.title = blog?.title || "Jonadest Blog";
        const metaDescription = document.querySelector(
          'meta[name="description"]'
        );
        if (metaDescription) {
          metaDescription.setAttribute(
            "content",
            blog?.subTitle || "Explore amazing tech content on Jonadest."
          );
        }

        // Optional: Set Open Graph meta for client-only pages
        const setMeta = (property, content) => {
          let tag = document.querySelector(`meta[property="${property}"]`);
          if (!tag) {
            tag = document.createElement("meta");
            tag.setAttribute("property", property);
            document.head.appendChild(tag);
          }
          tag.setAttribute("content", content);
        };

        setMeta("og:title", blog?.title);
        setMeta("og:description", blog?.subTitle || "");
        setMeta("og:image", blog?.image || "");
        setMeta("og:url", currentUrl);
        setMeta("og:type", "article");
      } catch (error) {
        console.error("Blog data fetch error:", error);
        toast.error("Could not load blog data.");
      }
    };

    if (cleanedSlug) fetchBlogData();
  }, [cleanedSlug]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await axios.post("/api/blog/comment/get", {
          blogId: blogData?._id,
        });

        if (data.success) {
          setComments(data.comments);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error?.message || "Failed to fetch comments.");
      }
    };

    if (blogData?._id) fetchComments();
  }, [axios, blogData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/blog/comment/add", {
        blog: blogData._id,
        name,
        content,
      });

      if (data.success) {
        toast.success(data.message);
        setComments((prev) => [
          ...prev,
          { name, content, createdAt: new Date() },
        ]);
        setName("");
        setContent("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.message || "Something went wrong.");
    }
  };

  const shareText = blogData
    ? encodeURIComponent(`${blogData.title} - ${blogData.subTitle}`)
    : "Check out this blog post!";
  const encodedUrl = encodeURIComponent(blogUrl);

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blogData?.title || "Jonadest Blog",
          text:
            blogData?.subTitle ||
            "I found this interesting blog post you might like",
          url: blogUrl,
        });
      } catch {
        toast.error("Could not share.");
      }
    } else {
      toast("Sharing not supported on this browser.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Comments Section */}
      <p className="pb-6">Comments ({comments.length})</p>

      <div className="flex flex-col gap-4 mb-6">
        {comments.map((item, index) => (
          <div key={item._id || index} className="card p-4 bg-base-100/50">
            <div className="flex justify-start items-start gap-3">
              <svg className="size-6" viewBox="0 0 24 24" fill="none">
                <path
                  d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <div className="flex flex-col w-full">
                <div className="flex justify-between items-start gap-1 w-full">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-gray-500">
                    {dayjs(item.createdAt).fromNow()}
                  </p>
                </div>
                <p className="text-sm">{item.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comment Form */}
      <p>
        <strong>Add your comment</strong>
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col items-start mt-3">
        <input
          type="text"
          className="input mb-3 w-full"
          placeholder="Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          placeholder="Comment"
          required
          className="input h-48 w-full p-2 mb-3"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit" className="btn">
          Submit
        </button>
      </form>

      {/* Share Buttons */}
      <div className="flex items-center items-center gap-3 my-6">
        <p>
          <strong>Share this article </strong>
        </p>

        <svg
          onClick={handleNativeShare}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6 md:size-12 bg-base-300 rounded-full p-1 md:p-2 cursor-pointer hover:bg-base-200 transition-colors"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
          />
        </svg>
      </div>
    </div>
  );
};

export default Comments;
