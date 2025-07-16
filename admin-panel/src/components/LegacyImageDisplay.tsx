'use client'

import React, { useState, useEffect } from 'react'
import { PhotoIcon } from '@heroicons/react/24/outline'

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
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  // Convert relative paths to absolute URLs pointing to the main site
  const getImageUrl = (imageSrc: string) => {
    if (!imageSrc) return null
    
    // If it's already an absolute URL, use it as-is
    if (imageSrc.startsWith('http://') || imageSrc.startsWith('https://')) {
      return imageSrc
    }
    
    // If it's a relative path starting with /, prepend the main site URL
    if (imageSrc.startsWith('/')) {
      return `https://avanticlassic.vercel.app${imageSrc}`
    }
    
    // For any other format, return as-is
    return imageSrc
  }

  const imageUrl = src ? getImageUrl(src) : null

  // Debug logging
  useEffect(() => {
    console.log('LegacyImageDisplay - original src:', src)
    console.log('LegacyImageDisplay - converted url:', imageUrl)
  }, [src, imageUrl])

  // Handle null/undefined/empty cases
  if (!imageUrl) {
    return (
      <div className={`${fallbackClassName} ${className}`}>
        <PhotoIcon className="h-8 w-8 text-gray-400" />
      </div>
    )
  }

  // If image failed to load, show fallback
  if (imageError) {
    return (
      <div className={`${fallbackClassName} ${className}`}>
        <div className="text-center">
          <PhotoIcon className="h-8 w-8 text-gray-400 mx-auto" />
          {showLegacyPath && (
            <p className="text-xs text-gray-500 mt-1 truncate max-w-full">
              {src}
            </p>
          )}
        </div>
      </div>
    )
  }

  // Try to display the image regardless of URL format
  return (
    <>
      <img
        src={imageUrl}
        alt={alt}
        className={`${className} ${imageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onError={(e) => {
          console.error('Image failed to load:', imageUrl, e)
          setImageError(true)
          setImageLoading(false)
        }}
        onLoad={() => {
          setImageLoading(false)
        }}
      />
      {imageLoading && (
        <div className={`${fallbackClassName} ${className} absolute inset-0`}>
          <div className="animate-pulse bg-gray-300 w-full h-full rounded-md"></div>
        </div>
      )}
    </>
  )
}