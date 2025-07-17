"use client";

import { useRouter } from "next/navigation";

const BlogCard = ({ blog }) => {
  const { title, subTitle, category, image, slug } = blog;
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/blog/${slug}`)}
      className="w-full max-w-xs mx-auto rounded-xl overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-xl cursor-pointer"
    >
      <div
        className="h-48 w-full bg-center bg-contain bg-no-repeat"
        style={{ backgroundImage: `url(${image})` }}
      ></div>

      <div className="p-4 shadow-md bg-base-100">
        <span className="inline-block bg-base-200 text-xs text-base-content px-3 py-1 rounded-full uppercase tracking-wide">
          {category}
        </span>
        <h3 className="text-lg font-bold text-base-content line-clamp-2">
          {title}
        </h3>
        <p className="text-sm text-base-content/80 line-clamp-2">{subTitle}</p>
      </div>
    </div>
  );
};

export default BlogCard;
