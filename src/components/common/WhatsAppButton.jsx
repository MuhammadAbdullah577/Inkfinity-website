import { motion } from 'motion/react'
import { useCompanySettings } from '../../hooks/useCompanySettings'

export default function WhatsAppButton() {
  const { settings } = useCompanySettings()

  if (!settings.whatsapp) return null

  const cleanNumber = settings.whatsapp.replace(/[^+\d]/g, '')
  const message = encodeURIComponent(
    "Hi! I'm interested in your custom clothing services. Can you help me with a quote?"
  )
  const href = `https://wa.me/${cleanNumber}?text=${message}`

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#25D366] text-white shadow-lg hover:shadow-xl transition-shadow"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <svg
        viewBox="0 0 32 32"
        fill="currentColor"
        className="w-7 h-7 sm:w-8 sm:h-8"
      >
        <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.96A15.9 15.9 0 0016.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.32 22.616c-.39 1.1-1.932 2.014-3.168 2.28-.846.18-1.95.324-5.67-1.218-4.762-1.972-7.828-6.81-8.066-7.124-.228-.314-1.918-2.554-1.918-4.872s1.214-3.456 1.644-3.928c.43-.472.94-.59 1.254-.59.314 0 .628.002.902.016.29.014.678-.11 1.06.808.39.94 1.332 3.242 1.45 3.478.118.236.196.51.04.824-.158.314-.236.51-.472.786-.236.274-.498.614-.71.824-.236.236-.482.492-.208.964.274.472 1.22 2.012 2.62 3.26 1.8 1.604 3.316 2.1 3.786 2.336.472.236.746.196 1.02-.118.274-.314 1.178-1.374 1.492-1.846.314-.472.628-.39 1.06-.236.43.158 2.732 1.29 3.202 1.524.472.236.786.354.902.55.118.196.118 1.138-.274 2.236z" />
      </svg>
      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping" />
      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full" />
    </motion.a>
  )
}
