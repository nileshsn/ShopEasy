import Hero from "@/components/shop/hero"
import Popular from "@/components/shop/popular"
import Offers from "@/components/shop/offers"
import NewCollections from "@/components/shop/new-collections"
import NewsLetter from "@/components/shop/newsletter"

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <Popular />
      <Offers />
      <NewCollections />
      <NewsLetter />
    </div>
  )
}
