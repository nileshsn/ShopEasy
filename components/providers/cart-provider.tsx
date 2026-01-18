"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface CartContextType {
  totalItems: number
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType>({
  totalItems: 0,
  refreshCart: async () => {},
})

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [totalItems, setTotalItems] = useState(0)
  const { toast } = useToast()
  const supabase = createClient()

  const refreshCart = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      const { data: cartItems } = await supabase.from("cart_items").select("quantity").eq("user_id", user.id)

      const total = cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0
      setTotalItems(total)
    } else {
      setTotalItems(0)
    }
  }

  useEffect(() => {
    refreshCart()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      refreshCart()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return <CartContext.Provider value={{ totalItems, refreshCart }}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)
