import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("reviews")
      .select(`
        id,
        rating,
        comment,
        created_at,
        user:user_id (
          email
        )
      `)
      .eq("product_id", id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase GET error:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data, { status: 200 })
  } catch (err) {
    console.error("GET /reviews error:", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const supabase = await createClient()
    const { rating, comment } = await request.json()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Invalid rating (1-5)" }, { status: 400 })
    }

    // Insert or update review
    const { data: review, error } = await supabase
      .from("reviews")
      .upsert(
        {
          product_id: id,
          user_id: user.id,
          rating,
          comment: comment || null,
        },
        { onConflict: "product_id,user_id" }
      )
      .select()
      .single()

    if (error) {
      console.error("Review upsert error:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Recalculate rating
    const { data: allReviews, error: fetchError } = await supabase
      .from("reviews")
      .select("rating")
      .eq("product_id", id)

    if (!fetchError && allReviews?.length) {
      const validRatings = allReviews
        .map(r => r.rating)
        .filter((r): r is number => typeof r === "number")

      const avg =
        validRatings.reduce((a, b) => a + b, 0) / validRatings.length

      await supabase
        .from("products")
        .update({
          rating: Number(avg.toFixed(1)),
          review_count: validRatings.length,
        })
        .eq("id", id)
    }

    return NextResponse.json(review, { status: 201 })
  } catch (err) {
    console.error("POST /reviews error:", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
