"use client";

import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import Loading from "@/components/blog/Loading";
import Comments from "@/components/blog/Comments";
import { useAppContext } from "@/app/context/AppContext";
import SingleBlog from "./SingleBlog";

// ✅ Define blog type
export interface BlogType {
  _id: string;
  title: string;
  subTitle: string;
  description: string;
  image: string;
  hashtags: string[];
  createdAt: string;
}

const SingleBlogPage = ({ id }: { id: string }) => {
  const { axios } = useAppContext();
  const [data, setData] = useState<BlogType | null>(null);

  const fetchBlogData = useCallback(async () => {
    try {
      const { data } = await axios.get(`/api/blog/${id}`);
      data.success ? setData(data.blog) : toast.error(data.message);
    } catch (error: any) {
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
