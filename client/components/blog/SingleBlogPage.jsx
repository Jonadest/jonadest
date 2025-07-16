"use client";

import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import SingleBlog from "@/components/blog/SingleBlog";
import Loading from "@/components/blog/Loading";
import Comments from "@/components/blog/Comments";
import { useAppContext } from "@/app/context/AppContext";

const SingleBlogPage = ({ id }) => {
  const { axios } = useAppContext();
  const [data, setData] = useState(null);

  const fetchBlogData = useCallback(async () => {
    try {
      const res = await axios.get(`/api/blog/${id}`);
      if (res.data.success) {
        setData(res.data.blog);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error?.message || "An error occurred.");
    }
  }, [axios, id]);

  useEffect(() => {
    if (id) fetchBlogData();
  }, [fetchBlogData, id]);

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
