import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function Offers() {
  return (
    <section className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-950/30 dark:to-pink-950/30">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h2 className="text-5xl font-bold text-balance">Exclusive Offers For You</h2>
            <p className="text-xl text-muted-foreground">ONLY ON BEST SELLERS PRODUCTS</p>
            <Button size="lg">Check Now</Button>
          </div>
          <div className="relative h-64 lg:h-96">
            <Image
              src="https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800&q=80"
              alt="Exclusive Offer"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
