'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ShoppingCart, Loader2, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProductFormat {
  id: number
  format: string
  price: number
  currency: string
  inventory_quantity: number
  available: boolean
}

interface ReleaseBuyButtonProps {
  releaseId: string
  className?: string
}

export default function ReleaseBuyButton({ releaseId, className }: ReleaseBuyButtonProps) {
  const [formats, setFormats] = useState<ProductFormat[]>([])
  const [selectedFormat, setSelectedFormat] = useState<ProductFormat | null>(null)
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadProductFormats()
  }, [releaseId])

  const loadProductFormats = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/products/by-release/${releaseId}`)
      
      if (!response.ok) {
        throw new Error('Failed to load product formats')
      }
      
      const data = await response.json()
      setFormats(data.formats || [])
      
      // Auto-select first available format
      if (data.formats?.length > 0) {
        setSelectedFormat(data.formats[0])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async () => {
    if (!selectedFormat) return
    
    try {
      setAdding(true)
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: selectedFormat.id,
          quantity: 1
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to add to cart')
      }
      
      // Show success feedback
      // You might want to show a toast notification here
      console.log('Added to cart successfully')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to cart')
    } finally {
      setAdding(false)
    }
  }

  if (loading) {
    return (
      <div className={cn('flex items-center justify-center p-4', className)}>
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className={cn('text-red-600 text-sm', className)}>
        {error}
      </div>
    )
  }

  if (formats.length === 0) {
    return (
      <div className={cn('text-gray-500 text-sm', className)}>
        No formats available for purchase
      </div>
    )
  }

  return (
    <Card className={cn('w-full max-w-md', className)}>
      <CardContent className="p-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Available Formats</h3>
          
          <div className="space-y-2">
            {formats.map((format) => (
              <div
                key={format.id}
                className={cn(
                  'flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors',
                  selectedFormat?.id === format.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-gray-200 hover:border-gray-300',
                  !format.available && 'opacity-50 cursor-not-allowed'
                )}
                onClick={() => format.available && setSelectedFormat(format)}
              >
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    'w-4 h-4 rounded-full border-2 flex items-center justify-center',
                    selectedFormat?.id === format.id 
                      ? 'border-primary bg-primary' 
                      : 'border-gray-300'
                  )}>
                    {selectedFormat?.id === format.id && (
                      <Check className="h-2 w-2 text-white" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{format.format.toUpperCase()}</div>
                    {format.inventory_quantity <= 5 && format.inventory_quantity > 0 && (
                      <div className="text-xs text-orange-600">
                        Only {format.inventory_quantity} left
                      </div>
                    )}
                    {format.inventory_quantity === 0 && (
                      <div className="text-xs text-red-600">
                        Out of stock
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-lg font-semibold">
                  €{(format.price / 100).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <Button
            onClick={addToCart}
            disabled={!selectedFormat || adding || !selectedFormat.available}
            className="w-full"
          >
            {adding ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart - €{selectedFormat ? (selectedFormat.price / 100).toFixed(2) : '0.00'}
              </>
            )}
          </Button>

          <div className="text-xs text-gray-500 text-center">
            Free shipping on orders over €50
          </div>
        </div>
      </CardContent>
    </Card>
  )
}