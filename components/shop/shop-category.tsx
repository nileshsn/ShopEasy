"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"
import ProductItem from "@/components/shop/product-item"
import { ChevronDown, SlidersHorizontal, X } from "lucide-react"
import { Card } from "@/components/ui/card"
import type { Product } from "@/lib/types"

interface ShopCategoryProps {
  category: "men" | "women" | "kid"
  banner: string
}

export default function ShopCategory({ category, banner }: ShopCategoryProps) {
  const supabase = createClient()
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  
  // Filters
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500])
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState<string>("newest")
  const [showFilters, setShowFilters] = useState(false)

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", category)
        .gte("new_price", priceRange[0])
        .lte("new_price", priceRange[1])
        .order("id")

      if (!error && data) {
        setProducts(data)
      }
      setLoading(false)
    }

    fetchProducts()
  }, [category, priceRange, supabase])

  // Apply filters and sorting
  useEffect(() => {
    let result = [...products]

    // Filter by rating
    if (selectedRating) {
      result = result.filter((p) => p.rating >= selectedRating)
    }

    // Sort products
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.new_price - b.new_price)
        break
      case "price-high":
        result.sort((a, b) => b.new_price - a.new_price)
        break
      case "rating":
        result.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
      default:
        result.sort((a, b) => b.id - a.id)
        break
    }

    setFilteredProducts(result)
  }, [products, selectedRating, sortBy])

  const resetFilters = () => {
    setPriceRange([0, 500])
    setSelectedRating(null)
    setSortBy("newest")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Banner */}
      <div className="relative h-48 md:h-64 mb-8 rounded-lg overflow-hidden">
        <Image src={banner || "/placeholder.svg"} alt={`${category} banner`} fill className="object-cover" />
      </div>

      {/* Top Controls */}
      <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold">{filteredProducts.length}</span> products found
        </p>

        <div className="flex gap-3 items-center">
          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted cursor-pointer text-sm"
          >
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="text-sm">Filters</span>
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Filters */}
        {showFilters && (
          <div className="w-full md:w-64 mb-6 md:mb-0">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Filters</h3>
                <button onClick={resetFilters} className="text-xs text-muted-foreground hover:text-foreground">
                  Reset
                </button>
              </div>

              {/* Price Range */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-3 block">Price Range</label>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="0"
                      max="500"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="w-full"
                    />
                    <input
                      type="range"
                      min="0"
                      max="500"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="text-sm font-medium mb-3 block">Rating</label>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <label key={rating} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="rating"
                          checked={selectedRating === rating}
                          onChange={() => setSelectedRating(selectedRating === rating ? null : rating)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">★ {rating} & up</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Products Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products found with your filters.</p>
              <button
                onClick={resetFilters}
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductItem key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
