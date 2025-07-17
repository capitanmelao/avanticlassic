"use client"

import { createContext, useContext, useEffect, useReducer, ReactNode } from 'react'

// Types
interface CartItem {
  id: string
  productId: string
  priceId: string
  name: string
  artist: string
  format: string
  image: string
  price: number
  quantity: number
  catalog: string
}

interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
  isOpen: boolean
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_CART_OPEN'; payload: boolean }
  | { type: 'LOAD_CART'; payload: CartItem[] }

interface CartContextType {
  state: CartState
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  setCartOpen: (open: boolean) => void
  getTotalPrice: () => number
  getItemCount: () => number
}

// Initial state
const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
  isOpen: false
}

// Reducer
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => 
        item.productId === action.payload.productId && 
        item.priceId === action.payload.priceId
      )

      let newItems: CartItem[]
      
      if (existingItem) {
        // Update quantity of existing item
        newItems = state.items.map(item =>
          item.id === existingItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        // Add new item
        const newItem: CartItem = {
          ...action.payload,
          id: `${action.payload.productId}-${action.payload.priceId}-${Date.now()}`,
          quantity: 1
        }
        newItems = [...state.items, newItem]
      }

      const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const itemCount = newItems.reduce((count, item) => count + item.quantity, 0)

      return {
        ...state,
        items: newItems,
        total,
        itemCount
      }
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload)
      const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const itemCount = newItems.reduce((count, item) => count + item.quantity, 0)

      return {
        ...state,
        items: newItems,
        total,
        itemCount
      }
    }

    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(0, action.payload.quantity) }
          : item
      ).filter(item => item.quantity > 0)

      const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const itemCount = newItems.reduce((count, item) => count + item.quantity, 0)

      return {
        ...state,
        items: newItems,
        total,
        itemCount
      }
    }

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        total: 0,
        itemCount: 0
      }

    case 'SET_CART_OPEN':
      return {
        ...state,
        isOpen: action.payload
      }

    case 'LOAD_CART': {
      const total = action.payload.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const itemCount = action.payload.reduce((count, item) => count + item.quantity, 0)

      return {
        ...state,
        items: action.payload,
        total,
        itemCount
      }
    }

    default:
      return state
  }
}

// Context
const CartContext = createContext<CartContextType | undefined>(undefined)

// Provider
export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('avanti-cart')
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        dispatch({ type: 'LOAD_CART', payload: parsedCart })
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('avanti-cart', JSON.stringify(state.items))
  }, [state.items])

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    dispatch({ type: 'ADD_ITEM', payload: item })
  }

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
  }

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const setCartOpen = (open: boolean) => {
    dispatch({ type: 'SET_CART_OPEN', payload: open })
  }

  const getTotalPrice = () => state.total

  const getItemCount = () => state.itemCount

  const value: CartContextType = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    setCartOpen,
    getTotalPrice,
    getItemCount
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

// Hook
export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}