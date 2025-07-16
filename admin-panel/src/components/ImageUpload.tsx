'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { PhotoIcon, XMarkIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline'
import { uploadFile, validateImageFile, resizeImage, type StorageBucket } from '@/lib/supabase-storage'

interface ImageUploadProps {
  bucket: StorageBucket
  folder?: string
  currentImageUrl?: string
  onUploadSuccess: (url: string, path: string) => void
  onUploadError?: (error: string) => void
  onRemove?: () => void
  maxWidth?: number
  maxHeight?: number
  className?: string
  label?: string
  required?: boolean
}

export default function ImageUpload({
  bucket,
  folder,
  currentImageUrl,
  onUploadSuccess,
  onUploadError,
  onRemove,
  maxWidth = 1920,
  maxHeight = 1080,
  className = '',
  label = 'Upload Image',
  required = false
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [imageLoading, setImageLoading] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Convert relative paths to absolute URLs pointing to the main site
  const getImageUrl = (imageSrc: string | undefined) => {
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

  // Update preview URL when currentImageUrl changes
  useEffect(() => {
    const convertedUrl = getImageUrl(currentImageUrl)
    console.log('ImageUpload - original URL:', currentImageUrl)
    console.log('ImageUpload - converted URL:', convertedUrl)
    setPreviewUrl(convertedUrl)
    setImageLoading(true) // Reset loading state when URL changes
  }, [currentImageUrl])

  const handleFileSelect = useCallback(async (file: File) => {
    // Validate file
    const validation = validateImageFile(file)
    if (!validation.valid) {
      onUploadError?.(validation.error || 'Invalid file')
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Create preview
      const previewUrl = URL.createObjectURL(file)
      setPreviewUrl(previewUrl)

      // Resize image if needed
      const resizedFile = await resizeImage(file, maxWidth, maxHeight, 0.8)
      setUploadProgress(50)

      // Upload file
      const result = await uploadFile(resizedFile, {
        bucket,
        folder,
        filename: undefined // Let the system generate a unique filename
      })

      setUploadProgress(100)

      if (result.error) {
        onUploadError?.(result.error)
        setPreviewUrl(currentImageUrl || null)
      } else {
        onUploadSuccess(result.url, result.path)
        // Clean up preview URL
        URL.revokeObjectURL(previewUrl)
      }
    } catch (error) {
      onUploadError?.(error instanceof Error ? error.message : 'Upload failed')
      setPreviewUrl(currentImageUrl || null)
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }, [bucket, folder, maxWidth, maxHeight, onUploadSuccess, onUploadError, currentImageUrl])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    const imageFile = files.find(file => file.type.startsWith('image/'))
    
    if (imageFile) {
      handleFileSelect(imageFile)
    } else {
      onUploadError?.('Please drop an image file')
    }
  }, [handleFileSelect, onUploadError])

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }, [handleFileSelect])

  const handleRemove = useCallback(() => {
    setPreviewUrl(null)
    onRemove?.()
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [onRemove])

  const handleClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">

        {previewUrl ? (
          // Image preview with controls
          <div className="relative group overflow-hidden rounded-lg">
            {imageLoading && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                <p className="text-sm text-gray-500">Loading image...</p>
              </div>
            )}
            <img
              src={previewUrl}
              alt="Preview"
              className={`w-full h-48 object-cover border border-gray-300 ${imageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
              crossOrigin="anonymous"
              onError={(e) => {
                console.error('Image failed to load:', previewUrl)
                console.error('Error event:', e)
                setImageLoading(false)
              }}
              onLoad={() => {
                console.log('Image loaded successfully:', previewUrl)
                setImageLoading(false)
              }}
            />
            
            {/* Controls - positioned absolutely but not covering entire image */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 flex space-x-2">
                <button
                  type="button"
                  onClick={handleClick}
                  className="flex items-center px-3 py-2 bg-black bg-opacity-70 text-white rounded-md hover:bg-opacity-80 transition-colors"
                  disabled={isUploading}
                >
                  <ArrowUpTrayIcon className="h-4 w-4 mr-2" />
                  Replace
                </button>
                
                <button
                  type="button"
                  onClick={handleRemove}
                  className="flex items-center px-3 py-2 bg-red-600 bg-opacity-70 text-white rounded-md hover:bg-opacity-80 transition-colors"
                  disabled={isUploading}
                >
                  <XMarkIcon className="h-4 w-4 mr-2" />
                  Remove
                </button>
            </div>
            
            {/* Loading overlay */}
            {isUploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                  <p className="text-sm">Uploading... {uploadProgress}%</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Upload dropzone
          <div
            className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              isDragOver
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
          >
            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            
            <div className="text-sm text-gray-600">
              <p className="font-medium">Click to upload or drag and drop</p>
              <p className="text-xs mt-1">PNG, JPG, WebP, GIF up to 5MB</p>
            </div>
            
            {/* Loading state */}
            {isUploading && (
              <div className="absolute inset-0 bg-white bg-opacity-90 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">Uploading... {uploadProgress}%</p>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>
      
      {/* Helper text */}
      <p className="mt-2 text-xs text-gray-500">
        Recommended: JPG or PNG, max 5MB. Images will be optimized automatically.
      </p>
    </div>
  )
}