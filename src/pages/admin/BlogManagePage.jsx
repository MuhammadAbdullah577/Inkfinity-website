import { useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import DataTable, { Pagination } from '../../components/admin/DataTable'
import Modal, { ModalFooter } from '../../components/common/Modal'
import Input, { Textarea } from '../../components/common/Input'
import Button from '../../components/common/Button'
import ImageUpload from '../../components/common/ImageUpload'
import { useBlogPosts } from '../../hooks/useBlogPosts'
import { usePagination } from '../../hooks/usePagination'
import { getImageUrl } from '../../lib/supabase'
import { Plus, Pencil, Trash2, Image as ImageIcon, Eye, EyeOff } from 'lucide-react'

export default function BlogManagePage() {
  const { posts, loading, createPost, updatePost, deletePost, togglePublished } = useBlogPosts()

  const {
    currentPage,
    totalPages,
    totalItems,
    paginatedData: paginatedPosts,
    goToPage,
    itemsPerPage,
  } = usePagination(posts, 15)

  const [modalOpen, setModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured: false,
    published: false,
  })
  const [coverImage, setCoverImage] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const columns = [
    {
      key: 'cover_image',
      label: 'Cover',
      width: '80px',
      render: (value) => (
        <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-100">
          {value ? (
            <img
              src={getImageUrl(value)}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-gray-400" />
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'title',
      label: 'Title',
      render: (value) => (
        <span className="font-medium text-gray-900">{value}</span>
      ),
    },
    {
      key: 'published',
      label: 'Status',
      render: (value) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            value
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {value ? 'Published' : 'Draft'}
        </span>
      ),
    },
    {
      key: 'featured',
      label: 'Featured',
      render: (value) => (
        value ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            Featured
          </span>
        ) : null
      ),
    },
    {
      key: 'created_at',
      label: 'Created',
      render: (value) => (
        <span className="text-sm text-gray-500">
          {new Date(value).toLocaleDateString()}
        </span>
      ),
    },
  ]

  const handleAdd = () => {
    setSelectedPost(null)
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      featured: false,
      published: false,
    })
    setCoverImage(null)
    setError(null)
    setModalOpen(true)
  }

  const handleEdit = (post) => {
    setSelectedPost(post)
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      content: post.content || '',
      featured: post.featured || false,
      published: post.published || false,
    })
    setCoverImage(null)
    setError(null)
    setModalOpen(true)
  }

  const handleDelete = (post) => {
    setSelectedPost(post)
    setDeleteModalOpen(true)
  }

  const handleTogglePublish = async (post) => {
    await togglePublished(post.id)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const slug = formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-')

    let result
    if (selectedPost) {
      result = await updatePost(selectedPost.id, { ...formData, slug }, coverImage)
    } else {
      result = await createPost({ ...formData, slug }, coverImage)
    }

    setSaving(false)

    if (result?.error) {
      setError(result.error.message || 'An error occurred while saving')
      return
    }

    setModalOpen(false)
  }

  const handleConfirmDelete = async () => {
    setSaving(true)
    await deletePost(selectedPost.id)
    setSaving(false)
    setDeleteModalOpen(false)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
            <p className="text-gray-500 mt-1">Manage your blog content</p>
          </div>
          <Button onClick={handleAdd} icon={Plus}>
            New Post
          </Button>
        </div>

        {/* Table */}
        <DataTable
          columns={columns}
          data={paginatedPosts}
          loading={loading}
          emptyMessage="No blog posts found"
          actions={(row) => (
            <>
              <button
                onClick={() => handleTogglePublish(row)}
                className={`p-2 rounded-lg transition-colors ${
                  row.published
                    ? 'text-green-600 hover:bg-green-50'
                    : 'text-gray-400 hover:bg-gray-50'
                }`}
                title={row.published ? 'Unpublish' : 'Publish'}
              >
                {row.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button
                onClick={() => handleEdit(row)}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(row)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        />

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={goToPage}
          />
        )}

        {/* Add/Edit Modal */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={selectedPost ? 'Edit Post' : 'New Post'}
          size="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <Input
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="Enter post title"
            />

            <Input
              label="Slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="Auto-generated from title"
              helperText="URL-friendly identifier (leave empty to auto-generate)"
            />

            <Textarea
              label="Excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="Brief summary of the post"
              rows={2}
            />

            <Textarea
              label="Content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Write your blog post content here..."
              rows={10}
            />

            <ImageUpload
              label="Cover Image"
              value={coverImage || (selectedPost?.cover_image ? getImageUrl(selectedPost.cover_image) : null)}
              onChange={setCoverImage}
              onRemove={() => setCoverImage(null)}
              crop
              aspectRatio={16/9}
            />

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Published</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">Featured</span>
              </label>
            </div>

            <ModalFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" loading={saving}>
                {selectedPost ? 'Update' : 'Create'}
              </Button>
            </ModalFooter>
          </form>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Delete Post"
          size="sm"
        >
          <p className="text-gray-600">
            Are you sure you want to delete "{selectedPost?.title}"? This action cannot be undone.
          </p>
          <ModalFooter>
            <Button
              variant="ghost"
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
              loading={saving}
            >
              Delete
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </AdminLayout>
  )
}
