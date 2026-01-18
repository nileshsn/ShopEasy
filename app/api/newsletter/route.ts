import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { email } = await request.json()

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 })
  }

  const supabase = await createClient()

  const { error } = await supabase.from("newsletter_subscribers").insert({ email })

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Email already subscribed" }, { status: 400 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, message: "Successfully subscribed!" })
}
