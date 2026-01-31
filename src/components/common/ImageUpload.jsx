import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

export default function ImageUpload({
  value,
  onChange,
  onRemove,
  multiple = false,
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024, // 5MB
  className = '',
  label = 'Upload Image',
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState(null)
  const inputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const validateFile = (file) => {
    if (!file.type.startsWith('image/')) {
      return 'Please upload an image file'
    }
    if (file.size > maxSize) {
      return `File size must be less than ${maxSize / (1024 * 1024)}MB`
    }
    return null
  }

  const handleFiles = (files) => {
    setError(null)
    const fileArray = Array.from(files)

    for (const file of fileArray) {
      const validationError = validateFile(file)
      if (validationError) {
        setError(validationError)
        return
      }
    }

    if (multiple) {
      onChange(fileArray)
    } else {
      onChange(fileArray[0])
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleChange = (e) => {
    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }

  const images = multiple
    ? (Array.isArray(value) ? value : [])
    : (value ? [value] : [])

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      {/* Upload Area */}
      <motion.div
        className={`
          relative border-2 border-dashed rounded-xl p-6
          transition-colors cursor-pointer
          ${isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-3 text-center">
          <div className={`
            p-3 rounded-full
            ${isDragging ? 'bg-blue-100' : 'bg-gray-100'}
          `}>
            <Upload className={`w-6 h-6 ${isDragging ? 'text-blue-600' : 'text-gray-400'}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">
              {isDragging ? 'Drop image here' : 'Click or drag image to upload'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG, WEBP up to {maxSize / (1024 * 1024)}MB
            </p>
          </div>
        </div>
      </motion.div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-500 mt-2">{error}</p>
      )}

      {/* Preview */}
      <AnimatePresence>
        {images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4"
          >
            <div className={`grid gap-4 ${multiple ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-1'}`}>
              {images.map((image, index) => (
                <ImagePreview
                  key={index}
                  image={image}
                  onRemove={() => {
                    if (multiple) {
                      onRemove?.(index)
                    } else {
                      onRemove?.()
                    }
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ImagePreview({ image, onRemove }) {
  const [loaded, setLoaded] = useState(false)

  const src = image instanceof File
    ? URL.createObjectURL(image)
    : image

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="relative group rounded-lg overflow-hidden bg-gray-100 aspect-video"
    >
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <ImageIcon className="w-8 h-8 text-gray-300" />
        </div>
      )}
      <img
        src={src}
        alt="Preview"
        className={`w-full h-full object-cover transition-opacity ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
      />
      <button
        onClick={(e) => {
          e.stopPropagation()
          onRemove()
        }}
        className="
          absolute top-2 right-2 p-1.5
          bg-black/50 text-white rounded-full
          opacity-0 group-hover:opacity-100
          transition-opacity hover:bg-black/70
        "
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  )
}
