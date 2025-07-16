import { NextPage } from 'next';
import codeBg from '@/app/assests/images/coding.jpg';
import codeBg2 from '@/app/assests/images/code2.jpg';

interface Props {}

const SoftwareDev: NextPage<Props> = ({}) => {
  return (
    <div
      className=' m-auto bg-base-200 min-h-screen bg-black backdrop-blur-lg relative'
      style={{
        backgroundImage: `url(${codeBg.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        objectFit: 'cover',
      }}>
      <div className='container mx-auto flex flex-col lg:flex-row items-center justify-center p-6 '>
        <div className='bg-black/60 absolute inset-0 opacity-40 h-full'></div>
        <div className=' absolute inset-0 backdrop-blur-lg'></div>
        <img
          src={codeBg2.src}
          className=' rounded-lg shadow-2xl relative  lg:mb-0 mb-6 lg:mr-10'
        />
        <div className='lg:ml-10 lg:text-left text-center relative'>
          <h1 className='lg:text-5xl text-3xl font-bold'>
            Software Development & Data Analysis
          </h1>
          <p className='py-6'>
            At <strong>Jonadest Tech</strong>, we specialize in building modern,
            scalable websites and mobile apps for individuals and businesses. We
            also provide actionable data analytics services to help you grow
            smarter.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SoftwareDev;
