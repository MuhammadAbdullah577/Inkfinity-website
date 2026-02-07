import { useState, useEffect } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import DataTable, { Pagination } from '../../components/admin/DataTable'
import Modal, { ModalFooter } from '../../components/common/Modal'
import Button from '../../components/common/Button'
import { useInquiries } from '../../hooks/useInquiries'
import { Eye, Trash2, Mail, MailOpen, Clock } from 'lucide-react'

export default function InquiriesPage() {
  const { inquiries, loading, pagination, fetchInquiries, markAsRead, markAsUnread, deleteInquiry } = useInquiries()

  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedInquiry, setSelectedInquiry] = useState(null)
  const [saving, setSaving] = useState(false)
  const [filter, setFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)

  // Fetch with pagination and filter
  useEffect(() => {
    fetchInquiries({
      page: currentPage,
      pageSize: 20,
      status: filter === 'all' ? undefined : filter,
    })
  }, [currentPage, filter, fetchInquiries])

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [filter])

  const columns = [
    {
      key: 'read',
      label: '',
      width: '40px',
      render: (value) => (
        value ? (
          <MailOpen className="w-4 h-4 text-gray-400" />
        ) : (
          <Mail className="w-4 h-4 text-blue-600" />
        )
      ),
    },
    {
      key: 'name',
      label: 'Name',
      render: (value, row) => (
        <div>
          <span className={`font-medium ${row.read ? 'text-gray-600' : 'text-gray-900'}`}>
            {value}
          </span>
          {row.company && (
            <p className="text-xs text-gray-400">{row.company}</p>
          )}
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      render: (value) => (
        <a href={`mailto:${value}`} className="text-sm text-blue-600 hover:text-blue-700">
          {value}
        </a>
      ),
    },
    {
      key: 'product_interest',
      label: 'Interest',
      render: (value) => (
        value ? (
          <span className="text-sm text-gray-500 capitalize">{value}</span>
        ) : (
          <span className="text-sm text-gray-400">-</span>
        )
      ),
    },
    {
      key: 'message',
      label: 'Message',
      render: (value) => (
        <span className="text-sm text-gray-500 line-clamp-1">{value}</span>
      ),
    },
    {
      key: 'created_at',
      label: 'Date',
      render: (value) => (
        <div className="flex items-center gap-1 text-sm text-gray-400">
          <Clock className="w-3 h-3" />
          {new Date(value).toLocaleDateString()}
        </div>
      ),
    },
  ]

  const handleView = async (inquiry) => {
    setSelectedInquiry(inquiry)
    setViewModalOpen(true)
    if (!inquiry.read) {
      await markAsRead(inquiry.id)
    }
  }

  const handleToggleRead = async (inquiry) => {
    if (inquiry.read) {
      await markAsUnread(inquiry.id)
    } else {
      await markAsRead(inquiry.id)
    }
  }

  const handleDelete = (inquiry) => {
    setSelectedInquiry(inquiry)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    setSaving(true)
    await deleteInquiry(selectedInquiry.id)
    setSaving(false)
    setDeleteModalOpen(false)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Inquiries</h1>
            <p className="text-gray-500 mt-1">View and manage contact inquiries</p>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="all">All Inquiries</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <DataTable
          columns={columns}
          data={inquiries}
          loading={loading}
          emptyMessage="No inquiries found"
          actions={(row) => (
            <>
              <button
                onClick={() => handleView(row)}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="View"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleToggleRead(row)}
                className={`p-2 rounded-lg transition-colors ${
                  row.read
                    ? 'text-gray-400 hover:text-orange-600 hover:bg-orange-50'
                    : 'text-blue-600 hover:bg-blue-50'
                }`}
                title={row.read ? 'Mark as unread' : 'Mark as read'}
              >
                {row.read ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4" />}
              </button>
              <button
                onClick={() => handleDelete(row)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        />

        {pagination.totalPages > 1 && (
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            totalItems={pagination.total}
            itemsPerPage={pagination.pageSize}
            onPageChange={setCurrentPage}
          />
        )}

        {/* View Modal */}
        <Modal
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          title="Inquiry Details"
          size="md"
        >
          {selectedInquiry && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p className="text-gray-900">{selectedInquiry.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <a href={`mailto:${selectedInquiry.email}`} className="text-blue-600 hover:text-blue-700 block">
                    {selectedInquiry.email}
                  </a>
                </div>
                {selectedInquiry.phone && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <a href={`tel:${selectedInquiry.phone}`} className="text-blue-600 hover:text-blue-700 block">
                      {selectedInquiry.phone}
                    </a>
                  </div>
                )}
                {selectedInquiry.company && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Company</label>
                    <p className="text-gray-900">{selectedInquiry.company}</p>
                  </div>
                )}
                {selectedInquiry.product_interest && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Product Interest</label>
                    <p className="text-gray-900 capitalize">{selectedInquiry.product_interest}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-500">Date</label>
                  <p className="text-gray-900">
                    {new Date(selectedInquiry.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Message</label>
                <p className="text-gray-900 mt-1 whitespace-pre-wrap">
                  {selectedInquiry.message}
                </p>
              </div>

              <ModalFooter>
                <Button
                  variant="outline"
                  onClick={() => setViewModalOpen(false)}
                >
                  Close
                </Button>
                <Button
                  as="a"
                  href={`mailto:${selectedInquiry.email}?subject=Re: Your Inquiry to Inkfinity Creation`}
                >
                  Reply via Email
                </Button>
              </ModalFooter>
            </div>
          )}
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Delete Inquiry"
          size="sm"
        >
          <p className="text-gray-600">
            Are you sure you want to delete this inquiry from {selectedInquiry?.name}? This action cannot be undone.
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
