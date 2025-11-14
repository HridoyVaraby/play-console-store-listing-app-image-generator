import React from 'react';
import { Helmet } from 'react-helmet-async';

interface MetaTagsProps {
  title: string;
  description: string;
  imageUrl?: string;
  url?: string;
  structuredData?: Record<string, any>;
}

const MetaTags: React.FC<MetaTagsProps> = ({ title, description, imageUrl, url, structuredData }) => {
  const defaultImageUrl = 'https://www.varabit.com/logo.png'; // Replace with your default image URL
  const defaultUrl = 'https://www.varabit.com'; // Replace with your default website URL

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Open Graph tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url || defaultUrl} />
      <meta property="og:image" content={imageUrl || defaultImageUrl} />

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl || defaultImageUrl} />

      {/* Structured Data (JSON-LD) */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default MetaTags;
