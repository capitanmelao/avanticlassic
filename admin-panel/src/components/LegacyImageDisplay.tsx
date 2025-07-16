'use client'

import React from 'react'
import { PhotoIcon } from '@heroicons/react/24/outline'
import { isValidImageUrl, isLegacyImageUrl } from '@/lib/image-upload'

interface LegacyImageDisplayProps {
  src: string | null | undefined
  alt: string
  className?: string
  fallbackClassName?: string
  showLegacyPath?: boolean
}

export default function LegacyImageDisplay({ 
  src, 
  alt, 
  className = '', 
  fallbackClassName = 'bg-gray-100 flex items-center justify-center',
  showLegacyPath = false
}: LegacyImageDisplayProps) {
  // Handle null/undefined/empty cases
  if (!src) {
    return (
      <div className={`${fallbackClassName} ${className}`}>
        <PhotoIcon className="h-8 w-8 text-gray-400" />
      </div>
    )
  }

  // Handle valid image URLs
  if (isValidImageUrl(src)) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
      />
    )
  }

  // Handle legacy image URLs
  if (isLegacyImageUrl(src)) {
    return (
      <div className={`${fallbackClassName} ${className}`}>
        <div className="text-center">
          <PhotoIcon className="h-8 w-8 text-yellow-500 mx-auto mb-1" />
          <p className="text-xs text-yellow-700 font-medium">Legacy Image</p>
          {showLegacyPath && (
            <p className="text-xs text-gray-500 mt-1 truncate max-w-full">
              {src}
            </p>
          )}
        </div>
      </div>
    )
  }

  // Fallback for any other cases
  return (
    <div className={`${fallbackClassName} ${className}`}>
      <div className="text-center">
        <PhotoIcon className="h-8 w-8 text-red-500 mx-auto mb-1" />
        <p className="text-xs text-red-700 font-medium">Invalid Image</p>
        {showLegacyPath && (
          <p className="text-xs text-gray-500 mt-1 truncate max-w-full">
            {src}
          </p>
        )}
      </div>
    </div>
  )
}