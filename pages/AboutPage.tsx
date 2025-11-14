import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for internal navigation
import { CheckCircleIcon } from '../components/Icons';
import MetaTags from '../components/MetaTags';

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

const techStack = [
    { name: 'React', description: 'A JavaScript library for building user interfaces.', icon: CheckCircleIcon },
    { name: 'TypeScript', description: 'A typed superset of JavaScript that compiles to plain JavaScript.', icon: CheckCircleIcon },
    { name: 'Tailwind CSS', description: 'A utility-first CSS framework for rapid UI development.', icon: CheckCircleIcon },
    { name: 'Vite', description: 'A fast build tool that provides a quicker and leaner development experience.', icon: CheckCircleIcon },
    { name: 'Canvas API', description: 'Used for client-side image processing.', icon: CheckCircleIcon },
    { name: 'Docker', description: 'For containerization and easy deployment.', icon: CheckCircleIcon },
];

const AboutPage: React.FC = () => {
  return (
    <>
      <MetaTags
        title="About PlayShotGen - Varabit"
        description="Learn more about PlayShotGen, developed by Varabit, and its features for generating Google Play Store screenshots."
        url="https://www.varabit.com/about"
        structuredData={{
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
        }}
      />
      <div className="bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-600 dark:text-blue-400">About Us</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              We are Varabit
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              PlayShotGen is developed and maintained by Varabit, a software company dedicated to creating high-quality tools and solutions.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Project Overview</h2>
              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                  PlayShotGen streamlines the generation of Google Play Store-compliant screenshots across multiple Android device categories from user-uploaded images.
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                  Our goal is to save developers time and effort by automating the tedious process of creating screenshots for different device sizes. With PlayShotGen, you can generate all the required assets in just a few clicks.
              </p>
          </div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Features</h2>
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

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Technology Stack</h2>
              <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
                  <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                      {techStack.map((tech) => (
                          <div key={tech.name} className="relative pl-16">
                              <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                                      <tech.icon className="h-6 w-6 text-white" aria-hidden="true" />
                                  </div>
                                  {tech.name}
                              </dt>
                              <dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">{tech.description}</dd>
                          </div>
                      ))}
                  </dl>
              </div>
          </div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Our Company - Varabit</h2>
              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                  Varabit is a passionate team of developers and designers committed to building innovative solutions that empower businesses and individuals. We believe in creating tools that are not only powerful but also intuitive and enjoyable to use.
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                  Our mission is to simplify complex tasks through elegant software, enabling our users to focus on what they do best. PlayShotGen is a testament to this commitment, providing a seamless experience for generating essential app store assets.
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                  For inquiries or collaborations, please visit our <Link to="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">Contact Page</Link> or learn more about us at <a href="https://varabit.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">varabit.com</a>.
              </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
