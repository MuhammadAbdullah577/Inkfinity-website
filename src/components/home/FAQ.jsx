import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import { staggerContainer, fadeInUp } from '../../animations/variants'

export const faqData = [
  {
    question: 'What is your minimum order quantity?',
    answer: 'We have no minimum order quantity (No MOQ). Whether you need 1 piece or 10,000 pieces, we can accommodate your order. This makes us ideal for startups, small brands, and businesses of all sizes.',
  },
  {
    question: 'What types of custom clothing do you manufacture?',
    answer: 'We manufacture a wide range of custom clothing including t-shirts, hoodies, polo shirts, jackets, sportswear, tracksuits, hats & caps, bags, and leather products. We offer full customization from fabric selection to final finishing.',
  },
  {
    question: 'How long does production take?',
    answer: 'Typical production time is 2-4 weeks depending on order size and complexity. Sample development usually takes 5-7 business days. We also offer rush production for urgent orders at an additional cost.',
  },
  {
    question: 'Do you ship internationally?',
    answer: 'Yes, we ship worldwide from our manufacturing facility in Sialkot, Pakistan. We currently serve clients in 50+ countries across North America, Europe, Australia, and the Middle East. We handle all export documentation and shipping logistics.',
  },
  {
    question: 'Can I get a sample before placing a bulk order?',
    answer: 'Absolutely! We offer sample development so you can see and feel the quality before committing to a larger order. Simply contact us with your design requirements and we will produce a sample for your approval.',
  },
  {
    question: 'What customization options are available?',
    answer: 'We offer screen printing, embroidery, heat transfer, direct-to-garment (DTG) printing, sublimation printing, cut & sew manufacturing, and private label production. You can customize everything from fabric type and color to labels, tags, and packaging.',
  },
  {
    question: 'How do I get a quote?',
    answer: 'Getting a quote is easy and free! Simply fill out our contact form or message us on WhatsApp with your requirements. Include details like product type, quantity, customization needs, and any reference images. We typically respond within 24 hours with a detailed quote.',
  },
]

function FAQItem({ faq, isOpen, onToggle }) {
  return (
    <motion.div
      variants={fadeInUp}
      className="border border-gray-200 rounded-xl overflow-hidden"
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-gray-500" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <p className="px-5 pb-5 text-gray-600 leading-relaxed">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-100px' }}
          className="space-y-4"
        >
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to know about our custom clothing manufacturing services
            </p>
          </motion.div>

          {faqData.map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
