import { NextPage } from 'next';

interface Props {}

const Carousel: NextPage<Props> = ({}) => {
  return (
    <div className='carousel carousel-center rounded-box  '>
      <div className='carousel-item'>
        <img
          src='https://images.unsplash.com/photo-1654618977232-a6c6dea9d1e8?q=80&w=386&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          alt='Home Office'
        />
      </div>
      <div className='carousel-item'>
        <img
          src='https://images.unsplash.com/photo-1608306448197-e83633f1261c?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          alt='Coding'
        />
      </div>
      <div className='carousel-item'>
        <img
          src='https://images.unsplash.com/photo-1628258334105-2a0b3d6efee1?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          alt='Coding'
        />
      </div>
      <div className='carousel-item'>
        <img
          src='https://images.unsplash.com/photo-1589859509530-1bef96699d28?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          alt='Coding'
        />
      </div>
      <div className='carousel-item'>
        <img
          src='https://images.unsplash.com/photo-1618477388954-7852f32655ec?q=80&w=464&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          alt='coding'
        />
      </div>
      <div className='carousel-item'>
        <img
          src='https://images.unsplash.com/photo-1634838080334-28befa9efe80?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          alt='Coding'
        />
      </div>
      <div className='carousel-item'>
        <img
          src='https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=455&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          alt='Coding'
        />
      </div>
    </div>
  );
};

export default Carousel;
