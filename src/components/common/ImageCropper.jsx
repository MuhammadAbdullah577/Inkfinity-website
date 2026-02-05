import { useState, useRef, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { motion, AnimatePresence } from 'motion/react'
import { X, Check, RotateCcw } from 'lucide-react'

export default function ImageCropper({
  image,
  aspect = 1,
  onCropComplete,
  onCancel,
  isOpen,
}) {
  const [crop, setCrop] = useState()
  const [completedCrop, setCompletedCrop] = useState(null)
  const imgRef = useRef(null)

  // Prevent escape key from closing parent modal
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        e.preventDefault()
        onCancel()
      }
    }

    // Use capture phase to intercept before parent modal
    document.addEventListener('keydown', handleKeyDown, true)
    return () => document.removeEventListener('keydown', handleKeyDown, true)
  }, [isOpen, onCancel])

  const onImageLoad = useCallback((e) => {
    const { width, height } = e.currentTarget

    // Calculate initial crop based on aspect ratio
    const cropWidth = Math.min(width, height * aspect)
    const cropHeight = cropWidth / aspect

    const x = (width - cropWidth) / 2
    const y = (height - cropHeight) / 2

    const initialCrop = {
      unit: 'px',
      x,
      y,
      width: cropWidth,
      height: cropHeight,
    }

    setCrop(initialCrop)
    setCompletedCrop(initialCrop)
  }, [aspect])

  const handleCropComplete = async () => {
    if (!completedCrop || !imgRef.current) return

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const scaleX = imgRef.current.naturalWidth / imgRef.current.width
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height

    const pixelCrop = {
      x: completedCrop.x * scaleX,
      y: completedCrop.y * scaleY,
      width: completedCrop.width * scaleX,
      height: completedCrop.height * scaleY,
    }

    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height

    ctx.drawImage(
      imgRef.current,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    )

    // Convert canvas to blob
    canvas.toBlob(
      (blob) => {
        if (blob) {
          // Create a new File from the blob
          const croppedFile = new File(
            [blob],
            `cropped-${Date.now()}.jpg`,
            { type: 'image/jpeg' }
          )
          onCropComplete(croppedFile)
        }
      },
      'image/jpeg',
      0.95
    )
  }

  const handleReset = (e) => {
    e.stopPropagation()
    if (imgRef.current) {
      const { width, height } = imgRef.current
      const cropWidth = Math.min(width, height * aspect)
      const cropHeight = cropWidth / aspect
      const x = (width - cropWidth) / 2
      const y = (height - cropHeight) / 2

      const initialCrop = {
        unit: 'px',
        x,
        y,
        width: cropWidth,
        height: cropHeight,
      }
      setCrop(initialCrop)
      setCompletedCrop(initialCrop)
    }
  }

  const handleBackdropClick = (e) => {
    e.stopPropagation()
    e.preventDefault()
    onCancel()
  }

  const handleModalClick = (e) => {
    e.stopPropagation()
    e.preventDefault()
  }

  const handleCancel = (e) => {
    e.stopPropagation()
    e.preventDefault()
    onCancel()
  }

  const handleApply = (e) => {
    e.stopPropagation()
    e.preventDefault()
    handleCropComplete()
  }

  // Use portal to render outside of parent modal DOM hierarchy
  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70"
          onClick={handleBackdropClick}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={handleModalClick}
            onMouseDown={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Crop Image
              </h3>
              <button
                type="button"
                onClick={handleCancel}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cropper */}
            <div
              className="p-6 flex justify-center bg-gray-100 max-h-[60vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={aspect}
                className="max-w-full"
              >
                <img
                  ref={imgRef}
                  src={image}
                  alt="Crop preview"
                  onLoad={onImageLoad}
                  className="max-w-full max-h-[50vh] object-contain"
                />
              </ReactCrop>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApply}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  <Check className="w-4 h-4" />
                  Apply Crop
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  // Render via portal to document.body
  return createPortal(modalContent, document.body)
}
