import Layout from '../../components/layout/Layout'
import SEO from '../../components/seo/SEO'
import Hero from '../../components/home/Hero'
import TrendingProducts from '../../components/home/TrendingProducts'
import UseCases from '../../components/home/UseCases'
import Features from '../../components/home/Features'
import FAQ from '../../components/home/FAQ'
import { faqData } from '../../components/home/FAQ'
import CTA from '../../components/home/CTA'
import { useCompanySettings } from '../../hooks/useCompanySettings'
import { getOrganizationSchema, getLocalBusinessSchema, getFAQSchema } from '../../components/seo/structuredData'

export default function HomePage() {
  const { settings } = useCompanySettings()

  return (
    <Layout>
      <SEO
        canonical="/"
        jsonLd={[getOrganizationSchema(settings), getLocalBusinessSchema(settings), getFAQSchema(faqData)]}
      />
      <Hero />
      <TrendingProducts />
      <UseCases />
      <Features />
      <FAQ />
      <CTA />
    </Layout>
  )
}
