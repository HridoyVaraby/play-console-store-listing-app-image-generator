import React from 'react';
import MetaTags from '../components/MetaTags';

const TermsOfServicePage: React.FC = () => {
  return (
    <>
      <MetaTags
        title="Terms of Service - PlayShotGen"
        description="Read the Terms of Service for PlayShotGen, operated by Varabit, to understand the terms governing your use of our website and services."
        url="https://www.varabit.com/terms-of-service"
      />
    <div className="bg-white dark:bg-gray-900 px-6 py-24 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700 dark:text-gray-300">
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Terms of Service for PlayShotGen</h1>
        <p className="mt-6 text-xl leading-8">
          Welcome to PlayShotGen, operated by Varabit. These Terms of Service ("Terms") govern your use of our website and services. By accessing or using PlayShotGen, you agree to be bound by these Terms.
        </p>

        <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">1. Acceptance of Terms</h2>
        <p className="mt-6">
          By accessing and using PlayShotGen, you accept and agree to be bound by the terms and provisions of these Terms. If you do not agree to these Terms, you should not use our services.
        </p>

        <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">2. Changes to Terms</h2>
        <p className="mt-6">
          We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
        </p>

        <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">3. Use of Service</h2>
        <ul role="list" className="mt-8 max-w-xl space-y-8 text-gray-600 dark:text-gray-400">
          <li className="flex gap-x-3">
            <span>
              <strong className="font-semibold text-gray-900 dark:text-white">Eligibility.</strong> You must be at least 13 years old to use PlayShotGen. By using our services, you represent and warrant that you meet this age requirement.
            </span>
          </li>
          <li className="flex gap-x-3">
            <span>
              <strong className="font-semibold text-gray-900 dark:text-white">Account Responsibility.</strong> You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer. You agree to accept responsibility for all activities that occur under your account or password.
            </span>
          </li>
          <li className="flex gap-x-3">
            <span>
              <strong className="font-semibold text-gray-900 dark:text-white">Prohibited Conduct.</strong> You agree not to use PlayShotGen for any unlawful purpose or in any way that might harm, abuse, or otherwise interfere with our services or the enjoyment of our services by other users.
            </span>
          </li>
        </ul>

        <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">4. Intellectual Property</h2>
        <p className="mt-6">
          The service and its original content (excluding content provided by users), features, and functionality are and will remain the exclusive property of Varabit and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Varabit.
        </p>

        <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">5. User-Generated Content</h2>
        <p className="mt-6">
          You retain all rights in, and are solely responsible for, the content you create, upload, post, or otherwise make available through PlayShotGen. By making content available, you grant Varabit a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, publish, and distribute such content on and through the service.
        </p>

        <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">6. Termination</h2>
        <p className="mt-6">
          We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
        </p>

        <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">7. Disclaimer of Warranties</h2>
        <p className="mt-6">
          Your use of the service is at your sole risk. The service is provided on an "AS IS" and "AS AVAILABLE" basis. The service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement or course of performance.
        </p>

        <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">8. Limitation of Liability</h2>
        <p className="mt-6">
          In no event shall Varabit, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the service; (ii) any conduct or content of any third party on the service; (iii) any content obtained from the service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage, and even if a remedy set forth herein is found to have failed of its essential purpose.
        </p>

        <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">9. Governing Law</h2>
        <p className="mt-6">
          These Terms shall be governed and construed in accordance with the laws of Bangladesh, without regard to its conflict of law provisions.
        </p>

        <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">10. Contact Us</h2>
        <p className="mt-6">
          If you have any questions about these Terms, please contact us:
        </p>
        <ul role="list" className="mt-8 max-w-xl space-y-8 text-gray-600 dark:text-gray-400">
          <li className="flex gap-x-3">
            <span>
              <strong className="font-semibold text-gray-900 dark:text-white">By email:</strong> info@varabit.com
            </span>
          </li>
          <li className="flex gap-x-3">
            <span>
              <strong className="font-semibold text-gray-900 dark:text-white">By visiting this page on our website:</strong> <a href="https://www.varabit.com/contact" className="text-blue-600 hover:underline">https://www.varabit.com/contact</a>
            </span>
          </li>
        </ul>
      </div>
    </div>
    </>
  );
};

export default TermsOfServicePage;
