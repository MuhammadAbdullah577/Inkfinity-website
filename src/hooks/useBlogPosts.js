import { useState, useEffect, useCallback } from 'react'
import { supabase, uploadImage, deleteImage, getImageUrl } from '../lib/supabase'

export function useBlogPosts(publishedOnly = false) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false })

      if (publishedOnly) {
        query = query.eq('published', true)
      }

      const { data, error } = await query

      if (error) throw error
      setPosts(data || [])
    } catch (err) {
      setError(err.message)
      console.error('Error fetching blog posts:', err)
    } finally {
      setLoading(false)
    }
  }, [publishedOnly])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const createPost = async (postData, coverImage) => {
    try {
      let coverImagePath = null

      if (coverImage) {
        const { fileName, error: uploadError } = await uploadImage(coverImage, 'product-images', 'blog')
        if (uploadError) throw uploadError
        coverImagePath = fileName
      }

      const { data, error } = await supabase
        .from('blog_posts')
        .insert([{ ...postData, cover_image: coverImagePath }])
        .select()
        .single()

      if (error) throw error

      setPosts(prev => [data, ...prev])
      return { data, error: null }
    } catch (err) {
      console.error('Error creating blog post:', err)
      return { data: null, error: err }
    }
  }

  const updatePost = async (id, postData, coverImage) => {
    try {
      let updateData = { ...postData }

      if (coverImage) {
        // Delete old image if exists
        const oldPost = posts.find(p => p.id === id)
        if (oldPost?.cover_image) {
          await deleteImage(oldPost.cover_image)
        }

        const { fileName, error: uploadError } = await uploadImage(coverImage, 'product-images', 'blog')
        if (uploadError) throw uploadError
        updateData.cover_image = fileName
      }

      const { data, error } = await supabase
        .from('blog_posts')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      setPosts(prev => prev.map(p => p.id === id ? data : p))
      return { data, error: null }
    } catch (err) {
      console.error('Error updating blog post:', err)
      return { data: null, error: err }
    }
  }

  const deletePost = async (id) => {
    try {
      const post = posts.find(p => p.id === id)

      // Delete cover image if exists
      if (post?.cover_image) {
        await deleteImage(post.cover_image)
      }

      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id)

      if (error) throw error

      setPosts(prev => prev.filter(p => p.id !== id))
      return { error: null }
    } catch (err) {
      console.error('Error deleting blog post:', err)
      return { error: err }
    }
  }

  const togglePublished = async (id) => {
    try {
      const post = posts.find(p => p.id === id)
      if (!post) throw new Error('Post not found')

      const { data, error } = await supabase
        .from('blog_posts')
        .update({ published: !post.published })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      setPosts(prev => prev.map(p => p.id === id ? data : p))
      return { data, error: null }
    } catch (err) {
      console.error('Error toggling published status:', err)
      return { data: null, error: err }
    }
  }

  const getPostBySlug = useCallback((slug) => {
    return posts.find(p => p.slug === slug)
  }, [posts])

  const getFeaturedPost = useCallback(() => {
    return posts.find(p => p.featured && p.published)
  }, [posts])

  return {
    posts,
    loading,
    error,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
    togglePublished,
    getPostBySlug,
    getFeaturedPost,
    getImageUrl,
  }
}

export default useBlogPosts
