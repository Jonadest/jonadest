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
      <div className="flex flex-col my-6">
        <p className="mb-2">
          <strong>Share this article on social media</strong>
        </p>
        <div className="flex gap-4 flex-wrap items-center">
          <button
            onClick={() =>
              window.open(
                `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
                "_blank"
              )
            }
            title="Share on Facebook"
            className="social-share-btn"
          >
            <FaFacebook size={24} />
          </button>
          <button
            onClick={() =>
              window.open(
                `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${shareText}`,
                "_blank"
              )
            }
            title="Share on LinkedIn"
            className="social-share-btn"
          >
            <FaLinkedin size={24} />
          </button>
          <button
            onClick={() =>
              window.open(
                `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${shareText}`,
                "_blank"
              )
            }
            title="Share on Twitter"
            className="social-share-btn"
          >
            <FaTwitter size={24} />
          </button>
          <button
            onClick={() =>
              window.open(
                `https://wa.me/?text=${shareText}%20${encodedUrl}`,
                "_blank"
              )
            }
            title="Share via WhatsApp"
            className="social-share-btn"
          >
            <FaWhatsapp size={24} />
          </button>
          <button
            onClick={() => window.open("https://www.instagram.com/", "_blank")}
            title="View on Instagram"
            className="social-share-btn"
          >
            <FaInstagram size={24} />
          </button>
          <button
            className="btn btn-sm bg-base-300 hover:bg-base-200"
            onClick={handleNativeShare}
          >
            📱 Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default Comments;
