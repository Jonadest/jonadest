"use client";

import { useAppContext } from "@/app/context/AppContext";
import Bloglist from "./Bloglist";
import NewsLetter from "./NewsLetter";
import { useRef } from "react";

const BlogHero = () => {
  const { setInput, input } = useAppContext();
  const inputRef = useRef();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setInput(inputRef.current.value);
  };

  const onClear = () => {
    setInput("");
    inputRef.current.value = "";
  };
  return (
    <div className=" mx-auto w-[90%] lg:w-full text-center bg-center relative bg-cover">
      <div className="details px-3 lg:px-[350px] pt-8">
        <p className="font-sourgummy text-3xl pb-6">
          Welcome to
          <br /> <span className="text-primary font-bold"> Jonadest </span>
          Blog <span className="text-4xl">👐</span>
        </p>
        <h1 className="text-[46px] lg:text-[70px] font-semibold pb-4 pt-2 leading-12 lg:leading-18 text-shadow-lg capitalize">
          Get inspired and join the digital world
        </h1>

        <code className="text-[18px]  mt-6 italic">
          Learn. Discover. Stay Connected.
        </code>

        <form
          onSubmit={onSubmitHandler}
          className="flex justify-center items-center gap-2 my-6"
        >
          <input
            ref={inputRef}
            type="search"
            placeholder="Search blogs"
            className="input"
          />
          <button className="btn">Search</button>
        </form>
      </div>
      <div className="text-center">
        {input && (
          <button onClick={onClear} className="btn tracking-wider">
            Clear search
          </button>
        )}
      </div>
      <Bloglist />
      <NewsLetter />
    </div>
  );
};

export default BlogHero;
