import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Calendar, ArrowRight } from 'lucide-react'
import { getImageUrl } from '../../lib/supabase'

export default function BlogCard({ post, featured = false }) {
  const imageUrl = post.cover_image
    ? getImageUrl(post.cover_image)
    : '/placeholder-blog.jpg'

  const formattedDate = new Date(post.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  if (featured) {
    return (
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="group relative grid md:grid-cols-2 gap-6 lg:gap-12 bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
      >
        {/* Image */}
        <div className="relative aspect-video md:aspect-auto overflow-hidden">
          <img
            src={imageUrl}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
              Featured
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:py-8 md:pr-8 md:pl-0 flex flex-col justify-center">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
            <Calendar className="w-4 h-4" />
            {formattedDate}
          </div>
          <Link to={`/blog/${post.slug}`}>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
              {post.title}
            </h2>
          </Link>
          <p className="text-gray-600 mb-6 line-clamp-3">
            {post.excerpt || post.content?.substring(0, 200)}
          </p>
          <Link
            to={`/blog/${post.slug}`}
            className="inline-flex items-center gap-2 text-blue-600 font-medium group/link"
          >
            Read More
            <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </motion.article>
    )
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={imageUrl}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
          <Calendar className="w-4 h-4" />
          {formattedDate}
        </div>
        <Link to={`/blog/${post.slug}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm line-clamp-2">
          {post.excerpt || post.content?.substring(0, 100)}
        </p>
      </div>
    </motion.article>
  )
}
