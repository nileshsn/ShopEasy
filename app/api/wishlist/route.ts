import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: wishlist, error } = await supabase
      .from("wishlist")
      .select("*, product:product_id(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json(wishlist)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch wishlist" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { product_id } = await request.json()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase
      .from("wishlist")
      .insert([{ product_id, user_id: user.id }])
      .select()

    if (error) {
      // If it's a unique constraint error, return success (already in wishlist)
      if (error.code === "23505") {
        return NextResponse.json({ message: "Already in wishlist" }, { status: 200 })
      }
      throw error
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to add to wishlist" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const product_id = searchParams.get("product_id")

    if (!product_id) {
      return NextResponse.json({ error: "product_id required" }, { status: 400 })
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { error } = await supabase
      .from("wishlist")
      .delete()
      .eq("product_id", Number(product_id))
      .eq("user_id", user.id)

    if (error) throw error

    return NextResponse.json({ message: "Removed from wishlist" })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to remove from wishlist" },
      { status: 500 }
    )
  }
}
