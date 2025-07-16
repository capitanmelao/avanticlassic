import { uploadFile, deleteFile, type StorageBucket } from './supabase-storage'

/**
 * Helper function to handle image uploads for different entities
 */
export async function handleImageUpload(
  file: File,
  bucket: StorageBucket,
  entityType: string,
  entityId: string | number,
  oldImagePath?: string
): Promise<{ url: string; path: string; error?: string }> {
  try {
    // Delete old image if exists
    if (oldImagePath) {
      await deleteFile(bucket, oldImagePath)
    }

    // Upload new image
    const result = await uploadFile(file, {
      bucket,
      folder: `${entityType}/${entityId}`,
      filename: `${entityType}-${entityId}-${Date.now()}.${file.name.split('.').pop()}`
    })

    return result
  } catch (error) {
    return {
      url: '',
      path: '',
      error: error instanceof Error ? error.message : 'Upload failed'
    }
  }
}

/**
 * Helper function to delete an image
 */
export async function handleImageDelete(
  bucket: StorageBucket,
  imagePath: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await deleteFile(bucket, imagePath)
    return result
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Delete failed'
    }
  }
}

/**
 * Extract storage path from Supabase URL
 */
export function extractStoragePath(url: string): string | null {
  try {
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split('/')
    const storageIndex = pathParts.findIndex(part => part === 'storage')
    
    if (storageIndex !== -1 && pathParts[storageIndex + 1] === 'v1' && pathParts[storageIndex + 2] === 'object' && pathParts[storageIndex + 3] === 'public') {
      // Skip: /storage/v1/object/public/{bucket}/
      return pathParts.slice(storageIndex + 5).join('/')
    }
    
    return null
  } catch {
    return null
  }
}

/**
 * Convert external URL to storage path if it's a Supabase storage URL
 */
export function isStorageUrl(url: string): boolean {
  return url.includes('supabase.co/storage/v1/object/public/')
}

/**
 * Get bucket name from entity type
 */
export function getBucketForEntityType(entityType: string): StorageBucket {
  const bucketMap: Record<string, StorageBucket> = {
    'artist': 'artists',
    'release': 'releases',
    'playlist': 'playlists',
    'video': 'videos',
    'distributor': 'distributors',
    'default': 'images'
  }
  
  return bucketMap[entityType] || 'images'
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Validate image dimensions
 */
export function validateImageDimensions(
  file: File,
  minWidth?: number,
  minHeight?: number,
  maxWidth?: number,
  maxHeight?: number
): Promise<{ valid: boolean; error?: string; width?: number; height?: number }> {
  return new Promise((resolve) => {
    const img = new Image()
    
    img.onload = () => {
      const { width, height } = img
      
      if (minWidth && width < minWidth) {
        resolve({ valid: false, error: `Image width must be at least ${minWidth}px` })
        return
      }
      
      if (minHeight && height < minHeight) {
        resolve({ valid: false, error: `Image height must be at least ${minHeight}px` })
        return
      }
      
      if (maxWidth && width > maxWidth) {
        resolve({ valid: false, error: `Image width must be no more than ${maxWidth}px` })
        return
      }
      
      if (maxHeight && height > maxHeight) {
        resolve({ valid: false, error: `Image height must be no more than ${maxHeight}px` })
        return
      }
      
      resolve({ valid: true, width, height })
    }
    
    img.onerror = () => {
      resolve({ valid: false, error: 'Invalid image file' })
    }
    
    img.src = URL.createObjectURL(file)
  })
}

/**
 * Generate thumbnail URL for an image
 */
export function generateThumbnailUrl(originalUrl: string): string {
  // For Supabase storage, you would typically use a service like Supabase Image Transformations
  // or a third-party service like Cloudinary. For now, we'll return the original URL.
  // In a production setup, you might want to implement server-side image resizing.
  return originalUrl
}

/**
 * Compress image file before upload
 */
export function compressImage(file: File, quality: number = 0.8): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      
      ctx?.drawImage(img, 0, 0)
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            })
            resolve(compressedFile)
          } else {
            reject(new Error('Failed to compress image'))
          }
        },
        file.type,
        quality
      )
    }

    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = URL.createObjectURL(file)
  })
}