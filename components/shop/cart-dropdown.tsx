"use client"

import { Fragment } from 'react'
import Link from 'next/link'
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react'

import { useCart } from '@/contexts/cart-context'
import { useLanguage } from '@/contexts/language-context'
import { useTranslations } from '@/lib/translations'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'

export function CartDropdown() {
  const { 
    state, 
    removeItem, 
    updateQuantity, 
    clearCart, 
    setCartOpen, 
    getTotalPrice, 
    getItemCount 
  } = useCart()
  const { language } = useLanguage()
  const t = useTranslations(language)

  const itemCount = getItemCount()
  const total = getTotalPrice()

  return (
    <Sheet open={state.isOpen} onOpenChange={setCartOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative hidden md:inline-flex text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
        >
          <ShoppingCart className="h-5 w-5" />
          <span className="sr-only">{t.cart.title}</span>
          {itemCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs"
            >
              {itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-playfair">{t.cart.title}</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 flex-1 overflow-y-auto">
          {state.items.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">{t.cart.empty}</p>
              <Button 
                asChild 
                className="mt-4" 
                onClick={() => setCartOpen(false)}
              >
                <Link href="/shop">{t.cart.continueShopping}</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {state.items.map((item) => (
                <div key={item.id} className="flex gap-3 p-3 border rounded-lg">
                  <div className="w-16 h-16 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm line-clamp-2 mb-1">
                      {item.name}
                    </h4>
                    <p className="text-xs text-gray-600 mb-1">{item.artist}</p>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {item.format}
                      </Badge>
                      <span className="text-xs text-gray-500">{item.catalog}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-600"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">
                      €{(item.price * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">
                      €{item.price.toFixed(2)} {t.cart.each}
                    </p>
                  </div>
                </div>
              ))}
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{t.cart.subtotal}</span>
                  <span className="text-sm">€{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{t.cart.shipping}</span>
                  <span className="text-sm">{t.cart.calculatedAtCheckout}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="font-medium">{t.cart.total}</span>
                  <span className="font-medium text-lg">€{total.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="space-y-2 pt-4">
                <Button 
                  asChild 
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={() => setCartOpen(false)}
                >
                  <Link href="/shop/checkout">
                    {t.cart.proceedToCheckout}
                  </Link>
                </Button>
                <Button 
                  asChild 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setCartOpen(false)}
                >
                  <Link href="/shop/cart">
                    {t.cart.viewCart}
                  </Link>
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full text-red-500 hover:text-red-600"
                  onClick={clearCart}
                >
                  {t.cart.clearCart}
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

// Simple cart button for mobile
export function CartButton() {
  const { setCartOpen, getItemCount } = useCart()
  const { language } = useLanguage()
  const t = useTranslations(language)
  const itemCount = getItemCount()

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative md:hidden text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
      onClick={() => setCartOpen(true)}
    >
      <ShoppingCart className="h-5 w-5" />
      <span className="sr-only">{t.cart.title}</span>
      {itemCount > 0 && (
        <Badge 
          variant="destructive" 
          className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs"
        >
          {itemCount}
        </Badge>
      )}
    </Button>
  )
}