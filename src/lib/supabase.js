import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

// Image upload helper
export const uploadImage = async (file, bucket = 'product-images', folder = '') => {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${folder ? folder + '/' : ''}${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) throw error

    return { data, fileName, error: null }
  } catch (error) {
    console.error('Error uploading image:', error)
    return { data: null, fileName: null, error }
  }
}

// Delete image helper
export const deleteImage = async (filePath, bucket = 'product-images') => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath])

    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error('Error deleting image:', error)
    return { error }
  }
}

// Get public URL for an image
export const getImageUrl = (filePath, bucket = 'product-images') => {
  if (!filePath) return null

  // If it's already a full URL, return it
  if (filePath.startsWith('http')) return filePath

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath)

  return data?.publicUrl || null
}

// Upload multiple images
export const uploadMultipleImages = async (files, bucket = 'product-images', folder = '') => {
  const results = await Promise.all(
    Array.from(files).map(file => uploadImage(file, bucket, folder))
  )

  const successful = results.filter(r => !r.error)
  const failed = results.filter(r => r.error)

  return {
    successful,
    failed,
    fileNames: successful.map(r => r.fileName)
  }
}
