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
                <Link href={`/product/${item.product.id}`}>
                  <h3 className="font-semibold line-clamp-1 hover:text-primary transition-colors">{item.product.name}</h3>
                </Link>
                <p className="text-sm text-muted-foreground capitalize">{item.product.category}</p>
                
                {/* Stock Status */}
                {item.product.stock <= 0 ? (
                  <p className="text-sm text-red-600 font-medium mt-1">Out of Stock</p>
                ) : item.product.stock < 5 ? (
                  <p className="text-sm text-orange-600 font-medium mt-1">Only {item.product.stock} left!</p>
                ) : null}

                <div className="flex items-center gap-4 mt-2">
                  <span className="font-bold text-lg">${item.product.new_price.toFixed(2)}</span>
                  {item.product.old_price && (
                    <span className="text-sm text-muted-foreground line-through">${item.product.old_price.toFixed(2)}</span>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-3 border rounded-md w-fit">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={loading === item.id || item.quantity <= 1}
                    className="p-2 hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={loading === item.id || item.quantity >= item.product.stock}
                    className="p-2 hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
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
        <div className="border rounded-lg p-6 sticky top-20 space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-4 pb-6 border-b">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal ({cartItems.length} items)</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                {subtotal > 0 ? (
                  <>
                    <span className="font-semibold text-green-600">
                      Free (over $50)
                    </span>
                  </>
                ) : (
                  <span className="font-semibold">${shipping.toFixed(2)}</span>
                )}
              </div>

              <div className="flex justify-between text-lg font-bold pt-4">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <Link href="/checkout" className="block">
              <Button className="w-full" size="lg">
                PROCEED TO CHECKOUT
              </Button>
            </Link>

            <Link href="/">
              <Button className="w-full mt-3" variant="outline">
                Continue Shopping
              </Button>
            </Link>
          </div>

          {/* Discount Info */}
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm font-medium text-green-900">✓ Free Shipping</p>
            <p className="text-xs text-green-800 mt-1">You've unlocked free shipping on this order!</p>
          </div>

          {/* Order Info */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-2 text-sm">
            <p className="font-medium text-blue-900">Order Information</p>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>✓ Secure checkout</li>
              <li>✓ Free returns within 30 days</li>
              <li>✓ Track your order in real-time</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
