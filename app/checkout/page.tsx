import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import CheckoutForm from "@/components/checkout/checkout-form"

export default async function CheckoutPage() {
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

  if (!cartItems || cartItems.length === 0) {
    redirect("/cart")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CheckoutForm cartItems={cartItems} />
    </div>
  )
}
