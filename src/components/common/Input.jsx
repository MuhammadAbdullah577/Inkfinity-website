import { forwardRef } from 'react'
import { AlertCircle } from 'lucide-react'

const Input = forwardRef(({
  label,
  error,
  helperText,
  className = '',
  type = 'text',
  required = false,
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={`
          w-full px-4 py-2.5
          bg-white border rounded-lg
          text-gray-900 placeholder-gray-400
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
          disabled:bg-gray-50 disabled:cursor-not-allowed
          ${error
            ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
            : 'border-gray-300 hover:border-gray-400'
          }
          ${className}
        `}
        {...props}
      />
      {(error || helperText) && (
        <div className={`mt-1.5 text-sm flex items-center gap-1 ${error ? 'text-red-500' : 'text-gray-500'}`}>
          {error && <AlertCircle className="w-4 h-4" />}
          {error || helperText}
        </div>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input

export const Textarea = forwardRef(({
  label,
  error,
  helperText,
  className = '',
  rows = 4,
  required = false,
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={`
          w-full px-4 py-2.5
          bg-white border rounded-lg
          text-gray-900 placeholder-gray-400
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
          disabled:bg-gray-50 disabled:cursor-not-allowed
          resize-none
          ${error
            ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
            : 'border-gray-300 hover:border-gray-400'
          }
          ${className}
        `}
        {...props}
      />
      {(error || helperText) && (
        <div className={`mt-1.5 text-sm flex items-center gap-1 ${error ? 'text-red-500' : 'text-gray-500'}`}>
          {error && <AlertCircle className="w-4 h-4" />}
          {error || helperText}
        </div>
      )}
    </div>
  )
})

Textarea.displayName = 'Textarea'

export const Select = forwardRef(({
  label,
  error,
  helperText,
  className = '',
  options = [],
  placeholder = 'Select an option',
  required = false,
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        ref={ref}
        className={`
          w-full px-4 py-2.5
          bg-white border rounded-lg
          text-gray-900
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
          disabled:bg-gray-50 disabled:cursor-not-allowed
          ${error
            ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
            : 'border-gray-300 hover:border-gray-400'
          }
          ${className}
        `}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {(error || helperText) && (
        <div className={`mt-1.5 text-sm flex items-center gap-1 ${error ? 'text-red-500' : 'text-gray-500'}`}>
          {error && <AlertCircle className="w-4 h-4" />}
          {error || helperText}
        </div>
      )}
    </div>
  )
})

Select.displayName = 'Select'
