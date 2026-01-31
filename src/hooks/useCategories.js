import { useState, useEffect, useCallback } from 'react'
import { supabase, uploadImage, deleteImage, getImageUrl } from '../lib/supabase'

export function useCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      if (error) throw error
      setCategories(data || [])
    } catch (err) {
      setError(err.message)
      console.error('Error fetching categories:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const createCategory = async (categoryData, imageFile) => {
    try {
      let imagePath = null

      if (imageFile) {
        const { fileName, error: uploadError } = await uploadImage(imageFile, 'product-images', 'categories')
        if (uploadError) throw uploadError
        imagePath = fileName
      }

      const { data, error } = await supabase
        .from('categories')
        .insert([{ ...categoryData, image: imagePath }])
        .select()
        .single()

      if (error) throw error

      setCategories(prev => [...prev, data])
      return { data, error: null }
    } catch (err) {
      console.error('Error creating category:', err)
      return { data: null, error: err }
    }
  }

  const updateCategory = async (id, categoryData, imageFile) => {
    try {
      let updateData = { ...categoryData }

      if (imageFile) {
        // Delete old image if exists
        const oldCategory = categories.find(c => c.id === id)
        if (oldCategory?.image) {
          await deleteImage(oldCategory.image)
        }

        const { fileName, error: uploadError } = await uploadImage(imageFile, 'product-images', 'categories')
        if (uploadError) throw uploadError
        updateData.image = fileName
      }

      const { data, error } = await supabase
        .from('categories')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      setCategories(prev => prev.map(c => c.id === id ? data : c))
      return { data, error: null }
    } catch (err) {
      console.error('Error updating category:', err)
      return { data: null, error: err }
    }
  }

  const deleteCategory = async (id) => {
    try {
      const category = categories.find(c => c.id === id)

      // Delete image if exists
      if (category?.image) {
        await deleteImage(category.image)
      }

      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)

      if (error) throw error

      setCategories(prev => prev.filter(c => c.id !== id))
      return { error: null }
    } catch (err) {
      console.error('Error deleting category:', err)
      return { error: err }
    }
  }

  const getCategoryBySlug = useCallback((slug) => {
    return categories.find(c => c.slug === slug)
  }, [categories])

  return {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryBySlug,
    getImageUrl,
  }
}

export default useCategories
