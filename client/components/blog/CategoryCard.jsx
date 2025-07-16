import { blog_data } from '../assets/assets';

const CategoryCard = () => {
  return (
    <>
      {blog_data.map((data, index) => (
        <div key={index}>
          <div className='  w-[300px] lg:max-w-[220px] mx-auto rounded-lg h-full shadow-lg my-3 cate-card'>
            <div
              className='h-[130px] w-full rounded-tr-lg rounded-tl-lg'
              style={{
                backgroundImage: `url(${data.image})`,
                objectFit: 'cover',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}></div>
            <div className='flex flex-col items-start h-full mx-6 my-6'>
              <button className='btn btn-xs tracking-wider mb-3 '>
                {data.category}
              </button>
              <p className='text-left text-[16px] font-semibold'>
                {data.title}
              </p>
              <p className='text-left text-[12px] py-2'>{data.subTitle}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default CategoryCard;
