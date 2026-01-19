"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Product } from "@/lib/types"
import ProductItem from "@/components/shop/product-item"

interface RecommendedProductsProps {
  category: "men" | "women" | "kid"
  currentProductId: number
  limit?: number
}

export default function RecommendedProducts({
  category,
  currentProductId,
  limit = 4,
}: RecommendedProductsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("category", category)
          .neq("id", currentProductId)
          .order("rating", { ascending: false })
          .limit(limit)

        if (!error && data) {
          setProducts(data)
        }
      } catch (error) {
        console.error("Failed to fetch recommendations:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [category, currentProductId, limit, supabase])

  if (loading) {
    return (
      <div className="py-12">
        <h2 className="text-2xl font-bold mb-8">Recommended Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(limit)].map((_, i) => (
            <div key={i} className="bg-muted h-64 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-2">Recommended Products</h2>
      <p className="text-muted-foreground mb-8">Based on your browsing and category preferences</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
