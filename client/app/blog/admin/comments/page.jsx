"use client";

import { useAppContext } from "@/app/context/AppContext";
import CommentsTableItems from "@/components/blog/admin/CommentsTableItems";
import Loading from "@/components/blog/Loading";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ListBlog = () => {
  const { axios } = useAppContext();

  const [comments, setComments] = useState([]);
  const [filter, setFilter] = useState("Not Approved");
  const [loading, setLoading] = useState(true); // ✅ track loading state

  const fetchComments = async () => {
    try {
      setLoading(true); // start loading
      const { data } = await axios.get("/api/blog/admin/comments");
      if (data.success) {
        setComments(data.comments);
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
    fetchComments();
  }, []);

  if (loading)
    return (
      <div className="flex-1 justify-between items-center h-screen w-full">
        <Loading />
      </div>
    );

  return (
    <div className="flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 bg-base-300/50">
      <div className="flex justify-between items-center max-w-3xl flex-wrap gap-2">
        <h3 className="font-bold md:text-2xl">Comments</h3>
        <div className="flex gap-2 sm:gap-4">
          <button
            onClick={() => setFilter("Approved")}
            className={`shadow-lg border rounded-full px-2 py-1 text-[10px] sm:px-4 sm:py-1 sm:text-xs cursor-pointer ${
              filter === "Approved" ? "text-gray-400" : "text-green-600"
            }`}
          >
            Approved
          </button>

          <button
            onClick={() => setFilter("Not Approved")}
            className={`shadow-lg border rounded-full px-2 py-1 text-[10px] sm:px-4 sm:py-1 sm:text-xs cursor-pointer ${
              filter === "Not Approved" ? "text-gray-400" : "text-green-600"
            }`}
          >
            Not Approved
          </button>
        </div>
      </div>

      <div className="relative h-4/5 max-w-3xl overflow-x-auto mt-4 bg-base-300 shadow rounded-lg scrollbar-hide">
        <table className="w-full text-sm">
          <thead className="text-xs text-left uppercase">
            <tr>
              <th className="px-3 py-3">Blog Title & Comment</th>
              <th className="px-6 py-3 max-sm:hidden">Date</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {comments
              .filter((comment) =>
                filter === "Approved" ? comment.isApproved : !comment.isApproved
              )
              .map((comment, index) => (
                <CommentsTableItems
                  key={comment._id}
                  comment={comment}
                  index={index + 1}
                  fetchComments={fetchComments} // ✅ fixed typo here
                />
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListBlog;
