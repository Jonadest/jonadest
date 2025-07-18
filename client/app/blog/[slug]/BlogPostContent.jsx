"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import DOMPurify from "dompurify";
import { useAppContext } from "@/app/context/AppContext";
import Comments from "@/components/blog/Comments";

dayjs.extend(relativeTime);
dayjs.extend(utc);

export default function BlogPostContent({ slug }) {
  const { axios } = useAppContext();
  const [data, setData] = useState(null);
  const [cleanContent, setCleanContent] = useState("");
  const blogContentRef = useRef(null);

  const fetchBlogData = useCallback(async () => {
    try {
      const res = await axios.get(`/api/blog/slug/${slug}`);
      if (res.data.success) {
        const blog = res.data.blog;
        setData(blog);

        const raw = DOMPurify.sanitize(blog.description);
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = raw;

        const links = tempDiv.querySelectorAll("a");
        links.forEach((a) => {
          a.setAttribute("target", "_blank");
          a.setAttribute("rel", "noopener noreferrer");
        });

        setCleanContent(tempDiv.innerHTML);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error?.message || "An error occurred.");
    }
  }, [axios, slug]);

  useEffect(() => {
    if (slug) fetchBlogData();
  }, [fetchBlogData, slug]);

  if (!data) return <p className="text-center mt-10">Loading...</p>;

  const date = dayjs(data.createdAt);
  const formattedDate = date.format("MMMM D, YYYY");
  const formattedTime = date.format("h:mm A");
  const relativeTimeStr = date.fromNow();
  const utcTime = dayjs.utc(data.createdAt).format("HH:mm [UTC]");

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10">
      <header className="text-center mb-6 lg:px-[30px] ">
        <p className="text-xs text-gray-500">
          Published on {formattedDate} at {formattedTime} ({relativeTimeStr}) |{" "}
          {utcTime}
        </p>
        <h1
          className="text-[45px] font-bold leading-14 py-6"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(data.title),
          }}
        ></h1>
        <p
          className="text-[18px] text-center"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(data.subTitle),
          }}
        ></p>

        {data.hashtags?.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {data.hashtags.map((tag, index) => (
              <span
                key={index}
                className="text-xs btn btn-outline px-2 py-1 rounded-md"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <p className="text-[10px] lg:text-[12px] py-1 px-2 my-3 border-[1px] rounded-md inline-block">
          Jonadest Tech
        </p>
      </header>

      <div className="cover-image flex justify-center">
        <img
          src={data.image}
          alt="blog image"
          className="h-[500px] object-cover rounded-lg"
        />
      </div>

      <div
        ref={blogContentRef}
        className="blog-content p-6 bg-base-200/50"
        dangerouslySetInnerHTML={{ __html: cleanContent }}
      />

      <Comments blogId={data._id} />
    </div>
  );
}
