"use client"

import { useState } from "react"
import Image from "next/image"
import { Star } from "lucide-react"
import type { Product } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import { useCart } from "@/components/providers/cart-provider"

interface ProductDisplayProps {
  product: Product
}

export default function ProductDisplay({ product }: ProductDisplayProps) {
  const [selectedSize, setSelectedSize] = useState("M")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { refreshCart } = useCart()
  const supabase = createClient()

  const sizes = ["S", "M", "L", "XL", "XXL"]

  const handleAddToCart = async () => {
    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to add items to cart",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    try {
      const { data: existingItem } = await supabase
        .from("cart_items")
        .select("*")
        .eq("user_id", user.id)
        .eq("product_id", product.id)
        .single()

      if (existingItem) {
        const { error } = await supabase
          .from("cart_items")
          .update({ quantity: existingItem.quantity + 1 })
          .eq("id", existingItem.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from("cart_items").insert({
          user_id: user.id,
          product_id: product.id,
          quantity: 1,
        })

        if (error) throw error
      }

      await refreshCart()

      toast({
        title: "Added to cart!",
        description: `${product.name} has been added to your cart`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="relative h-96 lg:h-[600px] rounded-lg overflow-hidden bg-muted">
            <Image
              src={product.image_url || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="relative h-24 rounded-lg overflow-hidden bg-muted cursor-pointer">
                <Image
                  src={product.image_url || "/placeholder.svg"}
                  alt={`${product.name} ${i}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-balance">{product.name}</h1>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-5 w-5 ${i < Math.round(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                ))}
              </div>
              <span className="font-semibold">{product.rating.toFixed(1)}</span>
              <span className="text-muted-foreground">({product.review_count} reviews)</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold">${product.new_price.toFixed(2)}</span>
            {product.old_price && (
              <span className="text-xl text-muted-foreground line-through">${product.old_price.toFixed(2)}</span>
            )}
          </div>

          {/* Stock Status */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
            product.stock > 0
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}>
            {product.stock > 0
              ? `✓ In Stock (${product.stock} available)`
              : "✗ Out of Stock"}
          </div>

          <p className="text-muted-foreground leading-relaxed">
            {product.description ||
              "Step into timeless elegance with this premium product. Perfect for any occasion, pair with your favorite accessories to complete the look."}
          </p>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Select Size</h3>
            <div className="flex gap-3">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-12 h-12 rounded-lg border-2 font-medium transition-colors ${selectedSize === size ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <Button 
            onClick={handleAddToCart} 
            disabled={loading || product.stock <= 0} 
            size="lg" 
            className="w-full md:w-auto px-12"
          >
            {loading ? "Adding..." : product.stock <= 0 ? "OUT OF STOCK" : "ADD TO CART"}
          </Button>

          <div className="space-y-2 pt-4 border-t">
            <p className="text-sm">
              <span className="font-semibold">Category:</span> {product.category === "kid" ? "Kids" : product.category},
              Clothing
            </p>
            <p className="text-sm">
              <span className="font-semibold">Tags:</span> Modern, Latest, Trending
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
