export default function DescriptionBox() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="border rounded-lg">
        <div className="flex border-b">
          <button className="px-6 py-3 font-semibold border-b-2 border-primary">Description</button>
          <button className="px-6 py-3 text-muted-foreground hover:text-foreground">Reviews (122)</button>
        </div>
        <div className="p-6 space-y-4 text-muted-foreground">
          <p className="leading-relaxed">
            An e-commerce website is an online platform that facilitates the buying and selling of products or services
            over the internet. It serves as a virtual marketplace where businesses and individuals can showcase their
            products, interact with customers, and conduct transactions without the need for a physical presence.
          </p>
          <p className="leading-relaxed">
            E-commerce websites typically display products or services along with detailed descriptions, images, prices,
            and any available variations (e.g., sizes, colors). Each product usually has its own dedicated page with
            relevant information.
          </p>
        </div>
      </div>
    </div>
  )
}
