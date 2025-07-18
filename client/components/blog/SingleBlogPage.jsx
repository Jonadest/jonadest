"use client";

import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import SingleBlog from "@/components/blog/SingleBlog";
import Loading from "@/components/blog/Loading";
import Comments from "@/components/blog/Comments";
import { useAppContext } from "@/app/context/AppContext";

const SingleBlogPage = ({ slug }) => {
  const { axios } = useAppContext();
  const [data, setData] = useState(null);

  const fetchBlogData = useCallback(async () => {
    try {
      const cleanedSlug = slug.trim(); // ✅ Fix newline or spaces
      const res = await axios.get(`/api/blog/slug/${cleanedSlug}`);
      if (res.data.success) {
        setData(res.data.blog);
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

  return data ? (
    <div>
      <SingleBlog blog={data} />
      <Comments blogId={data._id} />
    </div>
  ) : (
    <Loading />
  );
};

export default SingleBlogPage;
