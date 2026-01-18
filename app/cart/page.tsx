import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import CartItems from "@/components/cart/cart-items"

export default async function CartPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: cartItems } = await supabase
    .from("cart_items")
    .select(
      `
      *,
      product:products(*)
    `,
    )
    .eq("user_id", user.id)

  return (
    <div className="container mx-auto px-4 py-8">
      <CartItems initialCartItems={cartItems || []} />
    </div>
  )
}
