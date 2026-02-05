import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react'
import { useCompanySettings } from '../../hooks/useCompanySettings'

const footerLinks = {
  products: [
    { name: 'T-Shirts', path: '/categories/t-shirts' },
    { name: 'Hoodies', path: '/categories/hoodies' },
    { name: 'Jackets', path: '/categories/jackets' },
    { name: 'Sportswear', path: '/categories/sportswear' },
    { name: 'Polo Shirts', path: '/categories/polo-shirts' },
  ],
  company: [
    { name: 'About Us', path: '/about' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ],
  support: [
    { name: 'FAQ', path: '/faq' },
    { name: 'Shipping Info', path: '/shipping' },
    { name: 'Size Guide', path: '/size-guide' },
  ],
}

export default function Footer() {
  const { settings, getImageUrl } = useCompanySettings()

  // Build social links dynamically based on settings
  const socialLinks = [
    settings.facebook_url && { icon: Facebook, href: settings.facebook_url, label: 'Facebook' },
    settings.instagram_url && { icon: Instagram, href: settings.instagram_url, label: 'Instagram' },
    settings.linkedin_url && { icon: Linkedin, href: settings.linkedin_url, label: 'LinkedIn' },
    settings.twitter_url && { icon: Twitter, href: settings.twitter_url, label: 'Twitter' },
    settings.youtube_url && { icon: Youtube, href: settings.youtube_url, label: 'YouTube' },
  ].filter(Boolean)

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              {settings.logo ? (
                <img
                  src={getImageUrl(settings.logo)}
                  alt={settings.company_name}
                  className="w-10 h-10 rounded-xl object-contain"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {settings.company_short_name?.charAt(0) || 'I'}
                  </span>
                </div>
              )}
              <span className="text-xl font-bold text-white">
                {settings.company_name}
              </span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-sm">
              {settings.tagline}
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              {settings.address && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-blue-400 shrink-0" />
                  <span>{settings.address}</span>
                </div>
              )}
              {settings.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-400 shrink-0" />
                  <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors">
                    {settings.email}
                  </a>
                </div>
              )}
              {settings.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-blue-400 shrink-0" />
                  <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="hover:text-white transition-colors">
                    {settings.phone}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Products Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Products</h3>
            <ul className="space-y-2">
              {footerLinks.products.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">
              {new Date().getFullYear()} {settings.company_name}. All rights reserved.
            </p>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
