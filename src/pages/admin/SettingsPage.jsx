import { useState, useEffect } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import Input, { Textarea } from '../../components/common/Input'
import Button from '../../components/common/Button'
import ImageUpload from '../../components/common/ImageUpload'
import { useCompanySettings } from '../../hooks/useCompanySettings'
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Globe,
  Image as ImageIcon,
  Save,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  Clock,
  Search,
  MessageCircle
} from 'lucide-react'

export default function SettingsPage() {
  const { settings, loading, updateSettings, removeLogo, removeFavicon, getImageUrl } = useCompanySettings()

  const [formData, setFormData] = useState({})
  const [logoFile, setLogoFile] = useState(null)
  const [faviconFile, setFaviconFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState('general')

  useEffect(() => {
    if (settings) {
      setFormData(settings)
    }
  }, [settings])

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)

    const result = await updateSettings(formData, logoFile, faviconFile)

    setSaving(false)

    if (result.error) {
      setError(result.error.message || 'Failed to save settings')
      return
    }

    setLogoFile(null)
    setFaviconFile(null)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  const handleRemoveLogo = async () => {
    await removeLogo()
    setFormData(prev => ({ ...prev, logo: null }))
  }

  const handleRemoveFavicon = async () => {
    await removeFavicon()
    setFormData(prev => ({ ...prev, favicon: null }))
  }

  const tabs = [
    { id: 'general', label: 'General', icon: Building2 },
    { id: 'contact', label: 'Contact', icon: Phone },
    { id: 'branding', label: 'Branding', icon: ImageIcon },
    { id: 'social', label: 'Social Media', icon: Globe },
    { id: 'seo', label: 'SEO', icon: Search },
  ]

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Company Settings</h1>
          <p className="text-gray-500 mt-1">Manage your company information and branding</p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            Settings saved successfully!
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex gap-4 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                  ${activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl border border-gray-200 p-6">

            {/* General Tab */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  General Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Company Name"
                    value={formData.company_name || ''}
                    onChange={(e) => handleChange('company_name', e.target.value)}
                    placeholder="Your Company Name"
                  />
                  <Input
                    label="Short Name"
                    value={formData.company_short_name || ''}
                    onChange={(e) => handleChange('company_short_name', e.target.value)}
                    placeholder="Short name for header"
                    helperText="Displayed in the header"
                  />
                </div>

                <Textarea
                  label="Tagline / Description"
                  value={formData.tagline || ''}
                  onChange={(e) => handleChange('tagline', e.target.value)}
                  placeholder="Brief description of your company"
                  rows={3}
                  helperText="Displayed in the footer"
                />
              </div>
            )}

            {/* Contact Tab */}
            {activeTab === 'contact' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Contact Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Email Address"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="contact@yourcompany.com"
                    icon={<Mail className="w-4 h-4" />}
                  />
                  <Input
                    label="Phone Number"
                    value={formData.phone || ''}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="+92 300 1234567"
                    icon={<Phone className="w-4 h-4" />}
                  />
                  <Input
                    label="WhatsApp Number"
                    value={formData.whatsapp || ''}
                    onChange={(e) => handleChange('whatsapp', e.target.value)}
                    placeholder="+92 300 1234567"
                    icon={<MessageCircle className="w-4 h-4" />}
                    helperText="For WhatsApp contact button"
                  />
                  <Input
                    label="Business Hours"
                    value={formData.business_hours || ''}
                    onChange={(e) => handleChange('business_hours', e.target.value)}
                    placeholder="Monday - Saturday, 9:00 AM - 6:00 PM"
                    icon={<Clock className="w-4 h-4" />}
                  />
                </div>

                <Textarea
                  label="Address"
                  value={formData.address || ''}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="Your business address"
                  rows={2}
                />
              </div>
            )}

            {/* Branding Tab */}
            {activeTab === 'branding' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Branding
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <ImageUpload
                      label="Company Logo"
                      value={logoFile || (formData.logo ? getImageUrl(formData.logo) : null)}
                      onChange={setLogoFile}
                      onRemove={formData.logo && !logoFile ? handleRemoveLogo : () => setLogoFile(null)}
                      aspectRatio={1}
                      helperText="Recommended: 200x200px, PNG with transparent background"
                    />
                  </div>

                  <div>
                    <ImageUpload
                      label="Favicon"
                      value={faviconFile || (formData.favicon ? getImageUrl(formData.favicon) : null)}
                      onChange={setFaviconFile}
                      onRemove={formData.favicon && !faviconFile ? handleRemoveFavicon : () => setFaviconFile(null)}
                      aspectRatio={1}
                      helperText="Recommended: 32x32px or 64x64px, PNG or ICO"
                    />
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    <strong>Note:</strong> After uploading a new favicon, you may need to clear your browser cache to see the changes.
                  </p>
                </div>
              </div>
            )}

            {/* Social Media Tab */}
            {activeTab === 'social' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Social Media Links
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Facebook"
                    value={formData.facebook_url || ''}
                    onChange={(e) => handleChange('facebook_url', e.target.value)}
                    placeholder="https://facebook.com/yourpage"
                    icon={<Facebook className="w-4 h-4" />}
                  />
                  <Input
                    label="Instagram"
                    value={formData.instagram_url || ''}
                    onChange={(e) => handleChange('instagram_url', e.target.value)}
                    placeholder="https://instagram.com/yourpage"
                    icon={<Instagram className="w-4 h-4" />}
                  />
                  <Input
                    label="LinkedIn"
                    value={formData.linkedin_url || ''}
                    onChange={(e) => handleChange('linkedin_url', e.target.value)}
                    placeholder="https://linkedin.com/company/yourcompany"
                    icon={<Linkedin className="w-4 h-4" />}
                  />
                  <Input
                    label="Twitter / X"
                    value={formData.twitter_url || ''}
                    onChange={(e) => handleChange('twitter_url', e.target.value)}
                    placeholder="https://twitter.com/yourhandle"
                    icon={<Twitter className="w-4 h-4" />}
                  />
                  <Input
                    label="YouTube"
                    value={formData.youtube_url || ''}
                    onChange={(e) => handleChange('youtube_url', e.target.value)}
                    placeholder="https://youtube.com/@yourchannel"
                    icon={<Youtube className="w-4 h-4" />}
                  />
                  <Input
                    label="TikTok"
                    value={formData.tiktok_url || ''}
                    onChange={(e) => handleChange('tiktok_url', e.target.value)}
                    placeholder="https://tiktok.com/@yourhandle"
                  />
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    Leave empty to hide the social media icon from the website.
                  </p>
                </div>
              </div>
            )}

            {/* SEO Tab */}
            {activeTab === 'seo' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  SEO Settings
                </h2>

                <Input
                  label="Meta Title"
                  value={formData.meta_title || ''}
                  onChange={(e) => handleChange('meta_title', e.target.value)}
                  placeholder="Your Company - Tagline"
                  helperText="Displayed in browser tab and search results (50-60 characters recommended)"
                />

                <Textarea
                  label="Meta Description"
                  value={formData.meta_description || ''}
                  onChange={(e) => handleChange('meta_description', e.target.value)}
                  placeholder="Brief description of your business for search engines"
                  rows={3}
                  helperText="Displayed in search results (150-160 characters recommended)"
                />

                <Textarea
                  label="Meta Keywords"
                  value={formData.meta_keywords || ''}
                  onChange={(e) => handleChange('meta_keywords', e.target.value)}
                  placeholder="keyword1, keyword2, keyword3"
                  rows={2}
                  helperText="Comma-separated keywords related to your business"
                />
              </div>
            )}

          </div>

          {/* Save Button */}
          <div className="flex justify-end mt-6">
            <Button type="submit" loading={saving} icon={Save}>
              Save Settings
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
