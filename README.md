# Digital Heroes 🏌️‍♂️🏆❤️

> **Play Golf. Win Prizes. Change Lives.**

Digital Heroes is a subscription-driven web platform designed exclusively for golfers. By combining the thrill of the game with the power of charitable giving, Digital Heroes allows players to log their monthly scores, enter into a mathematical prize draw, and generate real-world funds for charities in need.

---

## 🌟 The Core Concept

1. **Subscribe:** Users pay a monthly (£19.99) or yearly (£199.00) fee. **10%** of their subscription goes directly to a charity of their choice.
2. **Play Golf:** Users play local rounds of golf and log their Stableford scores via their dashboard.
3. **The Draw:** The platform grabs each user's oldest 5 rolling scores to act as their active "ticket" for the month.
4. **Win Prizes:** An algorithmic draw generates 5 winning numbers based on all submitted scores. Match 3, 4, or all 5 numbers to win a share of the calculated prize pool.

---

## 🔐 Reviewer Access (Test Account)

For evaluators reviewing this deployed application, you may access the locked Admin features (Draw Algorithm Engine, Winner Verifications) without modifying database constraints by logging in with this pre-configured Admin account:

* **Email:** `testemail@gmail.com`
* **Password:** `Test@1234`

*Note: This test account already has `is_admin` privileges and an active dummy Stripe subscription assigned in the backend.*

---

## 🚀 Features

### Player Dashboard
* **Score Manager:** A responsive wizard to input and track up to 45-point Stableford scores.
* **Charity Impact Metrics:** Real-time tracking of generated charitable donations.
* **Rolling 5-Score Algorithm:** The database strictly enforces 5 concurrent entries per user. Inputting a 6th score automatically drops the oldest score, keeping the active draw numbers fresh.

### Admin Control Center
* **Draw Engine Pipeline:** Run simulations to ensure the algorithm generates fair, profitable, and exciting draw scenarios before publishing official results.
* **Winner Verification:** Built-in safeguards requiring winners to submit photographic proof of their scorecards.
* **Global Metrics:** Real-time metrics on the size of the active prize pool, jackpot rollovers, and active subscriber count.

---

## 🛠️ Technology Stack

Digital Heroes is built for speed, security, and scalability using a modern React ecosystem:
* **Framework:** Next.js 14 (App Router)
* **Styling:** Tailwind CSS & Framer Motion
* **Database & Auth:** Supabase (PostgreSQL with Row Level Security policies)
* **Payments:** Stripe Checkout & Webhooks

---

## 📥 Local Development Quickstart

To run the platform locally, ensure you have Node.js and a connected Supabase project.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/PoojaSH694/digital-heroes.git
   cd digital-heroes
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Database Setup:**
   Run the `schema.sql` file in your Supabase SQL Editor to instantly generate the tables, RLS security policies, and seed data.

4. **Environment Variables:**
   Create a `.env.local` file in the root directory and configure your keys:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_pub_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   STRIPE_MONTHLY_PRICE_ID=your_monthly_price_id
   STRIPE_YEARLY_PRICE_ID=your_yearly_price_id
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

---

## 📝 Testing Guidelines

When testing locally without a live Stripe Webhook CLI proxy, user subscriptions will default to `inactive`. To fully test the Draw Engine algorithm, manually update a test user account's `subscription_status` to `active` and `is_admin` to `true` within the Supabase Table Editor. This grants full access to the `/admin` portal and ensures the user is processed in the prize simulation.

---

*Designed and developed by Pooja S. Hegde.*
