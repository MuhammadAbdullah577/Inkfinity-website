import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { motion } from 'motion/react'
import Layout from '../../components/layout/Layout'
import ProductGrid from '../../components/products/ProductGrid'
import ProductFilters from '../../components/products/ProductFilters'
import Modal from '../../components/common/Modal'
import { useProducts } from '../../hooks/useProducts'
import { useCategories } from '../../hooks/useCategories'
import { getImageUrl } from '../../lib/supabase'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function ProductGalleryPage() {
  const { slug } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()

  const { categories } = useCategories()
  const { products, loading, fetchProducts } = useProducts()

  const [selectedCategory, setSelectedCategory] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState(null)

  // Set category from URL slug
  useEffect(() => {
    if (slug && categories.length > 0) {
      const category = categories.find(c => c.slug === slug)
      if (category) {
        setSelectedCategory(category.id)
      }
    }
  }, [slug, categories])

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts({
      categoryId: selectedCategory,
      search: searchQuery,
    })
  }, [selectedCategory, searchQuery, fetchProducts])

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId)
    // Update URL
    if (categoryId) {
      const category = categories.find(c => c.id === categoryId)
      if (category) {
        setSearchParams({ category: category.slug })
      }
    } else {
      setSearchParams({})
    }
  }

  const currentCategory = categories.find(c => c.id === selectedCategory)

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              {currentCategory ? currentCategory.name : 'Our'}{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Products
              </span>
            </h1>
            <p className="text-lg text-gray-600">
              {currentCategory?.description ||
                'Browse our complete collection of custom-manufactured clothing. Each piece is crafted with precision and care.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 lg:py-24">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <ProductFilters
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              showMobileFilters={showMobileFilters}
              onToggleMobileFilters={() => setShowMobileFilters(!showMobileFilters)}
            />

            <div className="flex-1 min-w-0">
              <ProductGrid
                products={products}
                loading={loading}
                onQuickView={setQuickViewProduct}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <ProductQuickView
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </Layout>
  )
}

function ProductQuickView({ product, onClose }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const images = product.images || []

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <Modal isOpen={true} onClose={onClose} size="lg" title={product.name}>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Image Gallery */}
        <div className="relative">
          <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
            {images.length > 0 ? (
              <img
                src={getImageUrl(images[currentImageIndex])}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No image
              </div>
            )}
          </div>

          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow hover:bg-white"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow hover:bg-white"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 mt-4">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`
                    w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors
                    ${index === currentImageIndex ? 'border-blue-600' : 'border-transparent'}
                  `}
                >
                  <img
                    src={getImageUrl(img)}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          {product.category && (
            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-sm font-medium rounded-full mb-3">
              {product.category.name}
            </span>
          )}
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {product.name}
          </h2>
          {product.description && (
            <p className="text-gray-600 mb-6">
              {product.description}
            </p>
          )}
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transition-all"
          >
            Request Quote
          </a>
        </div>
      </div>
    </Modal>
  )
}
