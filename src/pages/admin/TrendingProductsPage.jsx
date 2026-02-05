import { useState, useEffect, useCallback } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import Button from '../../components/common/Button'
import { supabase, getImageUrl } from '../../lib/supabase'
import {
  TrendingUp,
  Save,
  GripVertical,
  Check,
  X,
  Search,
  ArrowUp,
  ArrowDown
} from 'lucide-react'

export default function TrendingProductsPage() {
  const [allProducts, setAllProducts] = useState([])
  const [trendingProducts, setTrendingProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(id, name, slug)
        `)
        .order('name', { ascending: true })

      if (error) throw error

      setAllProducts(data || [])

      // Extract trending products in order
      const trending = (data || [])
        .filter(p => p.is_trending)
        .sort((a, b) => (a.trending_order || 0) - (b.trending_order || 0))
      setTrendingProducts(trending)
    } catch (err) {
      console.error('Error fetching products:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleToggleTrending = (product) => {
    const isTrending = trendingProducts.some(p => p.id === product.id)

    if (isTrending) {
      setTrendingProducts(prev => prev.filter(p => p.id !== product.id))
    } else {
      setTrendingProducts(prev => [...prev, product])
    }
  }

  const handleMoveUp = (index) => {
    if (index === 0) return
    const newOrder = [...trendingProducts]
    ;[newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]]
    setTrendingProducts(newOrder)
  }

  const handleMoveDown = (index) => {
    if (index === trendingProducts.length - 1) return
    const newOrder = [...trendingProducts]
    ;[newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]]
    setTrendingProducts(newOrder)
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError(null)
      setSuccess(false)

      // First, clear all trending flags
      const { error: clearError } = await supabase
        .from('products')
        .update({ is_trending: false, trending_order: 0 })
        .eq('is_trending', true)

      if (clearError) throw clearError

      // Then set the new trending products with their order
      for (let i = 0; i < trendingProducts.length; i++) {
        const { error: updateError } = await supabase
          .from('products')
          .update({ is_trending: true, trending_order: i })
          .eq('id', trendingProducts[i].id)

        if (updateError) throw updateError
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)

      // Refresh products
      await fetchProducts()
    } catch (err) {
      console.error('Error saving trending products:', err)
      setError(err.message || 'Failed to save trending products')
    } finally {
      setSaving(false)
    }
  }

  const filteredProducts = allProducts.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const nonTrendingProducts = filteredProducts.filter(
    p => !trendingProducts.some(t => t.id === p.id)
  )

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              Trending Products
            </h1>
            <p className="text-gray-500 mt-1">
              Select and order products to display in the trending section on the homepage
            </p>
          </div>
          <Button onClick={handleSave} loading={saving} icon={Save}>
            Save Changes
          </Button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            Trending products saved successfully!
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Trending Products (Selected) */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-blue-50">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                Selected Trending Products
                <span className="ml-auto text-sm font-normal text-gray-500">
                  {trendingProducts.length} selected
                </span>
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Drag to reorder or use arrows. First product appears first in carousel.
              </p>
            </div>

            <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
              {trendingProducts.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <TrendingUp className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No trending products selected</p>
                  <p className="text-sm mt-1">Select products from the list on the right</p>
                </div>
              ) : (
                trendingProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleMoveDown(index)}
                        disabled={index === trendingProducts.length - 1}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>

                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>

                    <img
                      src={product.images?.[0] ? getImageUrl(product.images[0]) : '/placeholder-product.jpg'}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                    />

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.category?.name || 'Uncategorized'}</p>
                    </div>

                    <button
                      onClick={() => handleToggleTrending(product)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove from trending"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* All Products (Available) */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900 mb-3">All Products</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
              {nonTrendingProducts.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <p>No products found</p>
                </div>
              ) : (
                nonTrendingProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleToggleTrending(product)}
                  >
                    <img
                      src={product.images?.[0] ? getImageUrl(product.images[0]) : '/placeholder-product.jpg'}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                    />

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.category?.name || 'Uncategorized'}</p>
                    </div>

                    <button
                      className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                      title="Add to trending"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-blue-50 rounded-xl p-4">
          <h3 className="font-medium text-blue-900 mb-2">Tips</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>Select 4-8 products for the best carousel experience</li>
            <li>Products appear in the order shown on the left panel</li>
            <li>Changes are not saved until you click "Save Changes"</li>
            <li>The carousel will only appear on the homepage if at least one product is selected</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  )
}
