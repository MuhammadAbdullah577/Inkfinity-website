import Layout from '../../components/layout/Layout'
import Hero from '../../components/home/Hero'
import Statistics from '../../components/home/Statistics'
import UseCases from '../../components/home/UseCases'
import Features from '../../components/home/Features'
import CTA from '../../components/home/CTA'

export default function HomePage() {
  return (
    <Layout>
      <Hero />
      <Statistics />
      <UseCases />
      <Features />
      <CTA />
    </Layout>
  )
}
