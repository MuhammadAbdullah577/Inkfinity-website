import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useInquiries() {
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [unreadCount, setUnreadCount] = useState(0)

  const fetchInquiries = useCallback(async (filters = {}) => {
    try {
      setLoading(true)
      let query = supabase
        .from('contact_inquiries')
        .select('*')
        .order('created_at', { ascending: false })

      if (filters.status === 'unread') {
        query = query.eq('read', false)
      } else if (filters.status === 'read') {
        query = query.eq('read', true)
      }

      const { data, error } = await query

      if (error) throw error
      setInquiries(data || [])
      setUnreadCount(data?.filter(i => !i.read).length || 0)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching inquiries:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchInquiries()
  }, [fetchInquiries])

  const createInquiry = async (inquiryData) => {
    try {
      const { data, error } = await supabase
        .from('contact_inquiries')
        .insert([{ ...inquiryData, read: false }])
        .select()
        .single()

      if (error) throw error

      return { data, error: null }
    } catch (err) {
      console.error('Error creating inquiry:', err)
      return { data: null, error: err }
    }
  }

  const markAsRead = async (id) => {
    try {
      const { data, error } = await supabase
        .from('contact_inquiries')
        .update({ read: true })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      setInquiries(prev => prev.map(i => i.id === id ? data : i))
      setUnreadCount(prev => Math.max(0, prev - 1))
      return { data, error: null }
    } catch (err) {
      console.error('Error marking inquiry as read:', err)
      return { data: null, error: err }
    }
  }

  const markAsUnread = async (id) => {
    try {
      const { data, error } = await supabase
        .from('contact_inquiries')
        .update({ read: false })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      setInquiries(prev => prev.map(i => i.id === id ? data : i))
      setUnreadCount(prev => prev + 1)
      return { data, error: null }
    } catch (err) {
      console.error('Error marking inquiry as unread:', err)
      return { data: null, error: err }
    }
  }

  const deleteInquiry = async (id) => {
    try {
      const inquiry = inquiries.find(i => i.id === id)

      const { error } = await supabase
        .from('contact_inquiries')
        .delete()
        .eq('id', id)

      if (error) throw error

      setInquiries(prev => prev.filter(i => i.id !== id))
      if (!inquiry?.read) {
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
      return { error: null }
    } catch (err) {
      console.error('Error deleting inquiry:', err)
      return { error: err }
    }
  }

  return {
    inquiries,
    loading,
    error,
    unreadCount,
    fetchInquiries,
    createInquiry,
    markAsRead,
    markAsUnread,
    deleteInquiry,
  }
}

export default useInquiries
