import { motion } from 'motion/react'
import {
  PackageX,
  Award,
  Clock,
  Palette,
  Globe,
  DollarSign,
  CheckCircle
} from 'lucide-react'
import { staggerContainer, fadeInUp } from '../../animations/variants'

const features = [
  {
    icon: PackageX,
    title: 'No Minimum Order',
    description: 'Order as few or as many as you need. We accommodate orders of all sizes without minimum quantity requirements.',
  },
  {
    icon: Award,
    title: 'Premium Quality',
    description: 'We use only the finest fabrics and materials, ensuring every piece meets the highest quality standards.',
  },
  {
    icon: Clock,
    title: 'Fast Turnaround',
    description: 'Quick production times without compromising quality. Get your orders delivered on schedule, every time.',
  },
  {
    icon: Palette,
    title: 'Custom Designs',
    description: 'Bring your creative vision to life. Our team helps you create unique designs tailored to your brand.',
  },
  {
    icon: Globe,
    title: 'Worldwide Shipping',
    description: 'We ship to over 50 countries worldwide with reliable tracking and secure packaging.',
  },
  {
    icon: DollarSign,
    title: 'Competitive Pricing',
    description: 'Factory-direct pricing ensures you get the best value without middlemen markups.',
  },
]

export default function Features() {
  return (
    <section className="py-20 lg:py-28 bg-gray-50">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Why Choose{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Inkfinity
            </span>
          </h2>
          <p className="text-lg text-gray-600">
            We combine craftsmanship, technology, and customer service to deliver an exceptional manufacturing experience.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={fadeInUp}
              className="group bg-white p-8 rounded-2xl border border-gray-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-50 rounded-full">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-700 font-medium">
              100% Satisfaction Guaranteed
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
