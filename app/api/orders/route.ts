import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { shipping_address } = await request.json()
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!shipping_address) {
    return NextResponse.json({ error: "Shipping address is required" }, { status: 400 })
  }

  const { data: cartItems, error: cartError } = await supabase
    .from("cart_items")
    .select(
      `
      *,
      product:products(*)
    `,
    )
    .eq("user_id", user.id)

  if (cartError || !cartItems || cartItems.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.new_price * item.quantity, 0)
  const shipping = subtotal >= 50 ? 0 : 5
  const total_amount = subtotal + shipping

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      total_amount,
      shipping_address,
      status: "pending",
    })
    .select()
    .single()

  if (orderError) {
    return NextResponse.json({ error: orderError.message }, { status: 500 })
  }

  const orderItems = cartItems.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    quantity: item.quantity,
    price: item.product.new_price,
  }))

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

  if (itemsError) {
    return NextResponse.json({ error: itemsError.message }, { status: 500 })
  }

  const { error: deleteCartError } = await supabase.from("cart_items").delete().eq("user_id", user.id)

  if (deleteCartError) {
    return NextResponse.json({ error: deleteCartError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, order })
}

export async function GET() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: orders, error } = await supabase
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

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ orders })
}
