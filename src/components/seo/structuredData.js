const SITE_URL = 'https://www.inkfinitycreation.com'

export function getOrganizationSchema(settings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: settings.company_name || 'Inkfinity Creation',
    url: SITE_URL,
    logo: settings.logo ? `${SITE_URL}/favicon.svg` : undefined,
    description: settings.meta_description,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Sialkot',
      addressRegion: 'Punjab',
      addressCountry: 'PK',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: settings.phone,
      contactType: 'sales',
      email: settings.email,
    },
    sameAs: [
      settings.facebook_url,
      settings.instagram_url,
      settings.linkedin_url,
      settings.twitter_url,
      settings.youtube_url,
      settings.tiktok_url,
    ].filter(Boolean),
  }
}

export function getLocalBusinessSchema(settings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#business`,
    name: settings.company_name || 'Inkfinity Creation',
    url: SITE_URL,
    telephone: settings.phone,
    email: settings.email,
    description: settings.meta_description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.address,
      addressLocality: 'Sialkot',
      addressRegion: 'Punjab',
      addressCountry: 'PK',
    },
    openingHours: settings.business_hours,
    priceRange: '$$',
  }
}

export function getProductSchema(product, categoryName) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images?.[0],
    category: categoryName,
    manufacturer: {
      '@type': 'Organization',
      name: 'Inkfinity Creation',
      url: SITE_URL,
    },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'USD',
      url: `${SITE_URL}/products/${product.id}`,
    },
  }
}

export function getBlogPostSchema(post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.cover_image,
    datePublished: post.created_at,
    author: {
      '@type': 'Organization',
      name: 'Inkfinity Creation',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Inkfinity Creation',
      url: SITE_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${post.slug}`,
    },
  }
}

export function getBreadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url ? `${SITE_URL}${item.url}` : undefined,
    })),
  }
}

export function getFAQSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}
