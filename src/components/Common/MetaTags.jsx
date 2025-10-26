// src/components/Common/MetaTags.jsx

import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { injectStructuredData } from '../../utils/seoHelpers';

const MetaTags = ({ 
  title, 
  description, 
  keywords,
  image, 
  url,
  type = 'website',
  structuredData = null 
}) => {
  const baseUrl = 'https://cascadevillas.in';
  
  // Default meta values
  const defaultTitle = 'Cascade Villas - Luxury Villa Rentals in Lonavala & Mahabaleshwar';
  const defaultDescription = 'Book luxury villas & homestays in Lonavala and Mahabaleshwar. Perfect for holidays, weddings & events. Premium amenities, verified properties, 24/7 support.';
  const defaultKeywords = 'villas in lonavala, villas in mahabaleshwar, luxury villas, homestays, wedding venues, holiday homes, vacation rentals, lonavala resorts, mahabaleshwar hotels, weekend getaway';
  const defaultImage = `${baseUrl}/Cascade.jpg`;
  
  const pageTitle = title || defaultTitle;
  const pageDescription = description || defaultDescription;
  const pageKeywords = keywords || defaultKeywords;
  const pageImage = image || defaultImage;
  const pageUrl = url || baseUrl;

  // Inject structured data
  useEffect(() => {
    if (structuredData) {
      // If it's an array of structured data objects
      if (Array.isArray(structuredData)) {
        structuredData.forEach(data => {
          injectStructuredData(data);
        });
      } else {
        injectStructuredData(structuredData);
      }
    }
  }, [structuredData]);

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="title" content={pageTitle} />
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={pageKeywords} />
      <meta name="author" content="Cascade Villas" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      
      {/* Geo Tags */}
      <meta name="geo.region" content="IN-MH" />
      <meta name="geo.placename" content="Lonavala, Maharashtra" />
      
      {/* Language & Locale */}
      <meta httpEquiv="content-language" content="en-IN" />
      <link rel="alternate" hrefLang="en-IN" href={pageUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={pageTitle} />
      <meta property="og:site_name" content="Cascade Villas" />
      <meta property="og:locale" content="en_IN" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={pageUrl} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />
      <meta name="twitter:image:alt" content={pageTitle} />
      
      {/* WhatsApp / Mobile Sharing */}
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:secure_url" content={pageImage} />
      
      {/* Additional SEO Tags */}
      <meta name="theme-color" content="#000000" />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="Cascade Villas" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={pageUrl} />
      
      {/* Preconnect for Performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://images.unsplash.com" />
      <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
    </Helmet>
  );
};

export default MetaTags;