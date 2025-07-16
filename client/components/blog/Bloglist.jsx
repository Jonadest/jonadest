import { useState } from "react";
import BlogCard from "./BlogCard";
import { useAppContext } from "@/app/context/AppContext";
import { blogCategories } from "../../app/assests/blog/assets";

const Bloglist = () => {
  const [menu, setMenu] = useState("All");
  const { blogs, input } = useAppContext();

  const filteredBlogs = () => {
    if (input === "") return blogs;

    return blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(input.toLowerCase()) ||
        blog.category.toLowerCase().includes(input.toLowerCase())
    );
  };

  const categories = [...blogCategories];

  return (
    <div>
      <ul className="flex justify-center items-center mx-auto gap-y-2 my-6 lg:gap-x-3 flex-wrap">
        {categories.map((list, index) => (
          <li
            onClick={() => setMenu(list)}
            key={index}
            className={`cursor-pointer ${
              menu === list ? "btn px-4 py-0" : ""
            } rounded-full mx-2 text-xs lg:text-[14px] relative`}
          >
            {list}
          </li>
        ))}
      </ul>

      <div className="grid grid-cols-1 lg:grid-cols-4 lg:px-[150px] gap-2 lg:gap-4">
        {filteredBlogs()
          .filter((blog) => (menu === "All" ? true : blog.category === menu))
          .map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}

        {filteredBlogs().length === 0 && (
          <p className="text-center text-gray-500 col-span-full">
            Fetching Blogs Data...
          </p>
        )}
      </div>
    </div>
  );
};

export default Bloglist;
