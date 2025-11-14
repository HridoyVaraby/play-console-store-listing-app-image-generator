import React from 'react';
import MetaTags from '../components/MetaTags';

const ContactPage: React.FC = () => {
  return (
    <>
      <MetaTags
        title="Contact Us - PlayShotGen"
        description="Get in touch with PlayShotGen support team for any queries or feedback. Find our email, phone, and social media links."
        url="https://www.varabit.com/contact"
      />
    <div className="isolate bg-white dark:bg-gray-900 px-6 py-24 sm:py-32 lg:px-8">
      <div
        className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
        aria-hidden="true"
      >
        <div
          className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Contact Us</h2>
        <p className="mt-2 text-lg leading-8 text-gray-600 dark:text-gray-300">
          We'd love to hear from you! Send us a message and we'll respond as soon as possible.
        </p>
      </div>
      <form action="#" method="POST" className="mx-auto mt-16 max-w-xl sm:mt-20">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div>
            <label htmlFor="first-name" className="block text-sm font-semibold leading-6 text-gray-900 dark:text-white">
              First name
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                name="first-name"
                id="first-name"
                autoComplete="given-name"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 dark:bg-gray-700 dark:text-white dark:ring-gray-600 dark:focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label htmlFor="last-name" className="block text-sm font-semibold leading-6 text-gray-900 dark:text-white">
              Last name
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                name="last-name"
                id="last-name"
                autoComplete="family-name"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 dark:bg-gray-700 dark:text-white dark:ring-gray-600 dark:focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="email" className="block text-sm font-semibold leading-6 text-gray-900 dark:text-white">
              Email
            </label>
            <div className="mt-2.5">
              <input
                type="email"
                name="email"
                id="email"
                autoComplete="email"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 dark:bg-gray-700 dark:text-white dark:ring-gray-600 dark:focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="message" className="block text-sm font-semibold leading-6 text-gray-900 dark:text-white">
              Message
            </label>
            <div className="mt-2.5">
              <textarea
                name="message"
                id="message"
                rows={4}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 dark:bg-gray-700 dark:text-white dark:ring-gray-600 dark:focus:ring-blue-500"
                defaultValue={''}
              />
            </div>
          </div>
        </div>
        <div className="mt-10">
          <button
            type="submit"
            className="block w-full rounded-md bg-blue-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Let's talk
          </button>
        </div>
      </form>

      <div className="mx-auto mt-16 max-w-xl sm:mt-20">
        <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Our Contact Details</h3>
        <dl className="mt-10 space-y-4 text-base leading-7 text-gray-600 dark:text-gray-300">
          <div className="flex gap-x-4">
            <dt className="flex-none">
              <span className="sr-only">Email</span>
              <svg className="h-7 w-6 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </dt>
            <dd>
              <a className="hover:text-gray-900 dark:hover:text-white" href="mailto:info@varabit.com">info@varabit.com</a><br />
              <a className="hover:text-gray-900 dark:hover:text-white" href="mailto:support@varabit.com">support@varabit.com</a>
            </dd>
          </div>
          <div className="flex gap-x-4">
            <dt className="flex-none">
              <span className="sr-only">Telephone</span>
              <svg className="h-7 w-6 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h1A1.5 1.5 0 016 3.5v1A1.5 1.5 0 014.5 6h-1A1.5 1.5 0 012 4.5v-1zm3.5 1A.5.5 0 005 4.5v-1A.5.5 0 004.5 3h-1A.5.5 0 003 3.5v1A.5.5 0 003.5 5h1zm11.5-1A1.5 1.5 0 0117.5 2h1A1.5 1.5 0 0120 3.5v1A1.5 1.5 0 0118.5 6h-1A1.5 1.5 0 0116 4.5v-1zm3.5 1A.5.5 0 0019 4.5v-1A.5.5 0 0018.5 3h-1A.5.5 0 0017 3.5v1A.5.5 0 0017.5 5h1zM6.5 18A1.5 1.5 0 018 16.5h1A1.5 1.5 0 0111 18.5v1A1.5 1.5 0 019.5 21h-1A1.5 1.5 0 016.5 19.5v-1zm3.5 1A.5.5 0 0010 19.5v-1A.5.5 0 009.5 18h-1A.5.5 0 008 18.5v1A.5.5 0 008.5 20h1zM16.5 18A1.5 1.5 0 0118 16.5h1A1.5 1.5 0 0121 18.5v1A1.5 1.5 0 0119.5 21h-1A1.5 1.5 0 0116.5 19.5v-1zm3.5 1A.5.5 0 0020 19.5v-1A.5.5 0 0019.5 18h-1A.5.5 0 0018 18.5v1A.5.5 0 0018.5 20h1zM6 2.5a.5.5 0 00-1 0v15a.5.5 0 001 0v-15zm3 0a.5.5 0 00-1 0v15a.5.5 0 001 0v-15zm3 0a.5.5 0 00-1 0v15a.5.5 0 001 0v-15zm3 0a.5.5 0 00-1 0v15a.5.5 0 001 0v-15z" clipRule="evenodd" />
              </svg>
            </dt>
            <dd>
              <a className="hover:text-gray-900 dark:hover:text-white" href="tel:+8801722895295">+880 1722 895295</a> (Phone/WhatsApp)
            </dd>
          </div>
        </dl>
      </div>

      <div className="mx-auto mt-16 max-w-xl sm:mt-20">
        <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Follow Us</h3>
        <div className="mt-4 flex space-x-6">
          <a href="https://facebook.com/varabit" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
            <span className="sr-only">Facebook</span>
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.776-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
            </svg>
          </a>
          <a href="https://twitter.com/varabit" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
            <span className="sr-only">Twitter</span>
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.007-.532A8.318 8.318 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012 7.02v.054a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
            </svg>
          </a>
          <a href="https://linkedin.com/company/varabit" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
            <span className="sr-only">LinkedIn</span>
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M19 0H5a5 5 0 00-5 5v14a5 5 0 005 5h14a5 5 0 005-5V5a5 5 0 00-5-5zM8 19H5V8h3v11zM6.5 6.732c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764c.967 0 1.75.79 1.75 1.764s-.783 1.764-1.75 1.764zM20 19h-3v-5.625c0-3.369-4-3.563-4 0V19h-3V8h3v1.765c1.396-2.586 7-2.777 7 2.476V19z" clipRule="evenodd" />
            </svg>
          </a>
          <a href="https://instagram.com/varabit" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
            <span className="sr-only">Instagram</span>
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.277.072-1.684.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.35 1.535 20.682 1.123 19.892.818c-.765-.296-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.425.616.26 1.05.606 1.486 1.042.436.436.782.879 1.042 1.486.176.423.37 1.059.425 2.228.056 1.265.07 1.647.07 4.85s-.014 3.585-.07 4.85c-.055 1.17-.249 1.805-.425 2.227-.26.616-.606 1.05-.1042 1.486-.436.436-.879.782-1.486 1.042-.423.176-1.059.37-2.228.425-1.265.056-1.647.07-4.85.07s-3.585-.014-4.85-.07c-1.17-.055-1.805-.249-2.227-.425-.616-.26-1.05-.606-1.486-1.042-.436-.436-.782-.879-1.042-1.486-.176-.423-.37-1.059-.425-2.228-.056-1.265-.07-1.647-.07-4.85s.014-3.585.07-4.85c.055-1.17.249-1.805.425-2.227.26-.616.606-1.05 1.042-1.486.436-.436.879-.782 1.486-1.042.423-.176 1.059-.37 2.228-.425C8.415 2.176 8.797 2.16 12 2.16zm0 3.635c-3.405 0-6.17 2.764-6.17 6.17s2.764 6.17 6.17 6.17 6.17-2.764 6.17-6.17-2.764-6.17-6.17-6.17zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0-.795-.646-1.44-1.44-1.44-.795 0-1.44.646-1.44 1.44 0 .795.646 1.44 1.44 1.44.795 0 1.44-.646 1.44-1.44z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
          </div>
        </>
      );};

export default ContactPage;
