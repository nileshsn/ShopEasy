import Link from "next/link"
import { Instagram, Facebook, Twitter, ShoppingBag } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-muted mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag className="h-12 w-12" />
              <span className="text-2xl font-bold">ShopEasy</span>
            </div>
            <p className="text-muted-foreground">Your one-stop shop for fashion and style</p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground">
                  About
                </Link>
              </li>
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground">
                  Offices
                </Link>
              </li>
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Instagram className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Facebook className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Twitter className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ShopEasy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
