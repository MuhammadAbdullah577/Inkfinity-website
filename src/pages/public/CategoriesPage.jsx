import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import Layout from '../../components/layout/Layout'
import { useCategories } from '../../hooks/useCategories'
import { usePagination } from '../../hooks/usePagination'
import { CardSkeleton } from '../../components/common/Loader'
import { Pagination } from '../../components/admin/DataTable'
import { staggerContainer, fadeInUp } from '../../animations/variants'
import { getImageUrl } from '../../lib/supabase'
import { ArrowRight } from 'lucide-react'

export default function CategoriesPage() {
  const { categories, loading } = useCategories()

  const {
    currentPage,
    totalPages,
    totalItems,
    paginatedData: paginatedCategories,
    goToPage,
    itemsPerPage,
  } = usePagination(categories, 12)

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
              Product{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Categories
              </span>
            </h1>
            <p className="text-lg text-gray-600">
              Explore our wide range of custom clothing options. From casual wear to professional attire, we manufacture it all.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 lg:py-24">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <CardSkeleton key={index} />
              ))}
            </div>
          ) : (
            <>
              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {paginatedCategories.map((category) => (
                  <CategoryCard key={category.id} category={category} />
                ))}
              </motion.div>

              {totalPages > 1 && (
                <div className="mt-12">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    onPageChange={goToPage}
                  />
                </div>
              )}
            </>
          )}

          {!loading && categories.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-lg font-medium text-gray-900 mb-1">No categories found</h3>
              <p className="text-gray-500">Categories will appear here once added.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  )
}

function CategoryCard({ category }) {
  const imageUrl = category.image
    ? getImageUrl(category.image)
    : 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&h=400&fit=crop'

  return (
    <motion.div variants={fadeInUp}>
      <Link
        to={`/categories/${category.slug}`}
        className="group block bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          <img
            src={imageUrl}
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h3 className="text-2xl font-bold text-white mb-1">
              {category.name}
            </h3>
            {category.description && (
              <p className="text-white/80 text-sm line-clamp-2">
                {category.description}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            View Products
          </span>
          <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
        </div>
      </Link>
    </motion.div>
  )
}
