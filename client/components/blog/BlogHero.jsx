'use client';

import Bloglist from './Bloglist';
import NewsLetter from './NewsLetter';

const BlogHero = () => {
  return (
    <div className=' mx-auto w-[90%] lg:w-full text-center bg-center relative bg-cover'>
      <div className='details px-3 lg:px-[350px] pt-8'>
        <p className='font-sourgummy text-3xl'>Your Daily Dose of</p>
        <h1 className='text-[46px] lg:text-[70px] font-semibold pt-2 leading-12 lg:leading-18 text-shadow-lg'>
          Beauty, Trends & Style
        </h1>
        <p className='text-2xl text-secondary pt-3 font-sourgummy '>JBC Blog</p>
        <p className='text-[18px]  pt-6 '>
          Glow Smarter. Shop Better. Stay Ahead in Beauty & Fashion.
        </p>
        <form
          action='#'
          className='flex justify-center items-center gap-2 my-6'>
          <input type='search' placeholder='Search blogs' className='input' />
          <button className='btn'>Search</button>
        </form>
      </div>
      <Bloglist />
      <NewsLetter />
    </div>
  );
};

export default BlogHero;
