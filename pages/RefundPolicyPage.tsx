import React from 'react';
import MetaTags from '../components/MetaTags';

const RefundPolicyPage: React.FC = () => {
  return (
    <>
      <MetaTags
        title="Refund Policy - PlayShotGen"
        description="Read the Refund Policy for PlayShotGen, operated by Varabit, to understand the conditions under which refunds may be issued."
        url="https://www.varabit.com/refund-policy"
      />
    <div className="bg-white dark:bg-gray-900 px-6 py-24 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700 dark:text-gray-300">
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Refund Policy for PlayShotGen</h1>
        <p className="mt-6 text-xl leading-8">
          Thank you for choosing PlayShotGen, operated by Varabit. We want you to be satisfied with our services. This Refund Policy outlines the conditions under which refunds may be issued.
        </p>

        <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">1. General Refund Policy</h2>
        <p className="mt-6">
          All sales are final. We do not offer refunds for digital products or services once the purchase is complete and access has been granted, except under specific circumstances outlined below or as required by law.
        </p>

        <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">2. Exceptions for Refunds</h2>
        <ul role="list" className="mt-8 max-w-xl space-y-8 text-gray-600 dark:text-gray-400">
          <li className="flex gap-x-3">
            <span>
              <strong className="font-semibold text-gray-900 dark:text-white">Technical Issues.</strong> If you experience persistent technical issues that prevent you from using our service as intended, and our support team is unable to resolve the issue within a reasonable timeframe, you may be eligible for a refund. You must provide detailed information and cooperate with our support team to diagnose and resolve the problem.
            </span>
          </li>
          <li className="flex gap-x-3">
            <span>
              <strong className="font-semibold text-gray-900 dark:text-white">Unauthorized Transactions.</strong> If you believe an unauthorized transaction has occurred on your account, please contact us immediately. We will investigate the claim and, if validated, issue a full refund.
            </span>
          </li>
          <li className="flex gap-x-3">
            <span>
              <strong className="font-semibold text-gray-900 dark:text-white">Duplicate Purchases.</strong> If you accidentally make a duplicate purchase for the same service, please contact us. We will refund the duplicate transaction.
            </span>
          </li>
        </ul>

        <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">3. How to Request a Refund</h2>
        <p className="mt-6">
          To request a refund, please contact our support team at info@varabit.com within 7 days of your purchase, providing the following information:
        </p>
        <ul role="list" className="mt-8 max-w-xl space-y-8 text-gray-600 dark:text-gray-400">
          <li className="flex gap-x-3">
            <span>
              <strong className="font-semibold text-gray-900 dark:text-white">Your Name and Email Address.</strong>
            </span>
          </li>
          <li className="flex gap-x-3">
            <span>
              <strong className="font-semibold text-gray-900 dark:text-white">Order Number or Transaction ID.</strong>
            </span>
          </li>
          <li className="flex gap-x-3">
            <span>
              <strong className="font-semibold text-gray-900 dark:text-white">Detailed Reason for the Refund Request.</strong>
            </span>
          </li>
        </ul>
        <p className="mt-6">
          Our team will review your request and respond within a reasonable timeframe. If your refund is approved, the refund will be processed, and a credit will automatically be applied to your original method of payment, within a certain amount of days.
        </p>

        <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">4. Changes to This Refund Policy</h2>
        <p className="mt-6">
          We may update our Refund Policy from time to time. We will notify you of any changes by posting the new Refund Policy on this page. You are advised to review this Refund Policy periodically for any changes. Changes to this Refund Policy are effective when they are posted on this page.
        </p>

        <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">5. Contact Us</h2>
        <p className="mt-6">
          If you have any questions about this Refund Policy, please contact us:
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

export default RefundPolicyPage;
