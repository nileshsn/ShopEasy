import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

// ===================== GET REVIEWS =====================
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
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(data ?? [], { status: 200 })
  } catch (err) {
    console.error("GET /reviews fatal error:", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// ===================== POST REVIEW =====================
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const supabase = await createClient()
    const body = await request.json()

    const rating = Number(body.rating)
    const comment =
      typeof body.comment === "string" ? body.comment.trim() : null

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Invalid rating (1–5)" },
        { status: 400 }
      )
    }

    // Insert OR update review (no 409 conflicts)
    const { data: review, error: upsertError } = await supabase
      .from("reviews")
      .upsert(
        {
          product_id: id,
          user_id: user.id,
          rating,
          comment,
        },
        {
          onConflict: "product_id,user_id",
        }
      )
      .select()
      .single()

    if (upsertError) {
      console.error("Review upsert error:", upsertError)
      return NextResponse.json(
        { error: upsertError.message },
        { status: 400 }
      )
    }

    // Recalculate product rating
    const { data: allReviews, error: fetchError } = await supabase
      .from("reviews")
      .select("rating")
      .eq("product_id", id)

    if (fetchError) {
      console.error("Fetch reviews error:", fetchError)
    } else if (allReviews && allReviews.length > 0) {
      const validRatings = allReviews
        .map(r => r.rating)
        .filter((r): r is number => typeof r === "number")

      if (validRatings.length > 0) {
        const avg =
          validRatings.reduce((sum, r) => sum + r, 0) /
          validRatings.length

        const { error: updateError } = await supabase
          .from("products")
          .update({
            rating: Number(avg.toFixed(1)),
            review_count: validRatings.length,
          })
          .eq("id", id)

        if (updateError) {
          console.error("Product update error:", updateError)
        }
      }
    }

    return NextResponse.json(review, { status: 201 })
  } catch (err) {
    console.error("POST /reviews fatal error:", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
