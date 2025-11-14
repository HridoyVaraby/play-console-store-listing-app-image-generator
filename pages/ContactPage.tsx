import React from 'react';

const ContactPage: React.FC = () => {
  return (
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
    </div>
  );
};

export default ContactPage;
