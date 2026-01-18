export interface Product {
  id: number
  name: string
  category: "men" | "women" | "kid"
  image_url: string
  new_price: number
  old_price: number | null
  description: string | null
  stock: number
  rating: number
  review_count: number
  created_at?: string
  updated_at?: string
}

export interface CartItem {
  id: number
  user_id: string
  product_id: number
  quantity: number
  product?: Product
}

export interface Order {
  id: number
  user_id: string
  total_amount: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  shipping_address: string
  created_at: string
}

export interface OrderItem {
  id: number
  order_id: number
  product_id: number
  quantity: number
  price: number
  product?: Product
}

export interface WishlistItem {
  id: number
  user_id: string
  product_id: number
  product?: Product
  created_at?: string
}

export interface Review {
  id: number
  product_id: number
  user_id: string
  rating: number
  comment?: string
  created_at?: string
  updated_at?: string
}
