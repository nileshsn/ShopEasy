# ShopEasy User Profile System Documentation

## Overview
The ShopEasy ecommerce application now includes a comprehensive user profile system that allows users to manage their account, view orders, and customize their shopping experience.

## Features

### 1. **User Profile Page** (`/profile`)
The profile page provides a complete account management dashboard with multiple sections:

#### Overview Tab
- **Quick Stats**: Displays total orders, wishlist items, and membership duration
- **Personal Information**: Shows user's full name, email, and account status
- **Recent Orders**: Quick preview of latest orders with ability to view details

#### Settings Tab
- Edit full name and phone number
- View and manage email address (read-only)
- Real-time profile updates with confirmation toast

#### Addresses Tab
- Add multiple delivery addresses
- Manage saved addresses for faster checkout
- Set default shipping address

#### Security Tab
- Password change functionality (via reset email)
- Two-factor authentication setup (ready for implementation)
- Active sessions management
- Account deletion option (with safeguards)

### 2. **Orders Page** (`/orders`)
Enhanced order management interface featuring:

#### Order List View
- Display all user orders with key information
- Color-coded status indicators:
  - 🟡 Pending: Order is being processed
  - 🔵 Processing: Being prepared for shipment
  - 🟣 Shipped: In transit to customer
  - 🟢 Delivered: Successfully received
  - 🔴 Cancelled: Order was cancelled

#### Order Details Modal
- Complete order information and timeline
- All items with images, quantities, and prices
- Order tracking timeline with status visualization
- Order ID and date information
- Total amount calculation

### 3. **Profile API Route** (`/api/profile`)

#### GET Endpoint
Fetches user profile data:
```bash
GET /api/profile
```

Returns:
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "phone": "+1234567890",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "postal_code": "10001"
  },
  "orders": [
    {
      "id": "order_id",
      "total_amount": 99.99,
      "status": "delivered",
      "created_at": "2024-01-01T00:00:00Z",
      "order_items": [...]
    }
  ]
}
```

#### PUT Endpoint
Updates user profile information:
```bash
PUT /api/profile
Content-Type: application/json

{
  "full_name": "John Doe",
  "phone": "+1234567890",
  "address": "456 Oak Ave",
  "city": "Boston",
  "state": "MA",
  "country": "USA",
  "postal_code": "02101"
}
```

### 4. **Navigation Integration**
Updated navbar with user profile menu:
- User email display in dropdown
- **My Profile** link - Access to profile management
- **My Orders** link - View all orders
- **Logout** button - End session

## Database Schema

The profile system uses the following Supabase tables:

### Profiles Table
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT,
  full_name TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  postal_code TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### Orders Table
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  total_amount DECIMAL,
  status TEXT,
  created_at TIMESTAMP,
  ...
)
```

### Order Items Table
```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  product_id UUID REFERENCES products(id),
  quantity INTEGER,
  price DECIMAL,
  ...
)
```

## Authentication Flow

1. User logs in via `/login` page
2. Supabase Authentication creates session
3. User profile automatically synced from `profiles` table
4. Navbar updates to show user dropdown menu
5. User can access `/profile` and `/orders` pages
6. Logout clears session and redirects to home

## Security Features

- **Row Level Security (RLS)**: Users can only view/edit their own profiles
- **Authentication Check**: All protected routes redirect unauthenticated users to login
- **Email Verification**: Email changes require verification (ready for implementation)
- **Password Reset**: Secure password change via email link

## Usage

### For Users
1. Sign up for an account
2. Click user icon in navbar → "My Profile"
3. Update profile information in Settings tab
4. Add delivery addresses
5. View all orders and track shipments
6. Manage security settings

### For Developers

#### Access Profile Data in Components
```typescript
const { data: profile } = await supabase
  .from("profiles")
  .select("*")
  .eq("id", user.id)
  .single()
```

#### Create Order (when checkout is implemented)
```typescript
const { data: order } = await supabase
  .from("orders")
  .insert({
    user_id: user.id,
    total_amount: cartTotal,
    status: "pending"
  })
  .select()
  .single()
```

## Future Enhancements

- [ ] Wishlist functionality
- [ ] Order reviews and ratings
- [ ] Saved payment methods
- [ ] Two-factor authentication
- [ ] Profile picture upload
- [ ] Address validation with postal codes
- [ ] Order notifications and emails
- [ ] Return/exchange management
- [ ] Loyalty points and rewards
- [ ] Gift cards

## Testing

### Test Profile Access
1. Open http://localhost:3000/profile
2. Should redirect to login if not authenticated
3. After login, should display profile data

### Test Orders Page
1. Navigate to http://localhost:3000/orders
2. Should show empty state if no orders exist
3. After creating orders (via checkout), should display them with correct status

### Test API Endpoints
```bash
# Get profile
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/profile

# Update profile
curl -X PUT -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"full_name": "Jane Doe"}' \
  http://localhost:3000/api/profile
```

## Troubleshooting

### Profile not loading
- Check if user is authenticated
- Verify Supabase connection in `.env.local`
- Check browser console for errors

### Orders not displaying
- Ensure orders exist in the database
- Verify user_id matches authenticated user
- Check order_items relationship is properly set up

### API endpoints returning 401
- Verify authentication token is valid
- Check Supabase session is active
- Ensure CORS is properly configured

## Support
For issues or questions about the profile system, please refer to the main README.md or check the GitHub issues.
