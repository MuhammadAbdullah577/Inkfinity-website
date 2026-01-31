import { motion } from 'motion/react'
import { Building2, Users, Gift, Briefcase } from 'lucide-react'
import { staggerContainer, fadeInUp } from '../../animations/variants'

const useCases = [
  {
    icon: Building2,
    title: 'Clothing Brands',
    description: 'Launch or expand your clothing line with custom-manufactured apparel. From startups to established brands, we handle orders of any size.',
    color: 'blue',
  },
  {
    icon: Users,
    title: 'Corporate & Teams',
    description: 'Outfit your team with custom uniforms, corporate merchandise, and branded apparel that represents your company culture.',
    color: 'purple',
  },
  {
    icon: Gift,
    title: 'Custom Gifts',
    description: 'Create unique, personalized gifts for special occasions. Perfect for events, reunions, anniversaries, and celebrations.',
    color: 'pink',
  },
  {
    icon: Briefcase,
    title: 'Agencies & Resellers',
    description: 'Partner with us for white-label manufacturing. We help agencies and resellers deliver quality products to their clients.',
    color: 'indigo',
  },
]

const colorClasses = {
  blue: {
    bg: 'bg-blue-50',
    icon: 'text-blue-600 bg-blue-100',
    hover: 'hover:bg-blue-100',
  },
  purple: {
    bg: 'bg-purple-50',
    icon: 'text-purple-600 bg-purple-100',
    hover: 'hover:bg-purple-100',
  },
  pink: {
    bg: 'bg-pink-50',
    icon: 'text-pink-600 bg-pink-100',
    hover: 'hover:bg-pink-100',
  },
  indigo: {
    bg: 'bg-indigo-50',
    icon: 'text-indigo-600 bg-indigo-100',
    hover: 'hover:bg-indigo-100',
  },
}

export default function UseCases() {
  return (
    <section className="py-20 lg:py-28">
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
            Who We{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Serve
            </span>
          </h2>
          <p className="text-lg text-gray-600">
            From startups to established enterprises, we cater to diverse needs with flexible solutions and exceptional quality.
          </p>
        </motion.div>

        {/* Use Cases Grid */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {useCases.map((useCase) => {
            const colors = colorClasses[useCase.color]
            return (
              <motion.div
                key={useCase.title}
                variants={fadeInUp}
                className={`
                  group p-6 rounded-2xl border border-gray-100
                  ${colors.bg} ${colors.hover}
                  transition-all duration-300 cursor-pointer
                  hover:shadow-xl hover:-translate-y-1
                `}
              >
                <div className={`w-14 h-14 rounded-xl ${colors.icon} flex items-center justify-center mb-4`}>
                  <useCase.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {useCase.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {useCase.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
