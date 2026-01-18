import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import OrdersList from "@/components/orders/orders-list"

export default async function OrdersPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: orders } = await supabase
    .from("orders")
    .select(
      `
      *,
      order_items(
        *,
        product:products(*)
      )
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      <OrdersList orders={orders || []} />
    </div>
  )
}
