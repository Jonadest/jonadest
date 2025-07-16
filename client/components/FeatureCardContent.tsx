'use client';
import { NextPage } from 'next';
import Link from 'next/link';

interface Props {
  title: string;
  href: string;
}

const FeatureCardContent: NextPage<Props> = ({ title, href }) => {
  return (
    <Link href={href}>
      <div className='featurecard w-[100%] h-[100px] lg:w-[200px] lg:h-[100px] relative rounded-lg overflow-hidden gap-1 text-white flex items-center justify-center px-3 backdrop-blur-md bg-white/10 border border-white/20 shadow-lg'>
        {/* Background image */}
        <div
          className='absolute inset-0 bg-cover bg-center bg-no-repeat z-0'
          // style={{ backgroundImage: `url(${feat1.src})` }}
        />

        {/* Optional darker overlay */}
        <div className='absolute inset-0 bg-black/40 z-10' />

        {/* Text content */}
        <p className='textcontent relative z-20 text-sm font-semibold drop-shadow-lg'>
          {title}
        </p>
      </div>
    </Link>
  );
};

export default FeatureCardContent;
