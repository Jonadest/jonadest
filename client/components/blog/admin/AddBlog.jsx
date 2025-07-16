import { useEffect, useRef, useState } from "react";
import { assets, blogCategories } from "../../assets/assets";
import Quill from "quill";
import ImageUploader from "quill-image-uploader";
import "quill/dist/quill.snow.css";
import "quill-image-uploader/dist/quill.imageUploader.min.css";
import { useAppContext } from "../../../app/context/AppContext";
import toast from "react-hot-toast";
import Loading from "../../components/Loading";
import { parse } from "marked";

Quill.register("modules/imageUploader", ImageUploader);

const AddBlog = () => {
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [subTitle, setSubtitle] = useState("");
  const [category, setCategory] = useState(blogCategories[0] || "");
  const [isPublished, setIsPublished] = useState(false);
  const [hashtags, setHashtags] = useState([]);
  const [hashtagInput, setHashtagInput] = useState("");
  const [quillReady, setQuillReady] = useState(false);

  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const { axios } = useAppContext();

  const generateContent = async () => {
    if (!title) return toast.error("Please enter a title");
    if (!quillReady || !quillRef.current)
      return toast.error("Editor not ready yet. Please wait.");

    try {
      setLoading(true);
      const { data } = await axios.post("/api/blog/generate", {
        prompt: title,
      });
      if (data.success && data.content) {
        //quillRef.current.clipboard.dangerouslyPasteHTML(data.content);
        quillRef.current.root.innerHTML = parse(data.content);
        quillRef.current.update();
      } else {
        toast.error(data.message || "Failed to generate content.");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!quillRef.current) return toast.error("Editor not ready.");
    setIsAdding(true);
    try {
      const blog = {
        title,
        subTitle,
        description: quillRef.current.root.innerHTML,
        category,
        isPublished,
        hashtags,
      };
      const formData = new FormData();
      formData.append("blog", JSON.stringify(blog));
      if (image) formData.append("image", image);

      const { data } = await axios.post("/api/blog/add", formData);
      if (data.success) {
        toast.success(data.message);
        setTitle("");
        setSubtitle("");
        setCategory(blogCategories[0] || "");
        setImage(null);
        setHashtags([]);
        setHashtagInput("");
        quillRef.current.root.innerHTML = "";
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsAdding(false);
    }
  };

  const addHashtag = (e) => {
    e.preventDefault();
    const tag = hashtagInput.trim().replace(/^#/, "");
    if (tag && !hashtags.includes(tag)) {
      setHashtags([...hashtags, tag]);
    }
    setHashtagInput("");
  };

  const removeHashtag = (tagToRemove) => {
    setHashtags(hashtags.filter((tag) => tag !== tagToRemove));
  };

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            ["clean"],
          ],
          imageUploader: {
            upload: async (file) => {
              const formData = new FormData();
              formData.append("image", file);
              try {
                const res = await axios.post(
                  "/api/blog/upload-image",
                  formData
                );
                return res.data.url;
              } catch (err) {
                toast.error("Image upload failed");
                throw err;
              }
            },
          },
        },
      });
      setQuillReady(true);
    }
  }, [axios]);

  return (
    <form
      onSubmit={onSubmitHandler}
      className="relative bg-base-100/50 flex-1 h-full overflow-y-scroll"
    >
      <div className="bg-base-100 w-full max-w-3xl p-4 md:p-10 sm:m-10 shadow rounded">
        <p className="text-xs">Upload thumbnail</p>
        <label htmlFor="image">
          <img
            src={!image ? assets.upload_area : URL.createObjectURL(image)}
            alt="upload icon"
            className="mt-2 h-16 object-cover rounded"
          />
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            hidden
            required
          />
        </label>

        <p className="my-4">Blog Title</p>
        <input
          type="text"
          required
          placeholder="Type here"
          className="input mb-3"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />

        <p className="my-3">Subtitle</p>
        <input
          type="text"
          required
          placeholder="Type here"
          className="input mb-3"
          onChange={(e) => setSubtitle(e.target.value)}
          value={subTitle}
        />

        <p className="my-3">Blog Description</p>
        <div className=" max-w-lg h-74 pb-16 sm:pb-10 pt-2 relative shadow-lg">
          <div ref={editorRef} className="ql-editor max-w-full prose"></div>
          <button
            disabled={loading}
            type="button"
            onClick={generateContent}
            className="absolute bottom-1 right-2 ml-2 text-xs bg-base-300 px-4 py-1.5 rounded cursor-pointer hover:underline"
          >
            Generate with AI
          </button>
        </div>

        <p className="mt-6 text-sm mb-2">Hashtags</p>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {hashtags.map((tag, idx) => (
            <span
              key={idx}
              className="bg-base-300 px-2 py-1 rounded text-xs flex items-center gap-1"
            >
              #{tag}
              <button type="button" onClick={() => removeHashtag(tag)}>
                ✕
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={hashtagInput}
            onChange={(e) => setHashtagInput(e.target.value)}
            placeholder="Add hashtag (e.g. #react)"
            className="input flex-1"
          />
          <button
            type="button"
            onClick={addHashtag}
            className="btn bg-base-300"
          >
            Add
          </button>
        </div>

        <p className="mt-6 text-sm mb-2">Blog Category</p>
        <select
          onChange={(e) => setCategory(e.target.value)}
          value={category}
          name="category"
          className="select outline-none"
        >
          <option disabled value="">
            Select Category
          </option>
          {blogCategories.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-3 mt-4">
          <p className="text-sm">Publish Now</p>
          <input
            type="checkbox"
            className="checkbox cursor-pointer"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
          />
        </div>

        <button
          disabled={isAdding}
          type="submit"
          className="btn mt-3 bg-base-300"
        >
          {isAdding ? "Adding..." : "Add Blog"}
        </button>
      </div>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <Loading />
        </div>
      )}
    </form>
  );
};

export default AddBlog;
