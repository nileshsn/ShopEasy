"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import type { Product } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Heart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"

interface ProductItemProps {
  product: Product
}

export default function ProductItem({ product }: ProductItemProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  const handleWishlistClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setLoading(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "Please login",
          description: "You need to be logged in to save wishlist items",
        })
        setLoading(false)
        return
      }

      if (isWishlisted) {
        // Remove from wishlist
        const { error } = await supabase
          .from("wishlist")
          .delete()
          .eq("product_id", product.id)
          .eq("user_id", user.id)

        if (error) throw error
        setIsWishlisted(false)
        toast({
          title: "Removed from wishlist",
          description: product.name,
        })
      } else {
        // Add to wishlist
        const { error } = await supabase
          .from("wishlist")
          .insert([{ product_id: product.id, user_id: user.id }])

        if (error && error.code !== "23505") throw error // 23505 = unique constraint
        setIsWishlisted(true)
        toast({
          title: "Added to wishlist",
          description: product.name,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update wishlist",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Link href={`/product/${product.id}`}>
      <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
        <CardContent className="p-0 relative">
          <div className="relative h-64 overflow-hidden bg-muted">
            <Image
              src={product.image_url || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            
            {/* Wishlist Button */}
            <button
              onClick={handleWishlistClick}
              disabled={loading}
              className="absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:bg-gray-100 transition-colors"
            >
              <Heart
                className={`h-5 w-5 transition-colors ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}`}
              />
            </button>

            {/* Stock Badge */}
            {product.stock <= 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-semibold">Out of Stock</span>
              </div>
            )}

            {/* Rating Badge */}
            {product.rating > 0 && (
              <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                <span>★</span>
                <span>{product.rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          <div className="p-4 space-y-2">
            <h3 className="font-medium line-clamp-2 text-sm group-hover:text-primary transition-colors">{product.name}</h3>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">${product.new_price.toFixed(2)}</span>
              {product.old_price && (
                <span className="text-sm text-muted-foreground line-through">${product.old_price.toFixed(2)}</span>
              )}
            </div>
            {product.review_count > 0 && (
              <p className="text-xs text-muted-foreground">{product.review_count} reviews</p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
