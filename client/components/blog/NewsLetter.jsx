"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "@/app/context/AppContext";

const NewsLetter = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { axios } = useAppContext(); // use axios from context or `import axios from "axios"`

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple client-side validation
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return toast.error("Please enter a valid email.");
    }

    try {
      setSubmitting(true);
      const { data } = await axios.post("/api/newsletter", { email });

      if (data.success) {
        toast.success("Subscribed successfully!");
        setEmail("");
      } else {
        toast.error(data.message || "Something went wrong.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Server error.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-base-300 p-8 rounded-lg text-center my-10">
      <h3 className="text-2xl font-bold">Never Miss a Blog!</h3>
      <p className="text-lg  my-2">
        Subscribe to our newsletter to stay updated on the latest blog posts.
      </p>
      <form
        onSubmit={handleSubmit}
        className="flex justify-center items-center gap-2 my-6"
      >
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input w-full max-w-sm"
          required
        />
        <button type="submit" className="btn" disabled={submitting}>
          {submitting ? "Subscribing..." : "Subscribe"}
        </button>
      </form>
    </div>
  );
};

export default NewsLetter;
