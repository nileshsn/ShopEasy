import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-sm font-medium text-primary">
              <span className="h-px w-12 bg-primary"></span>
              NEW ARRIVALS ONLY
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight text-balance">New Collections For Everyone</h1>
            <Button size="lg" className="gap-2">
              Latest Collection
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative h-96 lg:h-[500px]">
            <Image
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80"
              alt="Hero Image"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
