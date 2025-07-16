"use client";

import { useAppContext } from "@/app/context/AppContext";
import BlogTableItem from "@/components/blog/admin/BlogTableItem";
import Loading from "@/components/blog/Loading";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ListBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const { axios } = useAppContext();
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/blog/admin/listBlog");
      if (data.success) {
        setBlogs(data.blogs);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false); // stop loading
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  if (loading)
    return (
      <div className="flex-1 justify-between items-center h-screen w-full">
        <Loading />
      </div>
    );

  return (
    <div className="flex-1 pt-5">
      <h3 className="font-bold text-2xl">All Blogs</h3>
      <div className="relative mt-6 h-4/5 max-w-4xl overflow-x-auto shadow rounded-lg scrollbar-hide bg-base-300">
        <table className="w-full text-sm ">
          <thead className="text-xs text-left uppercase">
            <tr>
              <th scope="col" className="px-2 py-4 xl:px-6">
                #
              </th>
              <th scope="col" className="px-2 py-4 ">
                Title
              </th>
              <th scope="col" className="px-2 py-4 ">
                Date
              </th>
              <th scope="col" className="px-2 py-4 max-sm:hidden">
                Status
              </th>
              <th scope="col" className="px-2 py-4 max-sm:hidden">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog, index) => (
              <BlogTableItem
                key={blog._id}
                blog={blog}
                fetchBlogs={fetchBlogs}
                index={index + 1}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListBlog;
