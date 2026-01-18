import { createClient } from "@/lib/supabase/server"
import Image from "next/image"
import ProductItem from "@/components/shop/product-item"
import { ChevronDown } from "lucide-react"

interface ShopCategoryProps {
  category: "men" | "women" | "kid"
  banner: string
}

export default async function ShopCategory({ category, banner }: ShopCategoryProps) {
  const supabase = await createClient()

  const { data: products } = await supabase.from("products").select("*").eq("category", category).order("id")

  const productCount = products?.length || 0

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative h-48 md:h-64 mb-8 rounded-lg overflow-hidden">
        <Image src={banner || "/placeholder.svg"} alt={`${category} banner`} fill className="object-cover" />
      </div>

      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold">Showing 1-{productCount}</span> out of {productCount} products
        </p>
        <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted">
          Sort by <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {products?.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>

      <div className="text-center">
        <button className="px-8 py-3 border rounded-full hover:bg-muted transition-colors">Explore More</button>
      </div>
    </div>
  )
}
