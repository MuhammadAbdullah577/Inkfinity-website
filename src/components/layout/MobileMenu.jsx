import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { X } from 'lucide-react'
import { mobileMenuVariants, backdropVariants } from '../../animations/variants'
import { useCompanySettings } from '../../hooks/useCompanySettings'

export default function MobileMenu({ isOpen, onClose, links }) {
  const location = useLocation()
  const { settings, getImageUrl } = useCompanySettings()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 lg:hidden"
            variants={backdropVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={onClose}
          />

          {/* Menu Panel */}
          <motion.div
            className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-white shadow-2xl lg:hidden"
            variants={mobileMenuVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              {settings.logo ? (
                <img
                  src={getImageUrl(settings.logo)}
                  alt={settings.company_name}
                  className="h-12 w-auto object-contain"
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">
                    {settings.company_short_name?.charAt(0) || 'I'}
                  </span>
                </div>
              )}
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="p-4">
              <ul className="space-y-1">
                {links.map((link, index) => (
                  <motion.li
                    key={link.path}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      transition: { delay: index * 0.05 }
                    }}
                  >
                    <Link
                      to={link.path}
                      onClick={onClose}
                      className={`
                        block px-4 py-3 rounded-lg text-sm font-medium transition-colors
                        ${location.pathname === link.path
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }
                      `}
                    >
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>

            {/* CTA Button */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
              <Link
                to="/contact"
                onClick={onClose}
                className="block w-full py-3 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transition-all"
              >
                Get a Quote
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
