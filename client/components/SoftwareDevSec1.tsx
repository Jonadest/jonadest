import { NextPage } from 'next';
import VideoFrame from './VideoFrame';
import Link from 'next/link';

interface Props {}

const SoftwareDevSec1: NextPage<Props> = ({}) => {
  return (
    <div className='bg-white min-h-screen p-4 md:p-8 lg:p-12 flex'>
      <div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mt-12'>
        <VideoFrame />

        <div className='flex flex-col lg:flex-row gap-8 md:gap-12'>
          {/* Services List */}
          <div className='flex flex-col justify-start items-start'>
            <h2 className='text-2xl md:text-3xl font-bold mb-6 text-gray-800'>
              Our Services
            </h2>
            <ul className='list-disc pl-5 space-y-3 text-lg md:text-xl text-gray-700'>
              <li>Website & E-commerce Development</li>
              <li>Mobile Apps (iOS & Android)</li>
              <li>Custom Dashboards & Data Analysis</li>
              <li>Software Automation</li>
            </ul>

            <a
              href='#contact'
              className='mt-12 bg-[#041b2d] hover:bg-[#03161f] text-white font-semibold py-2 px-2 rounded-lg transition duration-300 text-xs'>
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoftwareDevSec1;
