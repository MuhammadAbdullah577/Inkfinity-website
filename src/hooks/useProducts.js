import { useState, useEffect, useCallback } from 'react'
import { supabase, uploadMultipleImages, deleteImage, getImageUrl } from '../lib/supabase'

export function useProducts(categoryId = null) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProducts = useCallback(async (filters = {}) => {
    try {
      setLoading(true)
      let query = supabase
        .from('products')
        .select(`
          *,
          category:categories(id, name, slug)
        `)
        .order('created_at', { ascending: false })

      if (filters.categoryId || categoryId) {
        query = query.eq('category_id', filters.categoryId || categoryId)
      }

      if (filters.search) {
        query = query.ilike('name', `%${filters.search}%`)
      }

      const { data, error } = await query

      if (error) throw error
      setProducts(data || [])
    } catch (err) {
      setError(err.message)
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }, [categoryId])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const createProduct = async (productData, imageFiles) => {
    try {
      let images = []

      if (imageFiles && imageFiles.length > 0) {
        const { fileNames, failed } = await uploadMultipleImages(imageFiles, 'product-images', 'products')
        if (failed.length > 0) {
          console.warn('Some images failed to upload:', failed)
        }
        images = fileNames
      }

      const { data, error } = await supabase
        .from('products')
        .insert([{ ...productData, images }])
        .select(`
          *,
          category:categories(id, name, slug)
        `)
        .single()

      if (error) throw error

      setProducts(prev => [data, ...prev])
      return { data, error: null }
    } catch (err) {
      console.error('Error creating product:', err)
      return { data: null, error: err }
    }
  }

  const updateProduct = async (id, productData, newImageFiles, imagesToRemove = []) => {
    try {
      const product = products.find(p => p.id === id)
      let currentImages = product?.images || []

      // Remove specified images
      for (const imagePath of imagesToRemove) {
        await deleteImage(imagePath)
        currentImages = currentImages.filter(img => img !== imagePath)
      }

      // Add new images
      if (newImageFiles && newImageFiles.length > 0) {
        const { fileNames } = await uploadMultipleImages(newImageFiles, 'product-images', 'products')
        currentImages = [...currentImages, ...fileNames]
      }

      const updateData = {
        ...productData,
        images: currentImages,
      }

      const { data, error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', id)
        .select(`
          *,
          category:categories(id, name, slug)
        `)
        .single()

      if (error) throw error

      setProducts(prev => prev.map(p => p.id === id ? data : p))
      return { data, error: null }
    } catch (err) {
      console.error('Error updating product:', err)
      return { data: null, error: err }
    }
  }

  const deleteProduct = async (id) => {
    try {
      const product = products.find(p => p.id === id)

      // Delete all images
      if (product?.images) {
        for (const imagePath of product.images) {
          await deleteImage(imagePath)
        }
      }

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error

      setProducts(prev => prev.filter(p => p.id !== id))
      return { error: null }
    } catch (err) {
      console.error('Error deleting product:', err)
      return { error: err }
    }
  }

  const getProductById = useCallback((id) => {
    return products.find(p => p.id === id)
  }, [products])

  const fetchTrendingProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(id, name, slug)
        `)
        .eq('is_trending', true)
        .order('trending_order', { ascending: true })

      if (error) throw error
      return { data: data || [], error: null }
    } catch (err) {
      console.error('Error fetching trending products:', err)
      return { data: [], error: err }
    }
  }

  const updateTrendingStatus = async (productId, isTrending, trendingOrder = 0) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({ is_trending: isTrending, trending_order: trendingOrder })
        .eq('id', productId)
        .select()
        .single()

      if (error) throw error

      setProducts(prev => prev.map(p => p.id === productId ? { ...p, ...data } : p))
      return { data, error: null }
    } catch (err) {
      console.error('Error updating trending status:', err)
      return { data: null, error: err }
    }
  }

  const bulkUpdateTrending = async (trendingProducts) => {
    try {
      // First, clear all trending flags
      await supabase
        .from('products')
        .update({ is_trending: false, trending_order: 0 })
        .eq('is_trending', true)

      // Then set the new trending products with their order
      for (let i = 0; i < trendingProducts.length; i++) {
        await supabase
          .from('products')
          .update({ is_trending: true, trending_order: i })
          .eq('id', trendingProducts[i].id)
      }

      // Refresh products
      await fetchProducts()
      return { error: null }
    } catch (err) {
      console.error('Error bulk updating trending:', err)
      return { error: err }
    }
  }

  return {
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    fetchTrendingProducts,
    updateTrendingStatus,
    bulkUpdateTrending,
    getImageUrl,
  }
}

export default useProducts
