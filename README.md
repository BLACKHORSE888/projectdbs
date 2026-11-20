# Milletly — Try a smarter snack today

A production-ready, mobile-first D2C e-commerce web application for **Milletly**, an Indian baked millet snack brand. Built with React, Vite, TypeScript, Tailwind CSS, React Router, Framer Motion, Firebase Authentication (Google Sign-In), and Cloud Firestore.

## Features
- **Storefront & Product Discovery**: Dynamic Firestore-driven catalog with flavour filters, price sorting, product detail nutrition tables, 200g (₹250) & 50g Trial Pack (₹79) selectors.
- **Persistent Snack Bag**: Slide-over Cart Drawer synced to `localStorage` for guests and automatically merged into Firestore `carts/{uid}` upon Google Sign-In.
- **Google Authentication**: End-to-end `signInWithPopup` Google login with `AuthProvider`, user profile auto-creation in `users/{uid}`, and protected routes (`/checkout`, `/orders`, `/profile`, `/trial`, `/admin`).
- **COD / Pay on UPI Checkout**: Indian mobile & pincode validation, order creation, and a clean `paymentService.ts` abstraction ready for Razorpay integration.
- **30-Day Validation Flows**: Protected Free Trial Pack request page, snacking habits & willingness-to-pay survey, and Contact Us form.
- **Admin Dashboard**: Secured via `VITE_ADMIN_EMAILS` + `firestore.rules`. Includes stats cards, one-click **Seed Sample Data**, product CRUD, order/trial status management, and survey/message views.

---

## Local Setup & Running Independently

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Fill in your Firebase project values and admin emails (`VITE_ADMIN_EMAILS=you@gmail.com`).

3. **Start dev server**
   ```bash
   npm run dev
   ```

4. **Production build**
   ```bash
   npm run build
   ```

---

## Step-by-Step Firebase Setup

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/) and click **Add project**.
   - Register a **Web app** (`</>`) to obtain `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, and `appId`.

2. **Enable Google Sign-In**
   - Navigate to **Build → Authentication → Sign-in method**.
   - Click **Google**, toggle **Enable**, set your support email, and click **Save**.

3. **Create Cloud Firestore & Apply Security Rules**
   - Navigate to **Build → Firestore Database → Create database**.
   - Go to the **Rules** tab and paste the contents of `firestore.rules` from this repository.
   - Update the admin email allowlist inside `isAdmin()` in `firestore.rules` so it matches your `VITE_ADMIN_EMAILS` environment variable, then click **Publish**.
   - (Optional) Deploy indexes via Firebase CLI (`firebase deploy --only firestore:indexes`).

4. **Seed Initial Products**
   - Sign in with an email listed in `VITE_ADMIN_EMAILS` (and `firestore.rules`).
   - Open `/admin` and click **Seed Sample Data** to populate *Masala Ragi Chips*, *Jowar Peri-Peri Puffs*, and *Bajra Cheese Crunch*.

---

## Deploying to Vercel from GitHub

1. Push this repository to GitHub (`.gitignore` excludes `node_modules`, `.env`, and `dist`).
2. Import the repository in [Vercel](https://vercel.com/new):
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Add all variables from `.env.example` under **Project Settings → Environment Variables**:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_ADMIN_EMAILS`
   - `VITE_WHATSAPP_NUMBER`
4. Deploy! `vercel.json` handles SPA rewrites so React Router paths (`/shop`, `/admin`, `/orders`) work on page refresh.
5. **Authorize Your Vercel Domain in Firebase**:
   - In Firebase Console → **Authentication → Settings → Authorized domains**, click **Add domain** and enter your `your-app.vercel.app` (and custom domain if any) so Google Sign-In works in production.
