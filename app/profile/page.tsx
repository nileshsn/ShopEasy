"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { User, Settings, LogOut, Heart, MapPin, Shield, Package, ShoppingCart, X } from "lucide-react"

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    const getProfile = async () => {
      try {
        // Get authenticated user
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser()

        if (!authUser) {
          router.push("/login")
          return
        }

        setUser(authUser)

        // Get user profile from database
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authUser.id)
          .single()

        if (!error && profileData) {
          setProfile(profileData)
        } else {
          // Create profile if it doesn't exist
          setProfile({
            id: authUser.id,
            email: authUser.email,
            full_name: authUser.user_metadata?.full_name || "",
            phone: authUser.user_metadata?.phone || "",
            avatar_url: authUser.user_metadata?.avatar_url || "",
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load profile",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    getProfile()
  }, [router, supabase, toast])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast({
      title: "Logged out",
      description: "You've been logged out successfully.",
    })
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Account</h1>
          <p className="text-muted-foreground">Manage your profile and preferences</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <Card className="p-6 sticky top-20">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/20 mx-auto mb-4 flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <p className="font-semibold">{profile?.full_name || user.email?.split("@")[0]}</p>
                <p className="text-sm text-muted-foreground truncate">{user.email}</p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`w-full text-left px-4 py-2 rounded-md transition ${
                    activeTab === "overview"
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  <User className="inline-block w-4 h-4 mr-2" />
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("wishlist")}
                  className={`w-full text-left px-4 py-2 rounded-md transition ${
                    activeTab === "wishlist"
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  <Heart className="inline-block w-4 h-4 mr-2" />
                  Wishlist
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`w-full text-left px-4 py-2 rounded-md transition ${
                    activeTab === "settings"
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  <Settings className="inline-block w-4 h-4 mr-2" />
                  Settings
                </button>
                <button
                  onClick={() => setActiveTab("addresses")}
                  className={`w-full text-left px-4 py-2 rounded-md transition ${
                    activeTab === "addresses"
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  <MapPin className="inline-block w-4 h-4 mr-2" />
                  Addresses
                </button>
                <button
                  onClick={() => setActiveTab("security")}
                  className={`w-full text-left px-4 py-2 rounded-md transition ${
                    activeTab === "security"
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  <Shield className="inline-block w-4 h-4 mr-2" />
                  Security
                </button>
              </div>

              <Button
                variant="destructive"
                className="w-full mt-6"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {activeTab === "overview" && <OverviewTab profile={profile} user={user} />}
            {activeTab === "wishlist" && <WishlistTab user={user} />}
            {activeTab === "settings" && <SettingsTab profile={profile} user={user} />}
            {activeTab === "addresses" && <AddressesTab user={user} />}
            {activeTab === "security" && <SecurityTab user={user} />}
          </div>
        </div>
      </div>
    </div>
  )
}

// Overview Tab
function OverviewTab({ profile, user }: any) {
  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Package className="w-8 h-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Heart className="w-8 h-8 text-red-500" />
            <div>
              <p className="text-sm text-muted-foreground">Wishlist Items</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <User className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">Member Since</p>
              <p className="text-lg font-bold">{new Date(user.created_at).getFullYear()}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Personal Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Full Name</p>
            <p className="text-lg font-medium">{profile?.full_name || "Not set"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email Address</p>
            <p className="text-lg font-medium">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Account Status</p>
            <p className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
              Active
            </p>
          </div>
        </div>
      </Card>

      {/* Recent Orders */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
        <div className="text-center py-8">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No orders yet</p>
          <Button className="mt-4" variant="outline">
            Start Shopping
          </Button>
        </div>
      </Card>
    </div>
  )
}

// Settings Tab
function SettingsTab({ profile, user }: any) {
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    phone: profile?.phone || "",
  })
  const [saving, setSaving] = useState(false)
  const supabase = createClient()
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from("profiles")
        .update(formData)
        .eq("id", user.id)

      if (!error) {
        toast({
          title: "Success",
          description: "Profile updated successfully",
        })
      } else {
        throw error
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6">Profile Settings</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Full Name</label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg bg-background"
            placeholder="Enter your full name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg bg-background"
            placeholder="Enter your phone number"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Email Address</label>
          <input
            type="email"
            value={user.email}
            disabled
            className="w-full px-4 py-2 border rounded-lg bg-muted cursor-not-allowed"
          />
          <p className="text-xs text-muted-foreground mt-2">Email cannot be changed</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="w-full">
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </Card>
  )
}

// Addresses Tab
function AddressesTab({ user }: any) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6">Delivery Addresses</h3>
      <div className="text-center py-12">
        <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground mb-4">No addresses saved yet</p>
        <Button>Add New Address</Button>
      </div>
    </Card>
  )
}

// Security Tab
function SecurityTab({ user }: any) {
  const supabase = createClient()
  const { toast } = useToast()
  const [changing, setChanging] = useState(false)

  const handleChangePassword = async () => {
    setChanging(true)
    try {
      await supabase.auth.resetPasswordForEmail(user.email)
      toast({
        title: "Success",
        description: "Password reset link sent to your email",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setChanging(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Password */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Password</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Last changed: Never</p>
            <p className="text-sm font-medium mt-1">Change your password regularly</p>
          </div>
          <Button onClick={handleChangePassword} disabled={changing} variant="outline">
            {changing ? "Sending..." : "Change Password"}
          </Button>
        </div>
      </Card>

      {/* Two Factor Authentication */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Two-Factor Authentication</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Not enabled</p>
            <p className="text-sm font-medium mt-1">Add an extra layer of security</p>
          </div>
          <Button variant="outline" disabled>
            Enable 2FA
          </Button>
        </div>
      </Card>

      {/* Login History */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Active Sessions</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p className="font-medium">Current Session</p>
              <p className="text-sm text-muted-foreground">Browser • {new Date().toLocaleDateString()}</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm">Active</span>
          </div>
        </div>
      </Card>

      {/* Delete Account */}
      <Card className="p-6 border-red-200 bg-red-50">
        <h3 className="text-lg font-semibold mb-4 text-red-900">Danger Zone</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-red-800">Delete your account permanently</p>
            <p className="text-sm font-medium mt-1">This action cannot be undone</p>
          </div>
          <Button variant="destructive" disabled>
            Delete Account
          </Button>
        </div>
      </Card>
    </div>
  )
}
// Wishlist Tab
function WishlistTab({ user }: any) {
  const [wishlist, setWishlist] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const { data, error } = await supabase
          .from("wishlist")
          .select("*, product:product_id(*)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (error) throw error
        setWishlist(data || [])
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load wishlist",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchWishlist()
  }, [user.id, supabase, toast])

  const handleRemove = async (product_id: number) => {
    try {
      const { error } = await supabase
        .from("wishlist")
        .delete()
        .eq("product_id", product_id)
        .eq("user_id", user.id)

      if (error) throw error
      setWishlist((prev) => prev.filter((item) => item.product_id !== product_id))
      toast({
        title: "Removed",
        description: "Item removed from wishlist",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      })
    }
  }

  const handleAddToCart = async (product_id: number) => {
    try {
      const { error } = await supabase.from("cart_items").insert([
        {
          product_id,
          user_id: user.id,
          quantity: 1,
        },
      ])

      if (error && error.code !== "23505") throw error

      if (error?.code === "23505") {
        const { error: updateError } = await supabase
          .from("cart_items")
          .update({ quantity: 1 })
          .eq("product_id", product_id)
          .eq("user_id", user.id)

        if (updateError) throw updateError
      }

      toast({
        title: "Added to cart",
        description: "Item added to your cart",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add to cart",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">Loading wishlist...</p>
      </Card>
    )
  }

  if (wishlist.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
        <h3 className="text-xl font-semibold mb-2">Your Wishlist is Empty</h3>
        <p className="text-muted-foreground mb-6">Start adding items you love!</p>
        <Link href="/">
          <Button>Continue Shopping</Button>
        </Link>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">{wishlist.length} Saved Items</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {wishlist.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative aspect-square overflow-hidden bg-muted group">
                {item.product && (
                  <>
                    <Image
                      src={item.product.image_url || "/placeholder.svg"}
                      alt={item.product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Link href={`/product/${item.product.id}`}>
                        <Button size="sm" variant="secondary">
                          View
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleAddToCart(item.product_id)}
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRemove(item.product_id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>

              <div className="p-4">
                {item.product && (
                  <>
                    <Link href={`/product/${item.product.id}`}>
                      <h4 className="font-medium line-clamp-2 mb-2 hover:text-primary transition-colors">{item.product.name}</h4>
                    </Link>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold">${item.product.new_price.toFixed(2)}</span>
                      {item.product.rating > 0 && (
                        <span className="text-xs font-semibold flex items-center gap-1">
                          ★ {item.product.rating.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  )
}