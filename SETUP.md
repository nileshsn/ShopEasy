# ShopEasy Setup Guide

Complete step-by-step guide to get ShopEasy running locally and deploy to production.

---

## 🚀 Quick Start (10 minutes)

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in (or create free account)
2. Click **"New Project"**
3. Fill in project details:
   - **Name**: shopeasy (or your choice)
   - **Database Password**: Create a strong password (save it somewhere safe!)
   - **Region**: Choose closest to your location
4. Click **"Create new project"**
5. Wait ~2 minutes for project to initialize

### Step 3: Set Up Database

#### Option A: Using Supabase SQL Editor (Recommended)

1. In your Supabase project dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New query"** button
3. Copy the contents of `scripts/001_create_tables.sql` from this project
4. Paste into the SQL editor
5. Click **"Run"** (or press Cmd/Ctrl + Enter)
6. You should see: ✓ Success. No rows returned
7. Click **"New query"** again
8. Copy the contents of `scripts/002_seed_products.sql`
9. Paste and click **"Run"**
10. You should see: ✓ Success. No rows returned

Your database now has 36 products across Men, Women, and Kids categories!

#### Verify Database Setup

1. Click **"Table Editor"** in the left sidebar
2. You should see these tables:
   - `products` (36 rows)
   - `profiles`
   - `cart_items`
   - `orders`
   - `order_items`
   - `newsletter_subscribers`

### Step 4: Get Your API Credentials

1. In Supabase dashboard, click the **Settings** icon (gear) in the left sidebar
2. Go to **API** section
3. Find these two values:

**Project URL**: 
```
https://xxxxxxxxxxxxx.supabase.co
```

**anon/public key** (under "Project API keys"):
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 5: Configure Environment Variables

Create a file named `.env.local` in the root of your project:

```bash
# Create the file
touch .env.local
```

Add these variables (replace with your actual values from Step 4):

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/api/auth/callback
```

**⚠️ Important**: Replace the placeholder values with your actual credentials!

### Step 6: Start the Development Server

```bash
npm run dev
```

You should see:
```
✓ Ready on http://localhost:3000
```

### Step 7: Test the Application

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Try these features:**

1. ✅ Browse products on the homepage
2. ✅ Click on a product to view details
3. ✅ Navigate to Men's, Women's, or Kids sections
4. ✅ Click "Login" and create a new account
5. ✅ Check your email for verification (check spam folder)
6. ✅ Click the verification link
7. ✅ Add products to your cart
8. ✅ Go to cart and update quantities
9. ✅ Proceed to checkout
10. ✅ Complete an order
11. ✅ View your order in the Orders page

---

## 🔧 Troubleshooting

### "Module not found" or dependency errors

```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

### "Failed to fetch" when loading products

**Check 1**: Verify `.env.local` exists and has correct values
```bash
cat .env.local
```

**Check 2**: Verify database tables exist
- Go to Supabase → Table Editor
- Should see 6 tables with data

**Check 3**: Restart dev server
```bash
# Stop with Ctrl+C, then:
npm run dev
```

### Authentication issues

**Can't sign up**: 
1. Go to Supabase dashboard → Authentication → Providers
2. Make sure **"Email"** provider is enabled
3. Check **"Enable email confirmations"** is ON

**No verification email**:
- Check spam/junk folder
- Try different email address
- Check Supabase logs: Authentication → Logs

**Redirect errors**:
- Verify `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` is correct
- Should be: `http://localhost:3000/api/auth/callback`

### Cart not saving

**Check 1**: Make sure you're logged in

**Check 2**: Verify cart_items table exists with RLS policies
```sql
-- Run in Supabase SQL Editor
SELECT * FROM cart_items LIMIT 1;
```

**Check 3**: Clear browser cache and cookies

### Images not loading

Images are stored in the project's `public/` directory and should load automatically. If not:
- Check browser console for errors
- Verify files exist in `public/images/` folder
- Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

---

## 🌐 Deploy to Vercel

### Option A: Deploy from v0 (Easiest)

1. Click the **"Publish"** button in v0 interface
2. Connect your Vercel account
3. Your Supabase environment variables will be automatically configured
4. Done! 🎉

