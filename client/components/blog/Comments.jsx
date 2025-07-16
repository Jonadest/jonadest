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
import { useParams } from "next/navigation";
import { useAppContext } from "@/app/context/AppContext";
import { assets } from "@/app/asset/blog/assets";

dayjs.extend(relativeTime);

const Comments = () => {
  const { axios } = useAppContext();
  const { id } = useParams();

  const [comments, setComments] = useState([]);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [blogUrl, setBlogUrl] = useState("");
  const shareText = encodeURIComponent("Check out this blog post!");

  // Handle blog URL on client side only
  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/blog/${id}`;
      setBlogUrl(url);
    }
  }, [id]);

  const encodedUrl = encodeURIComponent(blogUrl);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await axios.post("/api/blog/comment", { blogId: id });
        if (data.success) {
          setComments(data.comments);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    if (id) fetchComments();
  }, [axios, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/blog/add-comment", {
        blog: id,
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
      toast.error(error.message);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this blog post!",
          text: "I found this interesting blog post you might like",
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
      <p className="pb-6">Comments ({comments.length})</p>

      {/* Comment List */}
      <div className="flex flex-col gap-4 mb-6">
        {comments.map((item, index) => (
          <div key={item._id || index} className="card p-4 bg-base-100/50">
            <div className="flex justify-start items-start gap-3">
              <img src={assets.user_icon} alt="avatar" className="w-6" />
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

      {/* Add Comment Form */}
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
          name="Comment"
          placeholder="Comment"
          required
          className="input h-48 w-full p-2 mb-3"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <button type="submit" className="btn">
          Submit
        </button>
      </form>

      {/* Share Section */}
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
