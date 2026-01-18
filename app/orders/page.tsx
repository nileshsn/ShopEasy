"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Package, ArrowRight, Calendar, DollarSign } from "lucide-react"

interface OrderItem {
  id: string
  quantity: number
  price: number
  products: {
    id: string
    name: string
    image_url: string
  }
}

interface Order {
  id: string
  total_amount: number
  status: string
  created_at: string
  order_items: OrderItem[]
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    const getOrders = async () => {
      try {
        // Get authenticated user
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push("/login")
          return
        }

        // Fetch user's orders with items and product details
        const { data, error } = await supabase
          .from("orders")
          .select(
            `
            id,
            total_amount,
            status,
            created_at,
            order_items (
              id,
              quantity,
              price,
              products (
                id,
                name,
                image_url
              )
            )
          `
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (error) throw error

        setOrders(data || [])
      } catch (error) {
        console.error("Error fetching orders:", error)
        toast({
          title: "Error",
          description: "Failed to load orders",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    getOrders()
  }, [router, supabase, toast])

  const getStatusColor = (status: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-800" },
      processing: { bg: "bg-blue-100", text: "text-blue-800" },
      shipped: { bg: "bg-purple-100", text: "text-purple-800" },
      delivered: { bg: "bg-green-100", text: "text-green-800" },
      cancelled: { bg: "bg-red-100", text: "text-red-800" },
    }
    return colors[status] || { bg: "bg-gray-100", text: "text-gray-800" }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Orders</h1>
          <p className="text-muted-foreground">View and track your purchases</p>
        </div>

        {orders.length === 0 ? (
          <Card className="p-12 text-center">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
            <p className="text-muted-foreground mb-6">
              Start shopping to see your orders here
            </p>
            <Button onClick={() => router.push("/")}>
              Continue Shopping
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  {/* Order Header */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 pb-6 border-b">
                    <div>
                      <p className="text-sm text-muted-foreground">Order ID</p>
                      <p className="font-mono font-semibold">{order.id.slice(0, 8).toUpperCase()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Order Date</p>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <p className="font-medium">
                          {new Date(order.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          getStatusColor(order.status).bg
                        } ${getStatusColor(order.status).text}`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                      <div className="flex items-center gap-1 justify-end">
                        <DollarSign className="w-4 h-4" />
                        <p className="text-2xl font-bold">
                          {order.total_amount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Order Items</h4>
                    <div className="space-y-3">
                      {order.order_items.map((item) => (
                        <div
                          key={item.id}
                          className="flex gap-4 p-4 bg-muted rounded-lg"
                        >
                          {item.products?.image_url && (
                            <img
                              src={item.products.image_url}
                              alt={item.products?.name}
                              className="w-20 h-20 rounded object-cover"
                            />
                          )}
                          <div className="flex-1">
                            <p className="font-medium">
                              {item.products?.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Qty: {item.quantity}
                            </p>
                            <p className="text-sm font-semibold mt-2">
                              ${item.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedOrder(order)}
                    >
                      View Details
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    {order.status === "delivered" && (
                      <Button variant="outline">
                        Write a Review
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Order Details</h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-muted-foreground hover:text-foreground text-2xl leading-none"
                  >
                    ×
                  </button>
                </div>

                {/* Order Summary */}
                <div className="space-y-6">
                  {/* Order Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Order ID</p>
                      <p className="font-mono font-semibold">{selectedOrder.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Order Date</p>
                      <p className="font-medium">
                        {new Date(selectedOrder.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          getStatusColor(selectedOrder.status).bg
                        } ${getStatusColor(selectedOrder.status).text}`}
                      >
                        {selectedOrder.status.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-lg font-bold">
                        ${selectedOrder.total_amount.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="border-t pt-6">
                    <h3 className="font-semibold mb-4">Items</h3>
                    <div className="space-y-4">
                      {selectedOrder.order_items.map((item) => (
                        <div
                          key={item.id}
                          className="flex gap-4 p-4 bg-muted rounded"
                        >
                          {item.products?.image_url && (
                            <img
                              src={item.products.image_url}
                              alt={item.products?.name}
                              className="w-24 h-24 rounded object-cover"
                            />
                          )}
                          <div className="flex-1">
                            <p className="font-medium">
                              {item.products?.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Quantity: {item.quantity}
                            </p>
                            <p className="text-sm font-semibold mt-2">
                              ${item.price.toFixed(2)} each
                            </p>
                          </div>
                          <div className="text-right font-semibold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Timeline */}
                  <div className="border-t pt-6">
                    <h3 className="font-semibold mb-4">Tracking</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <div>
                          <p className="font-medium">Order Confirmed</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(selectedOrder.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {selectedOrder.status !== "cancelled" && (
                        <>
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                ["shipped", "delivered"].includes(selectedOrder.status)
                                  ? "bg-green-500"
                                  : "bg-gray-300"
                              }`}
                            ></div>
                            <div>
                              <p className="font-medium">Shipped</p>
                              <p className="text-sm text-muted-foreground">
                                In progress
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                selectedOrder.status === "delivered"
                                  ? "bg-green-500"
                                  : "bg-gray-300"
                              }`}
                            ></div>
                            <div>
                              <p className="font-medium">Delivered</p>
                              <p className="text-sm text-muted-foreground">
                                {selectedOrder.status === "delivered"
                                  ? new Date(selectedOrder.created_at).toLocaleDateString()
                                  : "Expected soon"}
                              </p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Close Button */}
                  <Button
                    onClick={() => setSelectedOrder(null)}
                    className="w-full mt-6"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
