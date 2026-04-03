import { Helmet } from 'react-helmet-async'
import { useCompanySettings } from '../../hooks/useCompanySettings'

const SITE_URL = 'https://www.inkfinitycreation.com'

export default function SEO({
  title,
  description,
  canonical = '/',
  ogImage,
  ogType = 'website',
  jsonLd = [],
}) {
  const { settings } = useCompanySettings()

  const companyName = settings.company_name || 'Inkfinity Creation'
  const pageTitle = title ? `${title} | ${companyName}` : settings.meta_title
  const pageDescription = description || settings.meta_description
  const pageUrl = `${SITE_URL}${canonical}`
  const pageImage = ogImage || `${SITE_URL}/og-image.svg`

  const schemas = Array.isArray(jsonLd) ? jsonLd : [jsonLd]

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <link rel="canonical" href={pageUrl} />

      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:site_name" content={companyName} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />

      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  )
}
