# ShopEasy - Full-Stack E-Commerce Platform

A modern, full-featured e-commerce platform built with Next.js 16, Supabase, and TypeScript.

## Features

- **Product Catalog**: Browse products by category (Men, Women, Kids)
- **User Authentication**: Secure signup/login with Supabase Auth
- **Shopping Cart**: Add, update, and remove items with real-time sync
- **Checkout System**: Complete order placement with shipping details
- **User Profile**: Comprehensive account management with personal information, addresses, and security settings
- **Order Management**: View order history, track status, and manage past purchases
- **Order Tracking**: Real-time order status updates with visual timeline
- **Newsletter**: Subscribe to exclusive offers
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Server-Side Rendering**: Fast page loads with Next.js 16

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Language**: TypeScript
- **Deployment**: Vercel

## Getting Started

### Quick Setup

For detailed setup instructions, see **[SETUP.md](SETUP.md)** for a complete step-by-step guide.

### Prerequisites

- Node.js 18+ installed
- Supabase account (free tier works great)
- Vercel account (optional, for deployment)

### Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Create Supabase project at supabase.com
# 3. Run scripts/001_create_tables.sql in Supabase SQL Editor
# 4. Run scripts/002_seed_products.sql in Supabase SQL Editor

# 5. Create .env.local with your Supabase credentials
# NEXT_PUBLIC_SUPABASE_URL=your_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
# NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/api/auth/callback

# 6. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

**Need help?** See [SETUP.md](SETUP.md) for detailed instructions and troubleshooting.

## User Profile System

The application includes a comprehensive user profile system for managing accounts and orders.

### Profile Features
- **Personal Information**: Manage name, email, phone, and address
- **Order History**: View all past orders with detailed tracking
- **Account Settings**: Edit profile information with real-time updates
- **Addresses**: Manage multiple delivery addresses
- **Security**: Password reset, session management, and account security settings

### Quick Links
- **Profile Page**: `/profile` - Complete account dashboard
- **Orders Page**: `/orders` - Order history and tracking
- **Profile API**: `/api/profile` - REST API for profile operations

## Database Setup

1. Run the SQL scripts in the `scripts/` folder in order:
   - `001_create_tables.sql` - Creates all tables and RLS policies
   - `002_seed_products.sql` - Seeds initial product data

2. The database includes:
   - Products table with 36 fashion items
   - User profiles with auth integration
   - Cart items with user isolation
   - Orders and order items tracking
   - Newsletter subscribers
   - Row Level Security (RLS) policies

## Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Deployment to Vercel

### Quick Deploy

1. Click "Publish" in v0 (if using v0)
2. Or push to GitHub and import in Vercel
3. Add environment variables in Vercel project settings
4. Update Supabase Auth URLs with your production domain
5. Deploy!

See [SETUP.md](SETUP.md) for detailed deployment instructions.

## License

MIT
