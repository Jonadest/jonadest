import { NextPage } from 'next';

const VideoFrame: NextPage = () => {
  return (
    <div className='w-full mb-8 md:mb-12 '>
      <video
        src='/assets/intro.mp4'
        controls
        className='w-full rounded-lg shadow-lg'
        autoPlay
        muted // Required for iOS autoplay
        playsInline
        loop></video>
    </div>
  );
};

export default VideoFrame;
