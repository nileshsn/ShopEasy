import { createClient } from "@/lib/supabase/server"
import Breadcrum from "@/components/product/breadcrum"
import ProductDisplay from "@/components/product/product-display"
import DescriptionBox from "@/components/product/description-box"
import RecommendedProducts from "@/components/product/recommended-products"
import Reviews from "@/components/product/reviews"
import { notFound } from "next/navigation"

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: product, error } = await supabase.from("products").select("*").eq("id", id).single()

  if (error || !product) {
    notFound()
  }

  return (
    <div className="flex flex-col">
      <Breadcrum product={product} />
      <ProductDisplay product={product} />
      <DescriptionBox />
      
      {/* Reviews Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>
        <Reviews productId={product.id} />
      </div>
      
      {/* Recommended Products */}
      <RecommendedProducts category={product.category} currentProductId={product.id} limit={4} />
    </div>
  )
}
