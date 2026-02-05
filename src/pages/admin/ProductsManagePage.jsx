import { useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import DataTable from '../../components/admin/DataTable'
import Modal, { ModalFooter } from '../../components/common/Modal'
import Input, { Textarea, Select } from '../../components/common/Input'
import Button from '../../components/common/Button'
import ImageUpload from '../../components/common/ImageUpload'
import { useProducts } from '../../hooks/useProducts'
import { useCategories } from '../../hooks/useCategories'
import { getImageUrl } from '../../lib/supabase'
import { Plus, Pencil, Trash2, Image as ImageIcon, X } from 'lucide-react'

export default function ProductsManagePage() {
  const { products, loading, createProduct, updateProduct, deleteProduct } = useProducts()
  const { categories } = useCategories()

  const [modalOpen, setModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [formData, setFormData] = useState({ name: '', description: '', category_id: '' })
  const [imageFiles, setImageFiles] = useState([])
  const [existingImages, setExistingImages] = useState([])
  const [imagesToRemove, setImagesToRemove] = useState([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const categoryOptions = categories.map(c => ({ value: c.id, label: c.name }))

  const columns = [
    {
      key: 'images',
      label: 'Image',
      width: '80px',
      render: (value) => (
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
          {value?.[0] ? (
            <img
              src={getImageUrl(value[0])}
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
      key: 'category',
      label: 'Category',
      render: (value) => (
        <span className="text-sm text-gray-500">
          {value?.name || '-'}
        </span>
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
    setSelectedProduct(null)
    setFormData({ name: '', description: '', category_id: '' })
    setImageFiles([])
    setExistingImages([])
    setImagesToRemove([])
    setError(null)
    setModalOpen(true)
  }

  const handleEdit = (product) => {
    setSelectedProduct(product)
    setFormData({
      name: product.name,
      description: product.description || '',
      category_id: product.category_id || '',
    })
    setImageFiles([])
    setExistingImages(product.images || [])
    setImagesToRemove([])
    setError(null)
    setModalOpen(true)
  }

  const handleDelete = (product) => {
    setSelectedProduct(product)
    setDeleteModalOpen(true)
  }

  const handleRemoveExistingImage = (imagePath) => {
    setExistingImages(prev => prev.filter(img => img !== imagePath))
    setImagesToRemove(prev => [...prev, imagePath])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    let result
    if (selectedProduct) {
      result = await updateProduct(selectedProduct.id, formData, imageFiles, imagesToRemove)
    } else {
      result = await createProduct(formData, imageFiles)
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
    await deleteProduct(selectedProduct.id)
    setSaving(false)
    setDeleteModalOpen(false)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-500 mt-1">Manage your product catalog</p>
          </div>
          <Button onClick={handleAdd} icon={Plus}>
            Add Product
          </Button>
        </div>

        {/* Table */}
        <DataTable
          columns={columns}
          data={products}
          loading={loading}
          emptyMessage="No products found"
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
          title={selectedProduct ? 'Edit Product' : 'Add Product'}
          size="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <Input
              label="Product Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="e.g., Classic Cotton T-Shirt"
            />

            <Select
              label="Category"
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              options={categoryOptions}
              placeholder="Select a category"
            />

            <Textarea
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your product features, materials, etc."
              rows={4}
            />

            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Images
                </label>
                <div className="flex flex-wrap gap-3">
                  {existingImages.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={getImageUrl(img)}
                        alt=""
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingImage(img)}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <ImageUpload
              label="Add New Images"
              value={imageFiles}
              onChange={(files) => setImageFiles(Array.isArray(files) ? files : [files])}
              onRemove={(index) => setImageFiles(prev => prev.filter((_, i) => i !== index))}
              multiple
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
                {selectedProduct ? 'Update' : 'Create'}
              </Button>
            </ModalFooter>
          </form>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Delete Product"
          size="sm"
        >
          <p className="text-gray-600">
            Are you sure you want to delete "{selectedProduct?.name}"? This action cannot be undone.
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
