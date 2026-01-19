// import { createClient } from "@/lib/supabase/server"
// import { NextRequest, NextResponse } from "next/server"

// // ===================== GET =====================
// export async function GET(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const supabase = await createClient()

//     const { data, error } = await supabase
//       .from("reviews")
//       .select(`
//         id,
//         rating,
//         comment,
//         created_at,
//         user_email
//       `)
//       .eq("product_id", params.id)
//       .order("created_at", { ascending: false })

//     if (error) {
//       console.error("GET reviews error:", error)
//       return NextResponse.json({ error: error.message }, { status: 400 })
//     }

//     return NextResponse.json(data ?? [], { status: 200 })
//   } catch (err) {
//     console.error("GET /reviews fatal:", err)
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     )
//   }
// }

// // ===================== POST =====================
// export async function POST(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const supabase = await createClient()
//     const body = await request.json()

//     const rating = Number(body.rating)
//     const comment =
//       typeof body.comment === "string" ? body.comment.trim() : null

//     if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
//       return NextResponse.json(
//         { error: "Invalid rating (1–5)" },
//         { status: 400 }
//       )
//     }

//     const {
//       data: { user },
//       error: authError,
//     } = await supabase.auth.getUser()

//     if (authError || !user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const { data: review, error: upsertError } = await supabase
//       .from("reviews")
//       .upsert(
//         {
//           product_id: params.id,
//           user_id: user.id,
//           rating,
//           comment,
//         },
//         { onConflict: "product_id,user_id" }
//       )
//       .select()
//       .single()

//     if (upsertError) {
//       console.error("Upsert error:", upsertError)
//       return NextResponse.json(
//         { error: upsertError.message },
//         { status: 400 }
//       )
//     }

//     return NextResponse.json(review, { status: 201 })
//   } catch (err) {
//     console.error("POST /reviews fatal:", err)
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     )
//   }
// }
