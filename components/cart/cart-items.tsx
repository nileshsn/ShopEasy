"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Trash2, Minus, Plus } from "lucide-react"
import type { CartItem } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useCart } from "@/components/providers/cart-provider"

interface CartItemsProps {
  initialCartItems: (CartItem & { product: any })[]
}

export default function CartItems({ initialCartItems }: CartItemsProps) {
  const [cartItems, setCartItems] = useState(initialCartItems)
  const [loading, setLoading] = useState<number | null>(null)
  const { toast } = useToast()
  const router = useRouter()
  const { refreshCart } = useCart()

  const updateQuantity = async (itemId: number, newQuantity: number) => {
    setLoading(itemId)

    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity }),
      })

      if (!response.ok) throw new Error("Failed to update quantity")

      if (newQuantity <= 0) {
        setCartItems(cartItems.filter((item) => item.id !== itemId))
      } else {
        setCartItems(cartItems.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)))
      }

      await refreshCart()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update cart",
        variant: "destructive",
      })
    } finally {
      setLoading(null)
    }
  }

  const removeItem = async (itemId: number) => {
    setLoading(itemId)

    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to remove item")

      setCartItems(cartItems.filter((item) => item.id !== itemId))
      await refreshCart()

      toast({
        title: "Removed",
        description: "Item removed from cart",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      })
    } finally {
      setLoading(null)
    }
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.new_price * item.quantity, 0)
  const shipping = subtotal > 0 ? 5.0 : 0
  const total = subtotal + shipping

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-muted-foreground mb-8">Add some items to get started!</p>
        <Link href="/">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
              <div className="relative h-24 w-24 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                <Image
                  src={item.product.image_url || "/placeholder.svg"}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1">
                <h3 className="font-semibold line-clamp-1">{item.product.name}</h3>
                <p className="text-sm text-muted-foreground capitalize">{item.product.category}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="font-bold">${item.product.new_price.toFixed(2)}</span>
                  <div className="flex items-center gap-2 border rounded-md">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={loading === item.id}
                      className="p-2 hover:bg-muted disabled:opacity-50"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-3 font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={loading === item.id}
                      className="p-2 hover:bg-muted disabled:opacity-50"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => removeItem(item.id)}
                disabled={loading === item.id}
                className="text-muted-foreground hover:text-destructive disabled:opacity-50"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="border rounded-lg p-6 sticky top-20">
          <h2 className="text-2xl font-bold mb-6">Cart Totals</h2>

          <div className="space-y-4">
            <div className="flex justify-between pb-4 border-b">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold">${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between pb-4 border-b">
              <span className="text-muted-foreground">Shipping Fee</span>
              <span className="font-semibold">${shipping.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <Link href="/checkout" className="block">
              <Button className="w-full" size="lg">
                PROCEED TO CHECKOUT
              </Button>
            </Link>
          </div>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Enter your promo code</p>
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                placeholder="Promo code"
                className="flex-1 px-3 py-2 border rounded-md bg-background"
              />
              <Button variant="outline">Submit</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