### Option B: Deploy from GitHub

#### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit - ShopEasy"
git branch -M main
git remote add origin https://github.com/yourusername/shopeasy.git
git push -u origin main
```

#### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: .next

5. Add environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=https://your-app.vercel.app/api/auth/callback
```

**⚠️ Important**: Change the redirect URL to your production domain!

6. Click **"Deploy"**

#### 3. Update Supabase Settings

After deployment, update your Supabase configuration:

1. Go to Supabase dashboard → Authentication → URL Configuration
2. **Site URL**: Add your Vercel URL (e.g., `https://your-app.vercel.app`)
3. **Redirect URLs**: Add `https://your-app.vercel.app/api/auth/callback`
4. Click **"Save"**

---

## 📊 Database Schema Overview

The application uses 6 main tables:

### `products`
- Stores all product information (name, price, images, category)
- 36 pre-loaded products across 3 categories

### `profiles`
- Extends Supabase auth with user profiles
- Auto-created when user signs up

### `cart_items`
- Stores shopping cart for each user
- Protected by Row Level Security (RLS)

### `orders`
- Stores order information
- Links to user profiles

### `order_items`
- Stores individual items in each order
- Links to products and orders

### `newsletter_subscribers`
- Stores email addresses for marketing

---

## 🔐 Security Features

- **Row Level Security (RLS)**: Users can only access their own data
- **Secure Authentication**: Supabase handles password hashing and JWT tokens
- **API Protection**: All sensitive operations require authentication
- **Type Safety**: Full TypeScript coverage prevents runtime errors

---

## 📁 Project Structure

```
shopeasy/
├── app/                           # Next.js 16 App Router
│   ├── (auth)/
│   │   ├── login/                # Login page
│   │   └── signup/               # Signup page
│   ├── api/
│   │   ├── auth/callback/        # Auth callback handler
│   │   ├── cart/                 # Cart API routes
│   │   ├── newsletter/           # Newsletter subscription
│   │   ├── orders/               # Orders API
│   │   └── products/             # Products API
│   ├── cart/                     # Shopping cart page
│   ├── checkout/                 # Checkout page
│   ├── kids/                     # Kids products
│   ├── mens/                     # Men's products
│   ├── orders/                   # Order history
│   ├── product/[id]/            # Product detail pages
│   ├── womens/                   # Women's products
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Homepage
│   └── globals.css              # Global styles
├── components/
│   ├── auth/                    # Login/signup forms
│   ├── cart/                    # Cart components
│   ├── checkout/                # Checkout form
│   ├── layout/                  # Navbar, footer
│   ├── orders/                  # Order list
│   ├── product/                 # Product cards, display
│   └── shop/                    # Hero, collections, etc.
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Browser Supabase client
│   │   └── server.ts           # Server Supabase client
│   └── types.ts                # TypeScript definitions
├── public/                      # Static assets
│   └── images/                 # Product images
├── scripts/
│   ├── 001_create_tables.sql   # Database schema
│   └── 002_seed_products.sql   # Sample data
└── proxy.ts                    # Middleware for auth
```

---

## 🎯 Next Steps

Now that you have ShopEasy running:

1. **Customize Products**: Edit `scripts/002_seed_products.sql` to add your own products
2. **Add Payment**: Integrate Stripe or other payment providers
3. **Email Notifications**: Set up order confirmation emails
4. **Admin Dashboard**: Build admin panel for managing products and orders
5. **Analytics**: Add tracking with Vercel Analytics or Google Analytics

---

## 💡 Tips

- **Development**: Use `npm run dev` for hot reload during development
- **Production**: Always test with `npm run build && npm start` before deploying
- **Database**: Regularly backup your Supabase database from the dashboard
- **Environment Variables**: Never commit `.env.local` to version control
- **Performance**: Images are optimized with Next.js Image component

---

## 📝 Summary

You now have a production-ready e-commerce platform featuring user authentication with email verification, complete shopping cart with persistent storage, secure checkout and order management, 36 pre-loaded products across three categories, and full mobile responsiveness. The entire setup takes about 10 minutes, and you're ready to deploy to Vercel immediately!

Happy selling! 🛍️
