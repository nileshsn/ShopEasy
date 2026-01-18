import { createClient } from "@/lib/supabase/server"
import Breadcrum from "@/components/product/breadcrum"
import ProductDisplay from "@/components/product/product-display"
import DescriptionBox from "@/components/product/description-box"
import RelatedProducts from "@/components/product/related-products"
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
      <RelatedProducts category={product.category} currentProductId={product.id} />
    </div>
  )
}
