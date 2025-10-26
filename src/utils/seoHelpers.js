// src/utils/seoHelpers.js
// Comprehensive SEO utilities for Cascade Villas

/**
 * Generate villa-specific SEO meta tags
 * @param {Object} villa - Villa object
 * @returns {Object} Meta tags object
 */
export const generateVillaMeta = (villa) => {
  if (!villa) return {};

  const baseUrl = 'https://cascadevillas.in';
  const villaUrl = `${baseUrl}/villa/${villa.id}`;
  
  return {
    title: `${villa.name} - Luxury Villa in ${villa.location} | Cascade Villas`,
    description: `Book ${villa.name} in ${villa.location}. ${villa.bedrooms} bedrooms, ${villa.bathrooms} bathrooms, accommodates ${villa.maxGuests} guests. ${villa.amenities?.slice(0, 3).join(', ')}. Starting at ₹${villa.pricePerNight?.toLocaleString()}/night.`,
    keywords: `${villa.name}, villa in ${villa.location}, ${villa.location} villas, ${villa.bedrooms} bedroom villa, luxury villa ${villa.location}, ${villa.amenities?.join(', ')}, villa rental ${villa.location}`,
    image: villa.images?.[0] || `${baseUrl}/og-image.jpg`,
    url: villaUrl,
    type: 'product'
  };
};

/**
 * Generate JSON-LD structured data for a villa
 * @param {Object} villa - Villa object
 * @returns {Object} JSON-LD object
 */
export const generateVillaStructuredData = (villa) => {
  if (!villa) return null;

  const baseUrl = 'https://cascadevillas.in';
  const discountedPrice = villa.discountPercentage > 0
    ? villa.pricePerNight * (1 - villa.discountPercentage / 100)
    : villa.pricePerNight;

  return {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    '@id': `${baseUrl}/villa/${villa.id}`,
    name: villa.name,
    description: villa.description,
    image: villa.images || [],
    address: {
      '@type': 'PostalAddress',
      addressLocality: villa.location,
      addressRegion: 'Maharashtra',
      addressCountry: 'IN'
    },
    geo: {
      '@type': 'GeoCoordinates',
      // Add coordinates if available
      latitude: villa.location === 'Lonavala' ? 18.7537 : 17.9239,
      longitude: villa.location === 'Lonavala' ? 73.4076 : 73.6585
    },
    url: `${baseUrl}/villa/${villa.id}`,
    telephone: '+919322299595',
    priceRange: '₹₹₹',
    starRating: {
      '@type': 'Rating',
      ratingValue: '5',
      bestRating: '5'
    },
    amenityFeature: villa.amenities?.map(amenity => ({
      '@type': 'LocationFeatureSpecification',
      name: amenity,
      value: true
    })),
    numberOfRooms: villa.bedrooms,
    maximumAttendeeCapacity: villa.maxGuests,
    offers: {
      '@type': 'Offer',
      price: discountedPrice,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      validFrom: new Date().toISOString(),
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      url: `${baseUrl}/villa/${villa.id}`
    }
  };
};

/**
 * Generate breadcrumb structured data
 * @param {Array} breadcrumbs - Array of {name, url} objects
 * @returns {Object} JSON-LD breadcrumb
 */
export const generateBreadcrumbStructuredData = (breadcrumbs) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url
    }))
  };
};

/**
 * Generate organization structured data
 * @returns {Object} JSON-LD organization
 */
export const generateOrganizationStructuredData = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Cascade Villas',
    alternateName: 'Cascade Villas & Homestay',
    url: 'https://cascadevillas.in',
    logo: 'https://cascadevillas.in/Cascade.jpg',
    description: 'Premium villa rentals and homestays in Lonavala and Mahabaleshwar. Perfect for holidays, weddings, corporate events, and family gatherings.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Lonavala',
      addressRegion: 'Maharashtra',
      addressCountry: 'IN'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+919322299595',
      contactType: 'Customer Service',
      areaServed: ['IN'],
      availableLanguage: ['English', 'Hindi', 'Marathi']
    },
    sameAs: [
      'https://www.facebook.com/cascadevillas',
      'https://www.instagram.com/cascadevillas'
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '127',
      bestRating: '5',
      worstRating: '1'
    }
  };
};

/**
 * Generate website structured data
 * @returns {Object} JSON-LD website
 */
export const generateWebsiteStructuredData = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Cascade Villas',
    url: 'https://cascadevillas.in',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://cascadevillas.in/search?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    }
  };
};

/**
 * Generate FAQ structured data
 * @param {Array} faqs - Array of {question, answer} objects
 * @returns {Object} JSON-LD FAQ
 */
export const generateFAQStructuredData = (faqs) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
};

/**
 * Generate location-based meta tags
 * @param {string} location - Location name
 * @returns {Object} Meta tags object
 */
export const generateLocationMeta = (location) => {
  const locationData = {
    'Lonavala': {
      description: 'Discover luxury villas in Lonavala. Perfect for weekend getaways, family vacations, and corporate retreats. Premium amenities, stunning hill views, and easy access to major attractions.',
      keywords: 'villas in lonavala, lonavala resorts, luxury villas lonavala, weekend getaway lonavala, family villas lonavala'
    },
    'Mahabaleshwar': {
      description: 'Book premium villas in Mahabaleshwar. Enjoy scenic mountain views, lush gardens, and modern amenities. Ideal for weddings, family reunions, and peaceful retreats.',
      keywords: 'villas in mahabaleshwar, mahabaleshwar resorts, luxury villas mahabaleshwar, hill station villas, family vacation mahabaleshwar'
    }
  };

  return {
    title: `Luxury Villas in ${location} | Cascade Villas`,
    description: locationData[location]?.description || `Book luxury villas in ${location} with Cascade Villas`,
    keywords: locationData[location]?.keywords || `villas in ${location}, ${location} villas`
  };
};

/**
 * Inject JSON-LD script into document head
 * @param {Object} structuredData - JSON-LD object
 */
export const injectStructuredData = (structuredData) => {
  // Remove existing structured data scripts
  const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
  existingScripts.forEach(script => script.remove());

  // Create and inject new script
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(structuredData);
  document.head.appendChild(script);
};

/**
 * Generate complete SEO package for a villa
 * @param {Object} villa - Villa object
 * @returns {Object} Complete SEO package
 */
export const generateCompleteSEO = (villa) => {
  const meta = generateVillaMeta(villa);
  const structuredData = [
    generateVillaStructuredData(villa),
    generateOrganizationStructuredData(),
    generateWebsiteStructuredData(),
    generateBreadcrumbStructuredData([
      { name: 'Home', url: 'https://cascadevillas.in' },
      { name: 'Villas', url: 'https://cascadevillas.in/properties' },
      { name: villa.name, url: `https://cascadevillas.in/villa/${villa.id}` }
    ])
  ];

  return {
    meta,
    structuredData
  };
};

export default {
  generateVillaMeta,
  generateVillaStructuredData,
  generateBreadcrumbStructuredData,
  generateOrganizationStructuredData,
  generateWebsiteStructuredData,
  generateFAQStructuredData,
  generateLocationMeta,
  injectStructuredData,
  generateCompleteSEO
};