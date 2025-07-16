'use client';
import { useState, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Contact() {
  const toastId = useRef(null); // track the loading toast

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Show loading spinner
    toastId.current = toast.loading('Sending your message...');

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      // ✅ Update loading toast to success
      toast.update(toastId.current, {
        render: 'Message Sent Successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
        closeOnClick: true,
      });

      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unknown error occurred';
      setError(message);

      if (toastId.current) {
        toast.update(toastId.current, {
          render: message || 'Failed to send message',
          type: 'error',
          isLoading: false,
          autoClose: 4000,
          closeOnClick: true,
        });
      } else {
        toast.error(message || 'Failed to send message');
      }
    }
    setIsLoading(false);
  };

  return (
    <>
      <ToastContainer position='top-center' />
      <section id='contact' className='bg-color2 py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-4xl mx-auto'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-extrabold text-white sm:text-4xl'>
              Contact Us
            </h2>
            <p className='mt-4 text-lg text-gray-300'>
              Have questions or want to work together? Send us a message!
            </p>
          </div>

          <div className='bg-white shadow-xl rounded-lg p-6 sm:p-8'>
            {submitted ? (
              <div className='bg-green-50 border border-green-200 rounded-md p-4 text-center'>
                <h3 className='text-lg font-medium text-green-800'>
                  Thank you!
                </h3>
                <p className='mt-2 text-green-700'>
                  Your message has been sent successfully. We'll get back to you
                  soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className='space-y-6'>
                {error && (
                  <div className='bg-red-50 border border-red-200 rounded-md p-4 text-center'>
                    <p className='text-red-700'>{error}</p>
                  </div>
                )}

                <div className='grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-2'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>
                      Name
                    </label>
                    <input
                      type='text'
                      name='name'
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className='py-3 px-4 block w-full shadow-sm border-gray-300 rounded-md text-gray-700'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700'>
                      Email
                    </label>
                    <input
                      type='email'
                      name='email'
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className='py-3 px-4 block w-full shadow-sm border-gray-300 rounded-md text-gray-700'
                    />
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Message
                  </label>
                  <textarea
                    name='message'
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className='py-3 px-4 block w-full shadow-sm border-gray-300 rounded-md text-gray-700'
                  />
                </div>

                <div className='flex justify-end'>
                  <button
                    type='submit'
                    disabled={isLoading}
                    className={`inline-flex items-center px-6 py-3 text-white bg-[#052e41] hover:bg-[#06232b] transition rounded-md ${
                      isLoading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}>
                    {isLoading ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
