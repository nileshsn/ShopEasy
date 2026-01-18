import SignupForm from "@/components/auth/signup-form"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function SignupPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/")
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <SignupForm />
      </div>
    </div>
  )
}
