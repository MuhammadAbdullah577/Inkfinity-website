import { motion } from 'motion/react'
import Layout from '../../components/layout/Layout'
import BlogCard from '../../components/blog/BlogCard'
import BlogGrid from '../../components/blog/BlogGrid'
import { useBlogPosts } from '../../hooks/useBlogPosts'

export default function BlogPage() {
  const { posts, loading, getFeaturedPost } = useBlogPosts(true)

  const featuredPost = getFeaturedPost()
  const regularPosts = posts.filter(p => p.id !== featuredPost?.id)

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
              Our{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Blog
              </span>
            </h1>
            <p className="text-lg text-gray-600">
              Insights, tips, and updates from the world of custom clothing manufacturing. Stay informed about industry trends and best practices.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-12">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <BlogCard post={featuredPost} featured={true} />
          </div>
        </section>
      )}

      {/* Blog Grid */}
      <section className="py-16 lg:py-24">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BlogGrid posts={regularPosts} loading={loading} />
        </div>
      </section>
    </Layout>
  )
}
