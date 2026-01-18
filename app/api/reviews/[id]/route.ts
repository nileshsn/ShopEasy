import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data: reviews, error } = await supabase
      .from("reviews")
      .select("*, user:user_id(email)")
      .eq("product_id", id)
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json(reviews)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch reviews" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { rating, comment } = await request.json()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Invalid rating (1-5)" }, { status: 400 })
    }

    const { data: review, error } = await supabase
      .from("reviews")
      .insert([
        {
          product_id: id,
          user_id: user.id,
          rating,
          comment: comment || null,
        },
      ])
      .select()

    if (error) {
      if (error.code === "23505") {
        // Update existing review
        const { data: updated, error: updateError } = await supabase
          .from("reviews")
          .update({ rating, comment })
          .eq("product_id", id)
          .eq("user_id", user.id)
          .select()

        if (updateError) throw updateError
        return NextResponse.json(updated, { status: 200 })
      }
      throw error
    }

    // Update product rating
    const { data: allReviews } = await supabase
      .from("reviews")
      .select("rating")
      .eq("product_id", id)

    if (allReviews) {
      const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
      await supabase
        .from("products")
        .update({
          rating: Math.round(avgRating * 10) / 10,
          review_count: allReviews.length,
        })
        .eq("id", id)
    }

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to add review" },
      { status: 500 }
    )
  }
}
