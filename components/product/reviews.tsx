// "use client"

// import { useEffect, useState } from "react"
// import { createClient } from "@/lib/supabase/client"
// import { Card } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { useToast } from "@/hooks/use-toast"
// import type { Review } from "@/lib/types"
// import { Star } from "lucide-react"

// interface ReviewsProps {
//   productId: number
// }

// export default function Reviews({ productId }: ReviewsProps) {
//   const [reviews, setReviews] = useState<Review[]>([])
//   const [loading, setLoading] = useState(true)
//   const [submitting, setSubmitting] = useState(false)
//   const [rating, setRating] = useState(5)
//   const [comment, setComment] = useState("")
//   const supabase = createClient()
//   const { toast } = useToast()

//   useEffect(() => {
//     fetchReviews()
//   }, [productId])

//   const fetchReviews = async () => {
//     try {
//       const response = await fetch(`/api/reviews/${productId}`)
//       if (!response.ok) throw new Error("Failed to fetch reviews")
//       const data = await response.json()
//       setReviews(data)
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to load reviews",
//         variant: "destructive",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleSubmitReview = async (e: React.FormEvent) => {
//   e.preventDefault()

//   if (submitting) return

//   try {
//     const {
//       data: { user },
//     } = await supabase.auth.getUser()

//     if (!user) {
//       toast({
//         title: "Please login",
//         description: "You need to be logged in to leave a review",
//       })
//       return
//     }

//     setSubmitting(true)

//     const response = await fetch(`/api/reviews/${productId}`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         rating: Number(rating), // 🔥 force number
//         comment,
//       }),
//     })

//     const data = await response.json()

//     if (!response.ok) {
//       throw new Error(data.error || "Failed to submit review")
//     }

//     setComment("")
//     setRating(5)
//     await fetchReviews()

//     toast({
//       title: "Review submitted",
//       description: "Thank you for your feedback!",
//     })
//   } catch (error: any) {
//     toast({
//       title: "Error",
//       description: error.message || "Failed to submit review",
//       variant: "destructive",
//     })
//   } finally {
//     setSubmitting(false)
//   }
// }


// const avgRating =
//   reviews.length > 0
//     ? (
//         reviews.reduce((sum, r) => sum + Number(r.rating), 0) /
//         reviews.length
//       ).toFixed(1)
//     : "0.0"

//   return (
//     <div className="space-y-8">
//       {/* Rating Summary */}
//       <Card className="p-6">
//         <div className="grid md:grid-cols-3 gap-6">
//           <div className="flex items-center gap-4">
//             <div className="text-center">
//               <p className="text-5xl font-bold">{avgRating}</p>
//               <div className="flex items-center justify-center gap-1 mt-2">
//                 {[...Array(5)].map((_, i) => (
//                   <Star
//                     key={i}
//                     className={`h-4 w-4 ${i < Math.round(Number(avgRating)) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
//                   />
//                 ))}
//               </div>
//               <p className="text-sm text-muted-foreground mt-2">{reviews.length} reviews</p>
//             </div>
//           </div>

//           {/* Rating Distribution */}
//           <div className="md:col-span-2 space-y-2">
//             {[5, 4, 3, 2, 1].map((star) => {
//               const count = reviews.filter((r) => r.rating === star).length
//               const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0
//               return (
//                 <div key={star} className="flex items-center gap-3">
//                   <span className="text-sm font-medium w-12">{star} ★</span>
//                   <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
//                     <div className="bg-yellow-400 h-full transition-all" style={{ width: `${percentage}%` }} />
//                   </div>
//                   <span className="text-sm text-muted-foreground w-12">{count}</span>
//                 </div>
//               )
//             })}
//           </div>
//         </div>
//       </Card>

//       {/* Review Form */}
//       <Card className="p-6">
//         <h3 className="font-semibold mb-4">Leave a Review</h3>
//         <form onSubmit={handleSubmitReview} className="space-y-4">
//           <div>
//             <label className="text-sm font-medium mb-2 block">Rating</label>
//             <div className="flex gap-2">
//               {[1, 2, 3, 4, 5].map((star) => (
//                 <button
//                   key={star}
//                   type="button"
//                   onClick={() => setRating(star)}
//                   className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                 >
//                   <Star
//                     className={`h-6 w-6 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
//                   />
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div>
//             <label className="text-sm font-medium mb-2 block">Comment (optional)</label>
//             <textarea
//               value={comment}
//               onChange={(e) => setComment(e.target.value)}
//               placeholder="Share your experience with this product..."
//               rows={4}
//               className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//             />
//           </div>

//           <Button type="submit" disabled={submitting}>
//             {submitting ? "Submitting..." : "Submit Review"}
//           </Button>
//         </form>
//       </Card>

//       {/* Reviews List */}
//       <div className="space-y-4">
//         <h3 className="font-semibold">All Reviews</h3>
//         {loading ? (
//           <p className="text-muted-foreground">Loading reviews...</p>
//         ) : reviews.length === 0 ? (
//           <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
//         ) : (
//           reviews.map((review) => (
//             <Card key={review.id} className="p-4">
//               <div className="flex items-start justify-between mb-2">
//                 <div className="flex items-center gap-3">
//                   <div className="flex gap-1">
//                     {[...Array(5)].map((_, i) => (
//                       <Star
//                         key={i}
//                         className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
//                       />
//                     ))}
//                   </div>
//                   <span className="font-medium">{review.rating.toFixed(1)} stars</span>
//                 </div>
//                 <span className="text-sm text-muted-foreground">
//                   {new Date(review.created_at || "").toLocaleDateString()}
//                 </span>
//               </div>
//               {review.comment && <p className="text-sm text-foreground">{review.comment}</p>}
//             </Card>
//           ))
//         )}
//       </div>
//     </div>
//   )
// }
