"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "@/app/context/AppContext";
import SingleBlogContent from "@/components/blog/SingleBlog";
import Loading from "@/components/blog/Loading";
import Comments from "@/components/blog/Comments";

export interface BlogType {
  _id: string;
  title: string;
  subTitle: string;
  description: string;
  image: string;
  createdAt: string;
  hashtags?: string[];
}

const SingleBlogPage = ({ id }: { id: string }) => {
  const { axios } = useAppContext();
  const [data, setData] = useState<BlogType | null>(null);

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const { data } = await axios.get(`/api/blog/${id}`);
        if (data.success) {
          setData(data.blog);
        } else {
          toast.error(data.message);
        }
      } catch (error: any) {
        toast.error(error?.message || "An error occurred.");
      }
    };

    if (id) fetchBlogData();
  }, [axios, id]);

  return data ? (
    <div>
      <SingleBlogContent props={data} />
      <Comments blogId={data._id} />
    </div>
  ) : (
    <Loading />
  );
};

export default SingleBlogPage;
