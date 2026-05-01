# DID Dashboard — Decentralized Identity Platform

A full-stack identity dashboard built with Next.js 14, NextAuth, MongoDB Atlas, and MetaMask wallet integration.

## 🏗️ Architecture

```
Frontend (Next.js 14 App Router)
       ↓
API Routes (REST backend)
       ↓
MongoDB Atlas (database)

MetaMask → Frontend → Backend → DB
```

## 🔴 Tier 1: Authentication (Core)

- **NextAuth.js** with JWT sessions
- **Signup** (`/api/signup`) — validate, hash password with bcrypt, store in MongoDB
- **Login** (`/api/auth/[...nextauth]`) — verify credentials, issue JWT session
- **Protected routes** — server-side session check in layout
- **Logout** — signs out, logs activity

## ⚙️ API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/signup` | Create account |
| `POST` | `/api/auth/signin` | NextAuth login |
| `GET` | `/api/user` | Fetch current user |
| `PATCH` | `/api/user` | Update name / wallet |
| `GET` | `/api/activity` | Paginated activity log |
| `POST` | `/api/activity` | Log an action |

## 🗄️ Database Schema

### Users
```json
{
  "name": "string (required, 2-50 chars)",
  "email": "string (required, unique, lowercase)",
  "password": "string (bcrypt hash, hidden from queries)",
  "walletAddress": "string (Ethereum address, optional)",
  "walletVerified": "boolean",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Activities
```json
{
  "userId": "ObjectId (ref: User)",
  "action": "signup | login | logout | profile_update | wallet_connect | wallet_disconnect | wallet_verify",
  "metadata": "Object (flexible)",
  "timestamp": "Date"
}
```

## 🚀 Setup

### 1. Clone & Install
```bash
git clone <your-repo>
cd did-dashboard
npm install
```

### 2. MongoDB Atlas
1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free cluster
3. Create a database user
4. Whitelist IP: `0.0.0.0/0` (for Vercel)
5. Copy the connection string

### 3. Environment Variables
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/did-dashboard?retryWrites=true&w=majority
NEXTAUTH_SECRET=your-random-32-char-secret-here
NEXTAUTH_URL=http://localhost:3000
```

Generate a secret:
```bash
openssl rand -base64 32
```

### 4. Run Locally
```bash
npm run dev
# Open http://localhost:3000
```

## 🌐 Deploy to Vercel

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "feat: initial DID dashboard"
git remote add origin https://github.com/your/repo.git
git push -u origin main
```

### Step 2: Import to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repo
4. Framework: **Next.js** (auto-detected)

### Step 3: Add Environment Variables
In Vercel project settings → Environment Variables:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | Your Atlas connection string |
| `NEXTAUTH_SECRET` | Random 32+ char string |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` |

### Step 4: Deploy
Click Deploy. Done! ✅

## 🦊 MetaMask Wallet Integration

The wallet section in the dashboard:
1. Detects MetaMask installation
2. Requests wallet connection (`eth_requestAccounts`)
3. Requests signature (`personal_sign`) for verification
4. Stores address and verification status in MongoDB
5. Displays connection status with shortened address

Wallet connect → logged as `wallet_connect` activity.

## 📊 Activity Tracking

Every key action is logged:
- `signup` — new account created
- `login` — user signed in
- `logout` — user signed out
- `profile_update` — name or profile changed
- `wallet_connect` — MetaMask linked
- `wallet_disconnect` — wallet removed
- `wallet_verify` — signature verified

## 🎨 Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **NextAuth.js v4** (JWT sessions)
- **MongoDB + Mongoose**
- **bcryptjs** (password hashing)
- **ethers.js v6** (wallet utilities)
- **Vercel** (deployment)
