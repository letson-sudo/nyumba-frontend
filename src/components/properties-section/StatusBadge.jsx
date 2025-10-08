
import {
  CheckCircle,
  Clock,
  Wrench,
  XCircle,
} from 'lucide-react'

export default function StatusBadge({ status, size = 'default', showIcon = true, showText = true }) {
  const statusConfig = {
    vacant: {
      icon: CheckCircle,
      color: 'bg-green-100 text-green-700 border-green-200',
      colorMobile: 'bg-green-100 text-green-700 border-green-200',
      label: 'Available',
      labelShort: 'Free'
    },
    booked: {
      icon: Clock,
      color: 'bg-blue-100 text-blue-700 border-blue-200',
      colorMobile: 'bg-blue-100 text-blue-700 border-blue-200',
      label: 'Occupied',
      labelShort: 'Busy'
    },
    maintenance: {
      icon: Wrench,
      color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      colorMobile: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      label: 'Maintenance',
      labelShort: 'Maint'
    },
    unavailable: {
      icon: XCircle,
      color: 'bg-red-100 text-red-700 border-red-200',
      colorMobile: 'bg-red-100 text-red-700 border-red-200',
      label: 'Unavailable',
      labelShort: 'N/A'
    }
  }

  // Size configurations for responsive design
  const sizeClasses = {
    small: {
      container: 'px-2 py-1 text-xs',
      containerMobile: 'px-1.5 py-0.5 text-xs',
      icon: 10,
      iconMobile: 8,
      gap: 'gap-1',
      gapMobile: 'gap-0.5'
    },
    default: {
      container: 'px-3 py-1.5 text-xs',
      containerMobile: 'px-2 py-1 text-xs',
      icon: 12,
      iconMobile: 10,
      gap: 'gap-1.5',
      gapMobile: 'gap-1'
    },
    large: {
      container: 'px-4 py-2 text-sm',
      containerMobile: 'px-3 py-1.5 text-xs',
      icon: 14,
      iconMobile: 12,
      gap: 'gap-2',
      gapMobile: 'gap-1.5'
    }
  }

  const config = statusConfig[status] || statusConfig.vacant
  const sizeConfig = sizeClasses[size] || sizeClasses.default
  const Icon = config.icon

  return (
    <div className={`
      inline-flex items-center
      ${sizeConfig.gapMobile} ${sizeConfig.containerMobile}
      sm:${sizeConfig.gap} sm:${sizeConfig.container}
      ${config.colorMobile} sm:${config.color}
      rounded-full font-medium border transition-colors duration-200
    `}>
      {/* Icon - responsive sizing and conditional display */}
      {showIcon && (
        <>
          <Icon
            size={sizeConfig.iconMobile}
            className="sm:hidden flex-shrink-0"
          />
          <Icon
            size={sizeConfig.icon}
            className="hidden sm:block flex-shrink-0"
          />
        </>
      )}

      {/* Text - responsive display and content */}
      {showText && (
        <>
          {/* Mobile: Show short label for default/large sizes, full label for small only if it's short */}
          <span className="sm:hidden truncate">
            {size === 'small' && config.label.length <= 4 ? config.label : config.labelShort}
          </span>

          {/* Desktop: Always show full label */}
          <span className="hidden sm:inline truncate">
            {config.label}
          </span>
        </>
      )}

      {/* Icon-only mode for very small screens when showText is false */}
      {!showText && showIcon && (
        <span className="sr-only">{config.label}</span>
      )}
    </div>
  )
}
