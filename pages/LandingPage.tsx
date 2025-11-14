import React from 'react';
import { Link } from 'react-router-dom';
import MetaTags from '../components/MetaTags';
import { CheckCircleIcon, UploadIcon, SettingsIcon, DownloadIcon } from '../components/Icons';

const features = [
  {
    name: 'Bulk Upload',
    description: 'Upload up to 20 images at once.',
    icon: CheckCircleIcon,
  },
  {
    name: 'Multiple Device Support',
    description: 'Supports all required Google Play Store device types.',
    icon: CheckCircleIcon,
  },
  {
    name: 'Smart Processing',
    description: 'Automatic aspect ratio correction with smart cropping and padding.',
    icon: CheckCircleIcon,
  },
  {
    name: 'Batch Download',
    description: 'Download all processed images as a single ZIP file.',
    icon: CheckCircleIcon,
  },
];

const howItWorks = [
    {
        name: '1. Upload Images',
        description: 'Drag and drop your application screenshots into the uploader.',
        icon: UploadIcon,
    },
    {
        name: '2. Generate Screenshots',
        description: 'Click the "Generate" button to process your images for all device types.',
        icon: SettingsIcon,
    },
    {
        name: '3. Download Assets',
        description: 'Download all your generated screenshots in a single ZIP file.',
        icon: DownloadIcon,
    },
];

const testimonials = [
    {
        body: 'This tool saved me hours of tedious work. I can now generate all my store listing images in minutes!',
        author: {
            name: 'John Doe',
            handle: 'johndoe',
            imageUrl:
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        },
    },
    {
        body: 'A must-have for any Android developer. The smart processing feature is a game-changer.',
        author: {
            name: 'Jane Smith',
            handle: 'janesmith',
            imageUrl:
                'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        },
    },
    {
        body: 'I love how simple and intuitive this tool is. I was able to generate all my screenshots without any hassle.',
        author: {
            name: 'Sam Wilson',
            handle: 'samwilson',
            imageUrl:
                'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        },
    },
]

const LandingPage: React.FC = () => {
  return (
    <>
      <MetaTags
        title="PlayShotGen - Generate Google Play Store Screenshots"
        description="Easily generate stunning and compliant Google Play Store screenshots for all Android device types with PlayShotGen by Varabit."
        url="https://www.varabit.com/"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "PlayShotGen",
            "url": "https://www.varabit.com/",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://www.varabit.com/dashboard?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          },
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Varabit",
            "url": "https://www.varabit.com/",
            "logo": "https://www.varabit.com/logo.png",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+880-1722-895295",
              "contactType": "Customer Service"
            },
            "sameAs": [
              "https://facebook.com/varabit",
              "https://twitter.com/varabit",
              "https://linkedin.com/company/varabit",
              "https://instagram.com/varabit"
            ]
          }
        ]}
      />
    <div>
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
          Generate Stunning Screenshots for Your Google Play Store Listing
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
          Create professional, compliant screenshots for all Android device types in seconds.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            to="/dashboard"
            className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Get started
          </Link>
          <Link to="/about" className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">
            Learn more <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      <div className="mt-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-600 dark:text-blue-400">Everything you need</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              All-in-one solution for your store listing assets
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Stop wasting time manually resizing and framing screenshots. PlayShotGen automates the entire process for you.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              {features.map((feature) => (
                <div key={feature.name} className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                      <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">{feature.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      <div className="mt-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-600 dark:text-blue-400">Simple as 1, 2, 3</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              How It Works
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                Get your Play Store assets ready in just a few clicks.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-5xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
              {howItWorks.map((step) => (
                <div key={step.name} className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                      <step.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    {step.name}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">{step.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

        <div className="relative isolate bg-white dark:bg-gray-900 pb-32 pt-24 sm:pt-32">
            <div
                className="absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 transform-gpu overflow-hidden opacity-30 blur-3xl"
                aria-hidden="true"
            >
                <div
                className="ml-[max(50%,38rem)] aspect-[1313/771] w-[82.0625rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc]"
                style={{
                    clipPath:
                    'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                }}
                />
            </div>
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-xl text-center">
                    <h2 className="text-lg font-semibold leading-8 tracking-tight text-blue-600 dark:text-blue-400">Testimonials</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                    What our users are saying
                    </p>
                </div>
                <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 grid-rows-1 gap-8 text-sm leading-6 text-gray-900 dark:text-white sm:mt-20 sm:grid-cols-2 xl:mx-0 xl:max-w-none xl:grid-flow-col xl:grid-cols-3">
                    {testimonials.map((testimonial) => (
                    <figure
                        key={testimonial.author.handle}
                        className="rounded-2xl bg-white dark:bg-gray-800/50 p-8 shadow-lg ring-1 ring-gray-900/5"
                    >
                        <blockquote className="text-gray-900 dark:text-white">
                        <p>{`“${testimonial.body}”`}</p>
                        </blockquote>
                        <figcaption className="mt-6 flex items-center gap-x-4">
                        <img className="h-10 w-10 rounded-full bg-gray-50" src={testimonial.author.imageUrl} alt="" />
                        <div>
                            <div className="font-semibold">{testimonial.author.name}</div>
                            <div className="text-gray-600 dark:text-gray-400">{`@${testimonial.author.handle}`}</div>
                        </div>
                        </figcaption>
                    </figure>
                    ))}
                </div>
            </div>
        </div>

      <div className="bg-white dark:bg-gray-900 mt-20">
        <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="relative isolate overflow-hidden bg-gray-900 dark:bg-gray-800 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
            <svg
              viewBox="0 0 1024 1024"
              className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
              aria-hidden="true"
            >
              <circle cx={512} cy={512} r={512} fill="url(#759c1415-0410-454c-8f7c-9a820de03641)" fillOpacity="0.7" />
              <defs>
                <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
                  <stop stopColor="#7775D6" />
                  <stop offset={1} stopColor="#E935C1" />
                </radialGradient>
              </defs>
            </svg>
            <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to get started?
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                Create your professional Google Play Store screenshots today.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
                <Link
                  to="/dashboard"
                  className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Generate Screenshots
                </Link>
                <Link to="/about" className="text-sm font-semibold leading-6 text-white">
                  Learn more <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default LandingPage;
