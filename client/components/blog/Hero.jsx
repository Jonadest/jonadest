
import Bloglist from "./Bloglist";
import NewsLetter from "./NewsLetter";
import { useAppContext } from "../context/AppContext";
import { useRef } from "react";

const Hero = () => {
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
    <div className=" mx-auto w-[90%] lg:w-full ">
      <div className="details lg:px-[350px]">
        <h1 className="text-[70px] font-semibold pt-6  leading-18 text-shadow-lg">
          Your own <span className="text-[#5044E5]">blogging</span> <br />
          platform.
        </h1>
        <p className="text-[18px]  pt-6 ">
          This is your space to think out loud, to share what matters, and to
          write without filters. Whether it’s one word or a thousand, your story
          starts right here.
        </p>
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

export default Hero;
