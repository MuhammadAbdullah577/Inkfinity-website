import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import { staggerContainer, fadeInUp } from '../../animations/variants'
import {
  Users,
  Target,
  Award,
  Globe,
  CheckCircle,
  ArrowRight
} from 'lucide-react'

const values = [
  {
    icon: Award,
    title: 'Quality First',
    description: 'We never compromise on quality. Every product undergoes rigorous quality checks before shipping.',
  },
  {
    icon: Users,
    title: 'Customer Focus',
    description: 'Your satisfaction is our priority. We work closely with you to ensure your vision becomes reality.',
  },
  {
    icon: Target,
    title: 'Innovation',
    description: 'We continuously invest in new technologies and techniques to deliver cutting-edge products.',
  },
  {
    icon: Globe,
    title: 'Global Reach',
    description: 'From local businesses to international brands, we serve clients across 50+ countries.',
  },
]

const capabilities = [
  'Screen Printing',
  'Embroidery',
  'Heat Transfer',
  'Direct-to-Garment (DTG)',
  'Sublimation Printing',
  'Cut & Sew Manufacturing',
  'Private Label Production',
  'Sample Development',
]

export default function AboutPage() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              About{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Inkfinity Creation
              </span>
            </h1>
            <p className="text-lg text-gray-600">
              Your trusted partner in custom clothing manufacturing. We bring ideas to life with precision, quality, and care.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 lg:py-24">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Founded in Sialkot, Pakistan - a city renowned worldwide for its manufacturing excellence - Inkfinity Creation has grown from a small workshop to a leading custom clothing manufacturer serving clients globally.
                </p>
                <p>
                  Our journey began with a simple mission: to make custom clothing manufacturing accessible to everyone, regardless of order size. While traditional manufacturers require large minimum orders, we broke that barrier by offering no MOQ (Minimum Order Quantity) production.
                </p>
                <p>
                  Today, we combine traditional craftsmanship with modern technology to deliver exceptional products. Our team of skilled artisans, designers, and production experts work together to bring your vision to life.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                    10+
                  </div>
                  <p className="text-xl text-gray-600">Years of Excellence</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-lg text-gray-600">
              These core principles guide everything we do
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {values.map((value) => (
              <motion.div
                key={value.title}
                variants={fadeInUp}
                className="bg-white p-6 rounded-2xl border border-gray-100 text-center hover:shadow-xl transition-shadow"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="py-16 lg:py-24">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Manufacturing Capabilities
              </h2>
              <p className="text-gray-600 mb-8">
                We offer a comprehensive range of manufacturing services to meet all your custom clothing needs. Our state-of-the-art facility is equipped with the latest technology to deliver exceptional results.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                {capabilities.map((capability) => (
                  <div
                    key={capability}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                    <span className="text-gray-700">{capability}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white"
            >
              <h3 className="text-2xl font-bold mb-4">
                Quality Assurance
              </h3>
              <p className="text-blue-100 mb-6">
                Every product goes through our rigorous quality control process:
              </p>
              <ul className="space-y-4">
                {[
                  'Raw material inspection',
                  'In-process quality checks',
                  'Final product inspection',
                  'Packaging quality control',
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm font-medium shrink-0">
                      {index + 1}
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Ready to Start Your Project?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Let's discuss your requirements and create something amazing together.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 hover:-translate-y-1"
            >
              Get in Touch
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  )
}
