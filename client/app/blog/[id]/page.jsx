"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import SinglePage from "@/components/blog/SinglePage";
import Comments from "@/components/blog/Comments";
import Loading from "@/components/blog/Loading";
import { useAppContext } from "@/app/context/AppContext";

const BlogPage = () => {
  const { axios } = useAppContext();
  const params = useParams();
  const id = params?.id;

  const [data, setData] = useState(null);

  const fetchBlogData = useCallback(async () => {
    try {
      const { data } = await axios.get(`/api/blog/${id}`);
      data.success ? setData(data.blog) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  }, [axios, id]);

  useEffect(() => {
    if (id) fetchBlogData();
  }, [fetchBlogData, id]);

  return data ? (
    <div>
      <SinglePage props={data} />
      <Comments blogId={data._id} />
    </div>
  ) : (
    <Loading />
  );
};

export default BlogPage;
