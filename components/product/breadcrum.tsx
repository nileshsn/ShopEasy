import Link from "next/link"
import { ChevronRight } from "lucide-react"
import type { Product } from "@/lib/types"

interface BreadcrumProps {
  product: Product
}

export default function Breadcrum({ product }: BreadcrumProps) {
  return (
    <div className="container mx-auto px-4 py-4">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/" className="hover:text-foreground">
          Shop
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href={`/${product.category === "kid" ? "kids" : product.category}s`} className="hover:text-foreground">
          {product.category === "kid" ? "Kids" : product.category === "men" ? "Men" : "Women"}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground line-clamp-1">{product.name}</span>
      </nav>
    </div>
  )
}
