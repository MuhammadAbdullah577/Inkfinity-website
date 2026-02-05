import Layout from '../../components/layout/Layout'
import Hero from '../../components/home/Hero'
import TrendingProducts from '../../components/home/TrendingProducts'
import UseCases from '../../components/home/UseCases'
import Features from '../../components/home/Features'
import CTA from '../../components/home/CTA'

export default function HomePage() {
  return (
    <Layout>
      <Hero />
      <TrendingProducts />
      <UseCases />
      <Features />
      <CTA />
    </Layout>
  )
}
