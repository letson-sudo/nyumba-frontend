// import { useRouter } from 'next/navigation'
// import {
//   Edit3,
//   Edit2,
//   Settings
// } from 'lucide-react'

// export default function EditButton({
//   property,
//   onEdit,
//   size = 'default',
//   variant = 'default',
//   fullWidth = false,
//   customPath = null
// }) {
//   const router = useRouter()

//   const handleEdit = () => {
//     if (onEdit) {
//       // Use custom onEdit handler if provided
//       onEdit(property.id)
//     } else if (customPath) {
//       // Use custom path if provided
//       router.push(customPath.replace(':id', property.id))
//     } else {
//       // Default navigation path
//       console.log('Navigating to:', `/editProperty/${property.id}`)
//       router.push(`/editProperty/${property.id}`)
//     }
//   }

//   // Size configurations
//   const sizeClasses = {
//     small: {
//       button: 'px-2 py-1.5 text-xs',
//       icon: 12,
//       gap: 'gap-1'
//     },
//     default: {
//       button: 'px-3 py-2 text-sm',
//       icon: 14,
//       gap: 'gap-1.5'
//     },
//     large: {
//       button: 'px-4 py-3 text-base',
//       icon: 16,
//       gap: 'gap-2'
//     }
//   }

//   // Variant configurations
//   const variantClasses = {
//     default: {
//       colors: 'text-blue-600 bg-blue-50 hover:bg-blue-100 border-blue-200',
//       icon: Edit3,
//       text: 'Edit'
//     },
//     outline: {
//       colors: 'text-blue-600 bg-white hover:bg-blue-50 border-blue-300 border-2',
//       icon: Edit3,
//       text: 'Edit Property'
//     },
//     ghost: {
//       colors: 'text-gray-600 bg-transparent hover:bg-gray-100 border-transparent',
//       icon: Edit2,
//       text: 'Edit'
//     },
//     settings: {
//       colors: 'text-gray-600 bg-gray-50 hover:bg-gray-100 border-gray-200',
//       icon: Settings,
//       text: 'Settings'
//     }
//   }

//   const currentSize = sizeClasses[size] || sizeClasses.default
//   const currentVariant = variantClasses[variant] || variantClasses.default
//   const Icon = currentVariant.icon
//   const widthClass = fullWidth ? 'flex-1' : ''

//   return (
//     <button
//       onClick={handleEdit}
//       className={`
//         ${widthClass}
//         flex items-center justify-center ${currentSize.gap} ${currentSize.button}
//         ${currentVariant.colors}
//         border rounded-lg font-medium
//         transition-all duration-200 hover:scale-105 active:scale-95
//         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
//       `}
//       title={`Edit ${property.title || 'property'}`}
//     >
//       <Icon size={currentSize.icon} />
//       {size === 'small' && variant === 'default' ? null : currentVariant.text}
//     </button>
//   )
// }


import { useRouter } from 'next/navigation'
import {
  Edit3,
  Edit2,
  Settings
} from 'lucide-react'

export default function EditButton({
  property,
  onEdit,
  size = 'default',
  variant = 'default',
  fullWidth = false,
  customPath = null
}) {
  const router = useRouter()

  const handleEdit = () => {
    if (onEdit) {
      // Use custom onEdit handler if provided
      onEdit(property.id)
    } else if (customPath) {
      // Use custom path if provided
      router.push(customPath.replace(':id', property.id))
    } else {
      // Default navigation path
      console.log('Navigating to:', `/editProperty/${property.id}`)
      router.push(`/editProperty/${property.id}`)
    }
  }

  // Responsive size configurations
  const sizeClasses = {
    small: {
      button: 'px-2 py-1.5 text-xs',
      buttonMobile: 'px-2 py-1.5 text-xs',
      icon: 12,
      iconMobile: 10,
      gap: 'gap-1',
      gapMobile: 'gap-1'
    },
    default: {
      button: 'px-3 py-2 text-sm',
      buttonMobile: 'px-2.5 py-1.5 text-xs',
      icon: 14,
      iconMobile: 12,
      gap: 'gap-1.5',
      gapMobile: 'gap-1'
    },
    large: {
      button: 'px-4 py-3 text-base',
      buttonMobile: 'px-3 py-2 text-sm',
      icon: 16,
      iconMobile: 14,
      gap: 'gap-2',
      gapMobile: 'gap-1.5'
    }
  }

  // Variant configurations with responsive text
  const variantClasses = {
    default: {
      colors: 'text-blue-600 bg-blue-50 hover:bg-blue-100 border-blue-200 hover:border-blue-300',
      icon: Edit3,
      text: 'Edit',
      textMobile: 'Edit'
    },
    outline: {
      colors: 'text-blue-600 bg-white hover:bg-blue-50 border-blue-300 border-2 hover:border-blue-400',
      icon: Edit3,
      text: 'Edit Property',
      textMobile: 'Edit'
    },
    ghost: {
      colors: 'text-gray-600 bg-transparent hover:bg-gray-100 border-transparent hover:border-gray-200',
      icon: Edit2,
      text: 'Edit',
      textMobile: 'Edit'
    },
    settings: {
      colors: 'text-gray-600 bg-gray-50 hover:bg-gray-100 border-gray-200 hover:border-gray-300',
      icon: Settings,
      text: 'Settings',
      textMobile: 'Set'
    }
  }

  const currentSize = sizeClasses[size] || sizeClasses.default
  const currentVariant = variantClasses[variant] || variantClasses.default
  const Icon = currentVariant.icon
  const widthClass = fullWidth ? 'w-full' : ''

  // Determine if we should show text based on size and screen
  const shouldShowTextOnMobile = size !== 'small' || variant === 'outline'
  const shouldShowFullTextOnDesktop = size === 'large' || variant === 'outline'

  return (
    <button
      onClick={handleEdit}
      className={`
        ${widthClass}
        flex items-center justify-center
        ${currentSize.gapMobile} ${currentSize.buttonMobile}
        sm:${currentSize.gap} sm:${currentSize.button}
        ${currentVariant.colors}
        border rounded-lg font-medium
        transition-all duration-200 hover:scale-105 active:scale-95
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
      title={`Edit ${property.title || 'property'}`}
    >
      {/* Icon - responsive sizing */}
      <Icon
        size={currentSize.iconMobile}
        className="sm:hidden flex-shrink-0"
      />
      <Icon
        size={currentSize.icon}
        className="hidden sm:block flex-shrink-0"
      />

      {/* Text - responsive display and content */}
      {shouldShowTextOnMobile && (
        <span className="sm:hidden truncate">
          {currentVariant.textMobile}
        </span>
      )}

      {shouldShowFullTextOnDesktop && (
        <span className="hidden sm:inline truncate">
          {currentVariant.text}
        </span>
      )}

      {/* For default size, show text only on larger screens unless it's small variant */}
      {size === 'default' && variant === 'default' && (
        <span className="hidden sm:inline truncate">
          {currentVariant.text}
        </span>
      )}
    </button>
  )
}
