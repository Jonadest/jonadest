import DOMPurify from "dompurify";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import { BlogType } from "./SingleBlogPage";

dayjs.extend(relativeTime);
dayjs.extend(utc);

const SingleBlog = ({ blog }: { blog: BlogType }) => {
  const date = dayjs(blog.createdAt);
  const formattedDate = date.format("MMMM D, YYYY");
  const formattedTime = date.format("h:mm A");
  const relativeTimeStr = date.fromNow();
  const utcTime = dayjs.utc(blog.createdAt).format("HH:mm [UTC]");

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
            __html: DOMPurify.sanitize(blog.title),
          }}
        />
        <p
          className="text-[18px] text-center"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(blog.subTitle),
          }}
        />

        {blog.hashtags && blog.hashtags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {blog.hashtags.map((tag, index) => (
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
          src={blog.image}
          alt="blog image"
          className=" h-[500px] object-cover rounded-lg"
        />
      </div>

      <div
        className="blog-content p-6 bg-base-200/50"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(blog.description),
        }}
      />
    </div>
  );
};

export default SingleBlog;
