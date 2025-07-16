import { supabase } from './supabase'

export type StorageBucket = 'images' | 'artists' | 'releases' | 'playlists' | 'videos' | 'distributors'

export interface UploadResult {
  url: string
  path: string
  error?: string
}

export interface UploadOptions {
  bucket: StorageBucket
  folder?: string
  filename?: string
  maxSizeBytes?: number
  allowedTypes?: string[]
}

// Default configuration
const DEFAULT_MAX_SIZE = 5 * 1024 * 1024 // 5MB
const DEFAULT_ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

/**
 * Upload a file to Supabase storage
 */
export async function uploadFile(
  file: File,
  options: UploadOptions
): Promise<UploadResult> {
  try {
    // Validate file size
    const maxSize = options.maxSizeBytes || DEFAULT_MAX_SIZE
    if (file.size > maxSize) {
      return {
        url: '',
        path: '',
        error: `File size exceeds ${Math.round(maxSize / (1024 * 1024))}MB limit`
      }
    }

    // Validate file type
    const allowedTypes = options.allowedTypes || DEFAULT_ALLOWED_TYPES
    if (!allowedTypes.includes(file.type)) {
      return {
        url: '',
        path: '',
        error: `File type ${file.type} not allowed. Allowed types: ${allowedTypes.join(', ')}`
      }
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileExtension = file.name.split('.').pop()
    const filename = options.filename || `${timestamp}-${randomString}.${fileExtension}`
    
    // Build storage path
    const folder = options.folder || ''
    const path = folder ? `${folder}/${filename}` : filename

    // Upload file
    const { data, error } = await supabase.storage
      .from(options.bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      return {
        url: '',
        path: '',
        error: error.message
      }
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(options.bucket)
      .getPublicUrl(path)

    return {
      url: publicUrl,
      path: data.path,
      error: undefined
    }
  } catch (error) {
    return {
      url: '',
      path: '',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

/**
 * Delete a file from Supabase storage
 */
export async function deleteFile(
  bucket: StorageBucket,
  path: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

/**
 * Get public URL for a file
 */
export function getPublicUrl(bucket: StorageBucket, path: string): string {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)
  
  return data.publicUrl
}

/**
 * Generate optimized filename for storage
 */
export function generateFilename(originalName: string, prefix?: string): string {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  const fileExtension = originalName.split('.').pop()
  const cleanName = originalName
    .replace(/\.[^/.]+$/, '') // Remove extension
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-') // Replace special chars with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
    .substring(0, 50) // Limit length

  const filename = prefix 
    ? `${prefix}-${cleanName}-${timestamp}-${randomString}.${fileExtension}`
    : `${cleanName}-${timestamp}-${randomString}.${fileExtension}`

  return filename
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check if file is an image
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'File must be an image' }
  }

  // Check file size (5MB limit)
  if (file.size > DEFAULT_MAX_SIZE) {
    return { valid: false, error: `File size must be less than ${Math.round(DEFAULT_MAX_SIZE / (1024 * 1024))}MB` }
  }

  // Check file type
  if (!DEFAULT_ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: `File type ${file.type} not supported. Supported types: JPG, PNG, WebP, GIF` }
  }

  return { valid: true }
}

/**
 * Resize image before upload (client-side)
 */
export function resizeImage(
  file: File,
  maxWidth: number = 1920,
  maxHeight: number = 1080,
  quality: number = 0.8
): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height
          height = maxHeight
        }
      }

      // Set canvas dimensions
      canvas.width = width
      canvas.height = height

      // Draw and compress image
      ctx?.drawImage(img, 0, 0, width, height)
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            })
            resolve(resizedFile)
          } else {
            reject(new Error('Failed to resize image'))
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