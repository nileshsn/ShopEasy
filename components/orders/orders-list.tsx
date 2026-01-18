import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import type { Order } from "@/lib/types"

interface OrdersListProps {
  orders: (Order & {
    order_items: Array<{
      id: number
      quantity: number
      price: number
      product: any
    }>
  })[]
}

export default function OrdersList({ orders }: OrdersListProps) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-16 border rounded-lg">
        <p className="text-muted-foreground">You haven't placed any orders yet.</p>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "text-green-600 bg-green-50"
      case "shipped":
        return "text-blue-600 bg-blue-50"
      case "processing":
        return "text-yellow-600 bg-yellow-50"
      case "cancelled":
        return "text-red-600 bg-red-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div key={order.id} className="border rounded-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 pb-4 border-b">
            <div>
              <p className="text-sm text-muted-foreground">
                Order #{order.id} • {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
              </p>
              <p className="text-lg font-semibold mt-1">${order.total_amount.toFixed(2)}</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium capitalize mt-2 md:mt-0 inline-block ${getStatusColor(order.status)}`}
            >
              {order.status}
            </span>
          </div>

          <div className="space-y-3">
            {order.order_items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                  <Image
                    src={item.product.image_url || "/placeholder.svg"}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                  <p className="text-sm font-semibold">${item.price.toFixed(2)} each</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold">Shipping Address:</span> {order.shipping_address}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
