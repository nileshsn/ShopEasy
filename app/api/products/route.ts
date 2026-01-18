import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")

  const supabase = await createClient()

  let query = supabase.from("products").select("*").order("id", { ascending: true })

  if (category) {
    query = query.eq("category", category)
  }

  const { data: products, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ products })
}
