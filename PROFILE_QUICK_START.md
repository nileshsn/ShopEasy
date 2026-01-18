# Profile System - Quick Start Guide

## What's Included

### Pages Created
- **Profile Page** (`app/profile/page.tsx`) - Complete user account management
- **Orders Page** (`app/orders/page.tsx`) - Order history and tracking

### API Routes
- **Profile API** (`app/api/profile/route.ts`) - GET/PUT user profile data

### Components Updated
- **Navbar** (`components/layout/navbar.tsx`) - Added Profile link in user dropdown

## Key Features

### 👤 User Profile
- View and edit personal information (name, phone, address)
- Manage delivery addresses
- Security settings (password change, 2FA setup)
- Account overview with quick stats

### 📦 Orders Management
- View all past orders with status tracking
- Order details modal with full information
- Order timeline showing progress
- Product images and prices
- Order review option (for delivered orders)

### 🔒 Security
- Email verification required for sign-up
- Password reset via secure link
- Session management
- RLS policies on database

## How to Use

### 1. Access Your Profile
```
1. Log in to the app
2. Click the user icon (👤) in the navbar
3. Select "My Profile"
```

### 2. Update Profile Information
```
1. Go to Profile → Settings tab
2. Edit your name, phone, and address
3. Click "Save Changes"
```

### 3. View Orders
```
1. Click user icon → "My Orders" OR
2. Go to /orders directly
3. Click "View Details" on any order
```

### 4. Manage Addresses
```
1. Go to Profile → Addresses tab
2. Add new delivery addresses
3. Set default address for checkout
```

### 5. Security Settings
```
1. Go to Profile → Security tab
2. Change password (sends reset email)
3. View active sessions
```

## Database Setup

The profile system requires these tables in Supabase:

```sql
-- Profiles table (created in 001_create_tables.sql)
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
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Only users can view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Only users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

Check `scripts/001_create_tables.sql` for complete setup.

## API Endpoints

### Get User Profile
```
GET /api/profile

Response:
{
  "user": {
    "id": "uuid",
    "email": "user@email.com",
    "full_name": "John Doe",
    "phone": "+1234567890",
    ...
  },
  "orders": [...]
}
```

### Update User Profile
```
PUT /api/profile
Content-Type: application/json

{
  "full_name": "John Doe",
  "phone": "+1234567890",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "country": "USA",
  "postal_code": "10001"
}
```

## Testing

### Test in Development
```bash
# Start dev server
pnpm dev

# Visit
http://localhost:3000/profile
http://localhost:3000/orders
```

### Manual Testing Steps
1. ✅ Sign up with new email
2. ✅ Navigate to profile page
3. ✅ Update name and phone
4. ✅ Check profile updates
5. ✅ Go to orders page (should be empty)
6. ✅ Try logout and login again

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

## File Structure

```
app/
├── profile/
│   └── page.tsx          # Profile management page
├── orders/
│   └── page.tsx          # Orders list and details
└── api/
    └── profile/
        └── route.ts      # Profile API endpoints

components/
└── layout/
    └── navbar.tsx        # Updated with profile menu
```

## Customization

### Change Profile Fields
1. Edit the form in `app/profile/page.tsx` (SettingsTab)
2. Add new columns to `profiles` table
3. Update API route in `app/api/profile/route.ts`

### Customize Order Status Colors
Edit `getStatusColor` function in `app/orders/page.tsx`:
```typescript
const getStatusColor = (status: string) => {
  const colors: Record<string, { bg: string; text: string }> = {
    pending: { bg: "bg-yellow-100", text: "text-yellow-800" },
    // Add more statuses...
  }
  return colors[status] || { bg: "bg-gray-100", text: "text-gray-800" }
}
```

## Troubleshooting

**Q: Profile page shows "Loading..." forever**
- Check if Supabase is connected
- Verify authentication token
- Check browser console for errors

**Q: Can't update profile**
- Verify RLS policies on `profiles` table
- Check user is authenticated
- Verify API route is working

**Q: Orders not showing**
- Create test orders in database
- Verify `orders` and `order_items` tables exist
- Check `user_id` matches authenticated user

## Next Steps

1. ✅ Set up profile system (DONE)
2. 📝 Implement checkout flow (saves orders)
3. 📝 Add order notifications via email
4. 📝 Create order reviews system
5. 📝 Add wishlist feature
6. 📝 Implement payment methods storage

## Support

For full documentation, see `PROFILE_SYSTEM.md`

For general app setup, see `SETUP.md`

For any issues, check GitHub issues or README.md
