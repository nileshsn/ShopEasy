import { createClient } from "@/lib/supabase/server"
import ProductItem from "@/components/shop/product-item"

export default async function Popular() {
  const supabase = await createClient()

  const { data: products } = await supabase.from("products").select("*").eq("category", "women").limit(4)

  if (!products || products.length === 0) return null

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-2">POPULAR IN WOMEN</h2>
        <div className="h-1 w-24 bg-primary mx-auto"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
