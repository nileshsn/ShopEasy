"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import type { WishlistItem } from "@/lib/types"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, X } from "lucide-react"

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push("/login")
          return
        }

        const { data, error } = await supabase
          .from("wishlist")
          .select("*, product:product_id(*)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (error) throw error
        setWishlist(data || [])
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load wishlist",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchWishlist()
  }, [router, supabase, toast])

  const handleRemove = async (product_id: number) => {
    try {
      const { error } = await supabase
        .from("wishlist")
        .delete()
        .eq("product_id", product_id)

      if (error) throw error
      setWishlist((prev) => prev.filter((item) => item.product_id !== product_id))
      toast({
        title: "Removed",
        description: "Item removed from wishlist",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      })
    }
  }

  const handleAddToCart = async (product_id: number) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }

      const { error } = await supabase.from("cart_items").insert([
        {
          product_id,
          user_id: user.id,
          quantity: 1,
        },
      ])

      if (error && error.code !== "23505") throw error // 23505 = unique constraint

      // If unique constraint, just update quantity
      if (error?.code === "23505") {
        const { error: updateError } = await supabase
          .from("cart_items")
          .update({ quantity: 1 })
          .eq("product_id", product_id)
          .eq("user_id", user.id)

        if (updateError) throw updateError
      }

      toast({
        title: "Added to cart",
        description: "Item added to your cart",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add to cart",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading wishlist...</p>
      </div>
    )
  }

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h1 className="text-3xl font-bold mb-2">Your Wishlist is Empty</h1>
            <p className="text-muted-foreground mb-6">Start adding items you love!</p>
            <Link href="/">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
        <p className="text-muted-foreground mb-8">{wishlist.length} items saved</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative aspect-square overflow-hidden bg-muted group">
                {item.product && (
                  <>
                    <Image
                      src={item.product.image_url || "/placeholder.svg"}
                      alt={item.product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Link href={`/product/${item.product.id}`}>
                        <Button size="sm" variant="secondary">
                          View
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleAddToCart(item.product_id)}
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRemove(item.product_id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>

              <div className="p-4">
                {item.product && (
                  <>
                    <h3 className="font-medium line-clamp-2 mb-2">{item.product.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold">${item.product.new_price.toFixed(2)}</span>
                      {item.product.rating > 0 && (
                        <span className="text-xs font-semibold flex items-center gap-1">
                          ★ {item.product.rating.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
