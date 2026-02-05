import { useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import DataTable from '../../components/admin/DataTable'
import Modal, { ModalFooter } from '../../components/common/Modal'
import Input, { Textarea } from '../../components/common/Input'
import Button from '../../components/common/Button'
import ImageUpload from '../../components/common/ImageUpload'
import { useCategories } from '../../hooks/useCategories'
import { getImageUrl } from '../../lib/supabase'
import { Plus, Pencil, Trash2, Image as ImageIcon } from 'lucide-react'

export default function CategoriesManagePage() {
  const { categories, loading, createCategory, updateCategory, deleteCategory } = useCategories()

  const [modalOpen, setModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [formData, setFormData] = useState({ name: '', slug: '', description: '' })
  const [imageFile, setImageFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const columns = [
    {
      key: 'image',
      label: 'Image',
      width: '80px',
      render: (value) => (
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
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
      key: 'name',
      label: 'Name',
      render: (value) => (
        <span className="font-medium text-gray-900">{value}</span>
      ),
    },
    {
      key: 'slug',
      label: 'Slug',
      render: (value) => (
        <code className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {value}
        </code>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      render: (value) => (
        <span className="text-sm text-gray-500 line-clamp-1">
          {value || '-'}
        </span>
      ),
    },
  ]

  const handleAdd = () => {
    setSelectedCategory(null)
    setFormData({ name: '', slug: '', description: '' })
    setImageFile(null)
    setError(null)
    setModalOpen(true)
  }

  const handleEdit = (category) => {
    setSelectedCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
    })
    setImageFile(null)
    setError(null)
    setModalOpen(true)
  }

  const handleDelete = (category) => {
    setSelectedCategory(category)
    setDeleteModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    // Auto-generate slug if empty
    const slug = formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-')

    let result
    if (selectedCategory) {
      result = await updateCategory(selectedCategory.id, { ...formData, slug }, imageFile)
    } else {
      result = await createCategory({ ...formData, slug }, imageFile)
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
    await deleteCategory(selectedCategory.id)
    setSaving(false)
    setDeleteModalOpen(false)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
            <p className="text-gray-500 mt-1">Manage product categories</p>
          </div>
          <Button onClick={handleAdd} icon={Plus}>
            Add Category
          </Button>
        </div>

        {/* Table */}
        <DataTable
          columns={columns}
          data={categories}
          loading={loading}
          emptyMessage="No categories found"
          actions={(row) => (
            <>
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

        {/* Add/Edit Modal */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={selectedCategory ? 'Edit Category' : 'Add Category'}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <Input
              label="Category Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="e.g., T-Shirts"
            />

            <Input
              label="Slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="Auto-generated from name"
              helperText="URL-friendly identifier (leave empty to auto-generate)"
            />

            <Textarea
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of this category"
            />

            <ImageUpload
              label="Category Image"
              value={imageFile || (selectedCategory?.image ? getImageUrl(selectedCategory.image) : null)}
              onChange={setImageFile}
              onRemove={() => setImageFile(null)}
              crop
              aspectRatio={1}
            />

            <ModalFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" loading={saving}>
                {selectedCategory ? 'Update' : 'Create'}
              </Button>
            </ModalFooter>
          </form>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Delete Category"
          size="sm"
        >
          <p className="text-gray-600">
            Are you sure you want to delete "{selectedCategory?.name}"? This action cannot be undone.
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
