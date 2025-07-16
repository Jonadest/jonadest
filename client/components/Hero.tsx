'use client';

import bg1 from '@/app/assests/images/future-visions-business-technology-concept.jpg';

import FeatureCardContent from '@/components/FeatureCardContent';

import WeatherWidget from './WeatherWidget';

import React, { useState } from 'react';

const Hero = () => {
  const [weatherVisible, setWeatherVisible] = useState(false);

  return (
    <main className='relative min-h-[90vh] flex items-center justify-center text-center bg-base-100 p-6 overflow-hidden'>
      <div
        className='absolute inset-0 bg-cover bg-center z-0 '
        style={{
          backgroundImage: `url(${bg1.src})`,
        }}></div>

      <div className='absolute inset-0 bg-black opacity-60 z-10'></div>

      <div className='relative z-20 text-white'>
        <WeatherWidget
          visible={weatherVisible}
          onClose={() => setWeatherVisible(false)}
        />
        <h1 className='text-6xl md:text-8xl font-bold mb-4 drop-shadow-lg'>
          <span className='font-sourgummy text-[24px] tracking-widest'>
            Welcome to
          </span>{' '}
          <br />
          Jonadest
        </h1>
        <p className='text-lg md:text-xl max-w-2xl mx-auto drop-shadow'>
          We offer Software Development, Data Analysis, Marketing, Printing, and
          Graphics.
        </p>
        <div className='w-full grid grid-cols-2 lg:grid-cols-4 gap-3 mt-14 mx-auto'>
          <FeatureCardContent
            title='Software Development'
            href='/services/software-dev'
          />

          <FeatureCardContent title='Marketing' href='/services/marketing' />

          <FeatureCardContent
            title='Graphics Design'
            href='/services/graphics-design'
          />
          <FeatureCardContent
            title='General Printing'
            href='/services/general-printing'
          />
        </div>
      </div>
    </main>
  );
};

export default Hero;
