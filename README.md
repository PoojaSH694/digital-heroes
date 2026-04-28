# Digital Heroes 🏌️‍♂️🏆❤️

> **Play Golf. Win Prizes. Change Lives.**

Digital Heroes is a modern, subscription-driven web platform designed exclusively for golfers. By combining the thrill of the game with the power of charitable giving, Digital Heroes allows players to log their monthly scores, automatically enter into a massive prize draw, and generate real-world funds for charities in need.

---

## 🛠️ Technology Stack

* **Framework:** Next.js 14 App Router
* **Styling:** Tailwind CSS + Framer Motion
* **Database & Auth:** Supabase (PostgreSQL with Row Level Security)
* **Payments:** Stripe Checkout & Webhooks

---

## 🧪 Evaluator & Reviewer Testing Guide

If you are grading or evaluating this project, please follow this step-by-step guide to test the full lifecycle of the platform locally without needing to configure advanced background webhook processes.

### 1. User Signup & The Dashboard
To test the core player loop:
1. Run the local development server (`npm run dev`).
2. Navigate to `http://localhost:3000/signup`.
3. Create an account with a test email (e.g., `evaluator@test.com`) and select a charity.
4. You will be sent to the Stripe Checkout page. Because this is local development, **the Stripe webhook that automatically verifies payments will not trigger your local database unless you run `stripe listen` via the Stripe CLI**. 
5. To bypass this, after signing up, simply navigate directly to **`http://localhost:3000/dashboard`**.

### 2. Logging Scores
1. On the user dashboard, click **"+ Add New Score"**.
2. Input a Stableford score (1-45).
3. **Important:** Add exactly 5 scores. The Draw Engine requires a user to have a minimum of 5 "monthly" scores to qualify as an active participant.

### 3. Granting Yourself Admin Access (Manual Database Bypass)
To view the Admin Panel, evaluate the Draw Algorithm, and see the platform health metrics, you must grant your test account Admin permissions.
1. Open the [Supabase Dashboard](https://supabase.com/dashboard/projects) for this project.
2. Navigate to the **Table Editor** -> **`profiles`** table.
3. Locate the row with your test email (`evaluator@test.com`).
4. Change the **`is_admin`** column to `TRUE`.
5. Change the **`subscription_status`** column from `inactive` to `active`. *(This manually simulates a successful Stripe Webhook payment).*

### 4. Running The Draw Engine
1. Return to the application and navigate to **`http://localhost:3000/admin`**.
2. You will now see the Admin Control Center, confirming your Admin override worked!
3. Click on **Draw Management** in the sidebar.
4. Select the **Random** Draw Method and click **"Generate Numbers & Run Simulation"**.
5. The algorithm will process your 5 scores against 5 random winning numbers and output a transparent breakdown of payouts and charitable contributions!

---

## 🌟 Core Business Logic Highlights

* **The Rolling 5-Score Algorithm:** The database strictly enforces 5 entries per user per month. The moment a user inputs a 6th score, the oldest score is mathematically popped off the stack, ensuring the user's lottery "ticket" always represents their 5 most recent games of golf.
* **Algorithmic Security:** The `draw_entries` generated during simulations and official publishes are strictly read-only for standard users via Row Level Security (RLS) policies.
* **Charitable Guarantee:** The user's `charity_contribution_percent` is algorithmically factored into the platform's overall margin predictions before any "four-number" or "five-number" prize pool math is calculated, guaranteeing charitable obligations are met prior to user payouts.

---

*Project developed and submitted for evaluation.*
