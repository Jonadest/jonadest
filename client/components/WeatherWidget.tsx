'use client';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { WeatherData } from '@/types/weather';

export default function WeatherWidget({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isGeolocating, setIsGeolocating] = useState(true);

  const fetchWeatherByCoords = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `/api/weather/coordinates?lat=${lat}&lon=${lon}`
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || 'Failed to fetch weather');
      setWeather(data);
      setCity(data.name);
    } catch {
      setError('Could not detect location. Please enter your city.');
    } finally {
      setIsGeolocating(false);
    }
  };

  const fetchWeather = async (cityName: string) => {
    if (!cityName.trim()) return setError('Please enter a city');
    setLoading(true);
    setError('');
    try {
      const response = await fetch(
        `/api/weather?city=${encodeURIComponent(cityName)}`
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || 'Failed to fetch weather');
      setWeather(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
        () => {
          setIsGeolocating(false);
          setError('Location access denied. Please enter your city.');
        }
      );
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
      <div className='bg-color1 rounded-xl shadow-lg w-[90%] max-w-md mx-4 relative'>
        <button
          className='absolute top-2 right-2 text-white hover:text-red-400'
          onClick={onClose}>
          <X className='w-6 h-6' />
        </button>
        <div className='p-6'>
          <h2 className='text-xl font-bold text-gray-300 mb-4'>
            Weather Forecast
          </h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchWeather(city);
            }}
            className='mb-4 flex flex-col sm:flex-row gap-2 w-full'>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder='Enter city...'
              className='flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none'
            />
            <button
              type='submit'
              disabled={loading || isGeolocating}
              className='px-4 py-2 btn btn-outline text-white rounded-lg w-full sm:w-auto'>
              {loading ? '...' : 'Search'}
            </button>
          </form>

          {isGeolocating ? (
            <div className='text-center py-4'>
              <div className='inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500' />
              <p className='mt-2 text-gray-400'>Detecting your location...</p>
            </div>
          ) : error ? (
            <div className='bg-red-50 text-red-700 p-4 rounded-md mb-4'>
              {error}
            </div>
          ) : weather ? (
            <div>
              <div className='flex justify-between items-center'>
                <div>
                  <h3 className='text-2xl font-semibold'>
                    {weather.name}, {weather.sys.country}
                  </h3>
                  <p className='capitalize text-gray-300'>
                    {weather.weather[0].description}
                  </p>
                </div>
                <img
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  alt={weather.weather[0].description}
                  className='w-20 h-20'
                />
              </div>

              <div className='flex items-center justify-between mt-4'>
                <span className='text-5xl font-bold'>
                  {Math.round(weather.main.temp)}°C
                </span>
                <div className='text-gray-300 text-sm text-right'>
                  <p>Feels like: {Math.round(weather.main.feels_like)}°C</p>
                  <p>Humidity: {weather.main.humidity}%</p>
                  <p>Wind: {weather.wind.speed} m/s</p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
