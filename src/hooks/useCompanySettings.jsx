import { useState, useEffect, useCallback, createContext, useContext } from 'react'
import { supabase, uploadImage, deleteImage, getImageUrl } from '../lib/supabase'

// Default settings used as fallback
const defaultSettings = {
  // Basic Info
  company_name: 'Inkfinity Creation',
  company_short_name: 'Inkfinity',
  tagline: 'Premium custom clothing manufacturer offering high-quality products with no minimum order quantity. From concept to creation, we bring your vision to life.',

  // Contact Info
  email: 'info@inkfinitycreation.com',
  phone: '+92 300 1234567',
  whatsapp: '+92 300 1234567',
  address: 'Sialkot, Punjab, Pakistan',
  business_hours: 'Monday - Saturday, 9:00 AM - 6:00 PM (PKT)',

  // Branding
  logo: null,
  logo_dark: null,
  favicon: null,

  // Social Media
  facebook_url: '',
  instagram_url: '',
  linkedin_url: '',
  twitter_url: '',
  youtube_url: '',
  tiktok_url: '',

  // SEO / Meta
  meta_title: 'Inkfinity Creation - Premium Custom Clothing Manufacturer',
  meta_description: 'Inkfinity Creation - Premium custom clothing manufacturer. No minimum order quantity. Custom t-shirts, hoodies, jackets, sportswear and more.',
  meta_keywords: 'custom clothing, clothing manufacturer, t-shirts, hoodies, jackets, sportswear, no MOQ, Sialkot, Pakistan',

  // Footer
  footer_categories: [],
}

// Context for global access
const CompanySettingsContext = createContext(null)

export function CompanySettingsProvider({ children }) {
  const settingsHook = useCompanySettingsInternal()

  return (
    <CompanySettingsContext.Provider value={settingsHook}>
      {children}
    </CompanySettingsContext.Provider>
  )
}

// Hook for consuming context
export function useCompanySettings() {
  const context = useContext(CompanySettingsContext)
  if (context) {
    return context
  }
  // Fallback for when used outside provider (returns defaults)
  return {
    settings: defaultSettings,
    loading: false,
    error: null,
    updateSettings: async () => ({ error: { message: 'Provider not found' } }),
    getImageUrl,
  }
}

// Internal hook with actual logic
function useCompanySettingsInternal() {
  const [settings, setSettings] = useState(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('company_settings')
        .select('*')
        .single()

      if (error) {
        // If no settings exist yet, use defaults
        if (error.code === 'PGRST116') {
          setSettings(defaultSettings)
          return
        }
        throw error
      }

      // Merge with defaults to ensure all fields exist
      setSettings({ ...defaultSettings, ...data })
    } catch (err) {
      setError(err.message)
      console.error('Error fetching company settings:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  // Dynamically update favicon in browser tab with rounded corners
  useEffect(() => {
    if (settings.favicon) {
      const faviconUrl = getImageUrl(settings.favicon)

      // Load image and apply rounded corners via canvas
      const img = new Image()
      img.crossOrigin = 'anonymous' // Required for canvas with external images
      img.onload = () => {
        const size = 32 // Standard favicon size
        const radius = 8 // Medium rounded corners

        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext('2d')

        // Draw rounded rectangle clipping path
        ctx.beginPath()
        ctx.roundRect(0, 0, size, size, radius)
        ctx.clip()

        // Draw the image
        ctx.drawImage(img, 0, 0, size, size)

        // Convert to data URL and set as favicon
        const dataUrl = canvas.toDataURL('image/png')
        let link = document.querySelector("link[rel~='icon']")
        if (!link) {
          link = document.createElement('link')
          link.rel = 'icon'
          document.head.appendChild(link)
        }
        link.href = dataUrl
      }
      img.src = faviconUrl
    }
  }, [settings.favicon])

  const updateSettings = async (newSettings, logoFile = null, faviconFile = null, logoDarkFile = null) => {
    try {
      let updateData = { ...newSettings }

      // Handle logo upload
      if (logoFile) {
        // Delete old logo if exists
        if (settings.logo) {
          await deleteImage(settings.logo)
        }
        const { fileName, error: uploadError } = await uploadImage(logoFile, 'product-images', 'branding')
        if (uploadError) throw uploadError
        updateData.logo = fileName
      }

      // Handle dark logo upload
      if (logoDarkFile) {
        // Delete old dark logo if exists
        if (settings.logo_dark) {
          await deleteImage(settings.logo_dark)
        }
        const { fileName, error: uploadError } = await uploadImage(logoDarkFile, 'product-images', 'branding')
        if (uploadError) throw uploadError
        updateData.logo_dark = fileName
      }

      // Handle favicon upload
      if (faviconFile) {
        // Delete old favicon if exists
        if (settings.favicon) {
          await deleteImage(settings.favicon)
        }
        const { fileName, error: uploadError } = await uploadImage(faviconFile, 'product-images', 'branding')
        if (uploadError) throw uploadError
        updateData.favicon = fileName
      }

      // Check if settings row exists
      const { data: existing } = await supabase
        .from('company_settings')
        .select('id')
        .single()

      let result
      if (existing) {
        // Update existing
        result = await supabase
          .from('company_settings')
          .update(updateData)
          .eq('id', existing.id)
          .select()
          .single()
      } else {
        // Insert new
        result = await supabase
          .from('company_settings')
          .insert([updateData])
          .select()
          .single()
      }

      if (result.error) throw result.error

      setSettings({ ...defaultSettings, ...result.data })
      return { data: result.data, error: null }
    } catch (err) {
      console.error('Error updating company settings:', err)
      return { data: null, error: err }
    }
  }

  const removeLogo = async () => {
    try {
      if (settings.logo) {
        await deleteImage(settings.logo)
      }

      const { data: existing } = await supabase
        .from('company_settings')
        .select('id')
        .single()

      if (existing) {
        await supabase
          .from('company_settings')
          .update({ logo: null })
          .eq('id', existing.id)
      }

      setSettings(prev => ({ ...prev, logo: null }))
      return { error: null }
    } catch (err) {
      console.error('Error removing logo:', err)
      return { error: err }
    }
  }

  const removeFavicon = async () => {
    try {
      if (settings.favicon) {
        await deleteImage(settings.favicon)
      }

      const { data: existing } = await supabase
        .from('company_settings')
        .select('id')
        .single()

      if (existing) {
        await supabase
          .from('company_settings')
          .update({ favicon: null })
          .eq('id', existing.id)
      }

      setSettings(prev => ({ ...prev, favicon: null }))
      return { error: null }
    } catch (err) {
      console.error('Error removing favicon:', err)
      return { error: err }
    }
  }

  const removeDarkLogo = async () => {
    try {
      if (settings.logo_dark) {
        await deleteImage(settings.logo_dark)
      }

      const { data: existing } = await supabase
        .from('company_settings')
        .select('id')
        .single()

      if (existing) {
        await supabase
          .from('company_settings')
          .update({ logo_dark: null })
          .eq('id', existing.id)
      }

      setSettings(prev => ({ ...prev, logo_dark: null }))
      return { error: null }
    } catch (err) {
      console.error('Error removing dark logo:', err)
      return { error: err }
    }
  }

  return {
    settings,
    loading,
    error,
    fetchSettings,
    updateSettings,
    removeLogo,
    removeDarkLogo,
    removeFavicon,
    getImageUrl,
    defaultSettings,
  }
}

export default useCompanySettings
