import Link from "next/link"
import Image from "next/image"
import type { Product } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"

interface ProductItemProps {
  product: Product
}

export default function ProductItem({ product }: ProductItemProps) {
  return (
    <Link href={`/product/${product.id}`}>
      <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
        <CardContent className="p-0">
          <div className="relative h-64 overflow-hidden bg-muted">
            <Image
              src={product.image_url || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="p-4 space-y-2">
            <h3 className="font-medium line-clamp-2 text-sm">{product.name}</h3>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">${product.new_price.toFixed(2)}</span>
              {product.old_price && (
                <span className="text-sm text-muted-foreground line-through">${product.old_price.toFixed(2)}</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
