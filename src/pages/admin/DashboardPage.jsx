import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import AdminLayout from '../../components/admin/AdminLayout'
import StatsCard from '../../components/admin/StatsCard'
import { useCategories } from '../../hooks/useCategories'
import { useProducts } from '../../hooks/useProducts'
import { useBlogPosts } from '../../hooks/useBlogPosts'
import { useInquiries } from '../../hooks/useInquiries'
import {
  FolderTree,
  Package,
  FileText,
  MessageSquare,
  ArrowRight,
  Clock
} from 'lucide-react'

export default function DashboardPage() {
  const { categories } = useCategories()
  const { products } = useProducts()
  const { posts } = useBlogPosts()
  const { inquiries, unreadCount } = useInquiries()

  const recentInquiries = inquiries.slice(0, 5)

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome to your admin dashboard</p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Categories"
            value={categories.length}
            icon={FolderTree}
            color="blue"
          />
          <StatsCard
            title="Total Products"
            value={products.length}
            icon={Package}
            color="purple"
          />
          <StatsCard
            title="Blog Posts"
            value={posts.length}
            icon={FileText}
            color="green"
          />
          <StatsCard
            title="New Inquiries"
            value={unreadCount}
            icon={MessageSquare}
            color="orange"
          />
        </div>

        {/* Recent Inquiries & Quick Actions */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Inquiries */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Recent Inquiries</h2>
              <Link
                to="/admin/inquiries"
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="divide-y divide-gray-200">
              {recentInquiries.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No inquiries yet
                </div>
              ) : (
                recentInquiries.map((inquiry) => (
                  <motion.div
                    key={inquiry.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{inquiry.name}</p>
                        <p className="text-sm text-gray-500">{inquiry.email}</p>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                          {inquiry.message}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        {new Date(inquiry.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                to="/admin/products"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors group"
              >
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 group-hover:text-blue-600">
                    Add Product
                  </p>
                  <p className="text-xs text-gray-500">Create a new product</p>
                </div>
              </Link>
              <Link
                to="/admin/categories"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 transition-colors group"
              >
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FolderTree className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 group-hover:text-purple-600">
                    Add Category
                  </p>
                  <p className="text-xs text-gray-500">Create a new category</p>
                </div>
              </Link>
              <Link
                to="/admin/blog"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-50 transition-colors group"
              >
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileText className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 group-hover:text-green-600">
                    Write Blog Post
                  </p>
                  <p className="text-xs text-gray-500">Create a new article</p>
                </div>
              </Link>
              <Link
                to="/admin/inquiries"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-orange-50 transition-colors group"
              >
                <div className="p-2 bg-orange-100 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 group-hover:text-orange-600">
                    View Inquiries
                  </p>
                  <p className="text-xs text-gray-500">
                    {unreadCount} unread messages
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
