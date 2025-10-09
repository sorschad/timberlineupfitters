interface InventoryStatusBadgeProps {
  availability?: string | null
  className?: string
}

export default function InventoryStatusBadge({ availability, className = '' }: InventoryStatusBadgeProps) {
  // Don't render if availability is empty, null, or empty string
  if (!availability || availability.trim() === '') {
    return null
  }

  // Define color schemes for different availability statuses
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'In Stock':
        return {
          bg: 'bg-green-500/90',
          text: 'text-white',
          border: 'border-green-400/50',
          shadow: 'shadow-green-500/20'
        }
      case 'In Transit':
        return {
          bg: 'bg-blue-500/90',
          text: 'text-white',
          border: 'border-blue-400/50',
          shadow: 'shadow-blue-500/20'
        }
      case 'Available Soon':
        return {
          bg: 'bg-yellow-500/90',
          text: 'text-white',
          border: 'border-yellow-400/50',
          shadow: 'shadow-yellow-500/20'
        }
      case 'Out of Stock':
        return {
          bg: 'bg-red-500/90',
          text: 'text-white',
          border: 'border-red-400/50',
          shadow: 'shadow-red-500/20'
        }
      case 'Special Order':
        return {
          bg: 'bg-purple-500/90',
          text: 'text-white',
          border: 'border-purple-400/50',
          shadow: 'shadow-purple-500/20'
        }
      default:
        return {
          bg: 'bg-gray-500/90',
          text: 'text-white',
          border: 'border-gray-400/50',
          shadow: 'shadow-gray-500/20'
        }
    }
  }

  const styles = getStatusStyles(availability)

  return (
    <div 
      className={`absolute top-4 right-4 ${styles.bg} ${styles.text} ${styles.border} ${styles.shadow} px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border shadow-lg z-20 ${className}`}
    >
      {availability}
    </div>
  )
}
